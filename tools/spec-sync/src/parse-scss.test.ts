import { describe, expect, it } from 'vitest';
import { parseScssTokenFile, resolveMotionTokenReferences } from './parse-scss.js';

const FILLED_BUTTON_SCSS = `
$supported-tokens: (
  // go/keep-sorted start
  'container-color',
  'container-elevation',
  'container-height',
  'container-shape',
  'disabled-container-color',
  'hover-container-color',
  'label-text-color',
  // go/keep-sorted end
);

$unsupported-tokens: (
  // go/keep-sorted start
  'focus-state-layer-color',
  'focus-state-layer-opacity',
  'label-text-tracking',
  'label-text-type',
  // go/keep-sorted end
);

$value: var(--md-filled-button-container-shape, 20px);
`;

describe('parseScssTokenFile', () => {
  it('parses multi-line supported and unsupported token lists', () => {
    const parsed = parseScssTokenFile('_md-comp-filled-button.scss', FILLED_BUTTON_SCSS);
    expect(parsed.tokenLists.supported).toEqual([
      'container-color',
      'container-elevation',
      'container-height',
      'container-shape',
      'disabled-container-color',
      'hover-container-color',
      'label-text-color',
    ]);
    expect(parsed.tokenLists.unsupported).toEqual([
      'focus-state-layer-color',
      'focus-state-layer-opacity',
      'label-text-tracking',
      'label-text-type',
    ]);
  });

  it('parses scalar variables', () => {
    const parsed = parseScssTokenFile('_md-comp-filled-button.scss', FILLED_BUTTON_SCSS);
    expect(parsed.variables.value).toContain('md-filled-button-container-shape');
  });

  it('parses labs/gb motion CSS custom properties and resolves token refs', () => {
    const motionScss = `
@layer md.sys.motion {
  :root {
    --md-sys-motion-easing-emphasized: #{tokens.$md-sys-motion--easing-standard};
    --md-sys-motion-duration-short1: #{tokens.$md-sys-motion--duration-short1};
  }
}
`;
    const parsed = parseScssTokenFile('styles-motion-md-motion-tokens-easing.scss', motionScss);
    expect(parsed.variables['--md-sys-motion-easing-emphasized']).toBe(
      '#{tokens.$md-sys-motion--easing-standard}',
    );

    const all = {
      'styles-motion-md-motion-tokens-easing': parsed,
      'latest-sass-md-sys-motion': parseScssTokenFile('latest-sass-_md-sys-motion.scss', `
$easing-standard: cubic-bezier(0.2, 0, 0, 1);
$duration-short1: 50ms;
`),
    };
    resolveMotionTokenReferences(all);
    expect(all['styles-motion-md-motion-tokens-easing'].variables['--md-sys-motion-easing-emphasized']).toBe(
      'cubic-bezier(0.2, 0, 0, 1)',
    );
    expect(all['styles-motion-md-motion-tokens-easing'].variables['--md-sys-motion-duration-short1']).toBe('50ms');
  });
});
