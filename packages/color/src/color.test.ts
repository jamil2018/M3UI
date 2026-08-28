import { describe, it, expect } from 'vitest';
import { createTheme, themeToCss } from '../src/index.js';

describe('@m3ui/color', () => {
  it('creates light expressive theme from seed', () => {
    const theme = createTheme({
      seed: '#6750A4',
      variant: 'expressive',
      contrast: 0,
      isDark: false,
    });
    expect(theme.colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(theme.cssVars['--md-sys-color-primary']).toBeDefined();
  });

  it('creates dark high contrast theme', () => {
    const theme = createTheme({
      seed: '#6750A4',
      variant: 'expressive',
      contrast: 1,
      isDark: true,
    });
    expect(theme.colors.surface).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('emits CSS string', () => {
    const css = themeToCss({ seed: '#6750A4', isDark: false });
    expect(css).toContain(':root {');
    expect(css).toContain('--md-sys-color-primary');
  });
});
