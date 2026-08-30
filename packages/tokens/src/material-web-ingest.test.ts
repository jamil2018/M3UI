import { describe, it, expect } from 'vitest';
import {
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
        },
      },
    };
    const motion = extractMotionTokensFromSpec(spec);
    expect(motion['--md-sys-motion-easing-emphasized']).toBe('cubic-bezier(0.2, 0, 0, 1)');
    expect(motion['--md-sys-motion-duration-short1']).toBe('50ms');
    expect(motion['--md-sys-motion-duration-short2']).toBe('100ms');
    expect(summarizeMaterialWebIngest(spec).motionVarCount).toBeGreaterThanOrEqual(3);
  });
});
