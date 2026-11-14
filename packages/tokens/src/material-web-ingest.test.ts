import { describe, it, expect } from 'vitest';
import {
  elevationValueToShadowVar,
  expandContractToCssVars,
  extractMotionTokensFromSpec,
  hasMaterialWebContract,
  m3uiCompVarName,
  resolveScssTokenValue,
  summarizeMaterialWebIngest,
  upstreamCssVarName,
  type MaterialWebSpec,
} from '../scripts/material-web-ingest.js';

const CONTRACT_SPEC: MaterialWebSpec = {
  'md-comp-filled-button': {
    fileName: '_md-comp-filled-button.scss',
    variables: { 'container-color': 'var(--md-sys-color-primary)' },
    tokenLists: {
      supported: ['container-color', 'container-height', 'container-shape'],
      unsupported: ['focus-state-layer-color', 'label-text-type'],
    },
  },
};

describe('material-web-ingest', () => {
  it('detects contract JSON from tokenLists', () => {
    expect(hasMaterialWebContract(CONTRACT_SPEC)).toBe(true);
    expect(hasMaterialWebContract({ 'md-comp-filled-button': { fileName: '', variables: {} } })).toBe(
      false,
    );
  });

  it('maps upstream --md-* to --md-comp-* naming', () => {
    expect(upstreamCssVarName('md-comp-filled-button', 'container-color')).toBe(
      '--md-filled-button-container-color',
    );
    expect(m3uiCompVarName('md-comp-filled-button', 'container-color')).toBe(
      '--md-comp-filled-button-container-color',
    );
  });

  it('resolves md-sys SCSS references to CSS vars', () => {
    expect(resolveScssTokenValue('md-sys-color.$primary')).toBe('var(--md-sys-color-primary)');
    expect(resolveScssTokenValue('md-sys-elevation.$level1')).toBe('var(--md-sys-elevation-level1)');
    expect(resolveScssTokenValue('40px')).toBe('40px');
    expect(resolveScssTokenValue('if( $exclude-hardcoded-values, null, foo)')).toBeUndefined();
  });

  it('maps bare LevelN elevation values to two-layer shadow vars', () => {
    expect(elevationValueToShadowVar('Level1')).toBe('var(--md-sys-elevation-level1-shadow)');
    expect(elevationValueToShadowVar('6px')).toBe('var(--md-sys-elevation-level3-shadow)');
    expect(resolveScssTokenValue('Level1', 'container-elevation')).toBe(
      'var(--md-sys-elevation-level1-shadow)',
    );
    expect(resolveScssTokenValue('Level1')).toBe('var(--md-sys-elevation-level1)');
  });

  it('expands supported contracts to CSS var entries', () => {
    const spec: MaterialWebSpec = {
      ...CONTRACT_SPEC,
      'latest-sass-md-comp-filled-button': {
        fileName: 'latest-sass-_md-comp-filled-button.scss',
        variables: { 'container-color': 'md-sys-color.$primary', 'container-height': '40px' },
      },
    };
    const tokens = expandContractToCssVars(spec, 'md-comp-filled-button');
    expect(tokens).toHaveLength(2);
    expect(tokens.find((t) => t.suffix === 'container-color')?.value).toBe('var(--md-sys-color-primary)');
    expect(tokens.find((t) => t.suffix === 'container-height')?.value).toBe('40px');
  });

  it('emits Compose renamed aliases and resolvable unsupported state-layer tokens', () => {
    const spec: MaterialWebSpec = {
      'md-comp-checkbox': {
        fileName: '_md-comp-checkbox.scss',
        variables: {},
        tokenLists: {
          supported: ['hover-state-layer-color', 'selected-hover-state-layer-color'],
          unsupported: ['error-hover-state-layer-color', 'focus-state-layer-color'],
          renamed: {
            'unselected-hover-state-layer-color': 'hover-state-layer-color',
          },
        },
      },
      'latest-sass-_md-comp-checkbox': {
        fileName: 'latest-sass-_md-comp-checkbox.scss',
        variables: {
          'unselected-hover-state-layer-color': 'md-sys-color.$on-surface',
          'selected-hover-state-layer-color': 'md-sys-color.$primary',
          'error-hover-state-layer-color': 'md-sys-color.$error',
        },
      },
    };
    const tokens = expandContractToCssVars(spec, 'md-comp-checkbox');
    expect(tokens.find((t) => t.suffix === 'hover-state-layer-color')?.value).toBe(
      'var(--md-sys-color-on-surface)',
    );
    expect(tokens.find((t) => t.suffix === 'unselected-hover-state-layer-color')?.value).toBe(
      'var(--md-sys-color-on-surface)',
    );
    expect(tokens.find((t) => t.suffix === 'error-hover-state-layer-color')?.value).toBe(
      'var(--md-sys-color-error)',
    );
    expect(tokens.find((t) => t.suffix === 'focus-state-layer-color')).toBeUndefined();
  });

  it('resolves map.get($deps, …) SCSS references', () => {
    expect(
      resolveScssTokenValue("map.get($deps, 'md-sys-color', 'error')"),
    ).toBe('var(--md-sys-color-error)');
  });

  it('summarizes ingest counts', () => {
    const summary = summarizeMaterialWebIngest(CONTRACT_SPEC);
    expect(summary.contractFiles).toBe(1);
    expect(summary.filledButtonSupported).toBe(3);
    expect(summary.filledButtonUnsupported).toBe(2);
  });

  it('extracts motion tokens from labs/gb styles-motion and latest/sass fallback', () => {
    const spec: MaterialWebSpec = {
      'styles-motion-md-motion-tokens-easing': {
        fileName: 'styles-motion-md-motion-tokens-easing.scss',
        variables: {
          '--md-sys-motion-easing-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
          '--md-sys-motion-duration-short1': '50ms',
        },
      },
      'latest-sass-md-sys-motion': {
        fileName: 'latest-sass-_md-sys-motion.scss',
        variables: {
          'easing-standard': 'cubic-bezier(0.2, 0, 0, 1)',
          'duration-short2': '100ms',
          'spring-fast-spatial-stiffness': '1400',
          'spring-fast-spatial-damping': '0.9',
          'spring-fast-spatial': '/* Type "custom_composite" is not supported. */ null',
        },
      },
    };
    const motion = extractMotionTokensFromSpec(spec);
    expect(motion['--md-sys-motion-easing-emphasized']).toBe('cubic-bezier(0.2, 0, 0, 1)');
    expect(motion['--md-sys-motion-duration-short1']).toBe('50ms');
    expect(motion['--md-sys-motion-duration-short2']).toBe('100ms');
    expect(motion['--md-sys-motion-spring-fast-spatial-stiffness']).toBe('1400');
    expect(motion['--md-sys-motion-spring-fast-spatial-damping']).toBe('0.9');
    expect(motion['--md-sys-motion-spring-fast-spatial']).toBeUndefined();
    expect(summarizeMaterialWebIngest(spec).motionVarCount).toBeGreaterThanOrEqual(5);
  });
});
