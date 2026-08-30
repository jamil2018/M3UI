import { describe, it, expect } from 'vitest';
import {
  auditThemeContrast,
  COLOR_FALLBACKS,
  createTheme,
  THEME_COLOR_ROLES,
  THEME_ROOT_SELECTOR,
  themeToCss,
} from '../src/index.js';

describe('@m3ui/color', () => {
  it.each(['#6750A4', '#006A6A', '#8C5000'])('emits complete accessible schemes for %s', (seed) => {
    for (const isDark of [false, true]) {
      const theme = createTheme({ seed, isDark, variant: 'expressive', contrast: 0 });
      expect(Object.keys(theme.colors)).toHaveLength(THEME_COLOR_ROLES.length);
      expect(auditThemeContrast(theme).filter((result) => !result.passes)).toEqual([]);
    }
  });

  it('creates light expressive theme from seed', () => {
    const theme = createTheme({
      seed: '#6750A4',
      variant: 'expressive',
      contrast: 0,
      isDark: false,
    });
    expect(theme.colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(theme.m3ColorVars['--m3-color-primary']).toBe(theme.colors.primary);
    expect(theme.sysColorVars['--md-sys-color-primary']).toBe('var(--m3-color-primary)');
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

  it('scopes theme CSS on data-m3-root with labs/gb alias pattern', () => {
    const css = themeToCss({ seed: '#6750A4', isDark: false });
    expect(css).toContain(`${THEME_ROOT_SELECTOR} {`);
    expect(css).not.toContain(':root {');
    expect(css).toContain('--m3-color-primary:');
    expect(css).toContain(`--md-sys-color-primary: var(--m3-color-primary, ${COLOR_FALLBACKS.primary});`);
  });

  it('exposes scoped cssVars for M3Provider inline styles', () => {
    const theme = createTheme({ seed: '#6750A4', isDark: false });
    expect(theme.cssVars['--m3-color-primary']).toBe(theme.colors.primary);
    expect(theme.cssVars['--md-sys-color-primary']).toBe('var(--m3-color-primary)');
    expect(Object.keys(theme.m3ColorVars)).toHaveLength(THEME_COLOR_ROLES.length);
    expect(Object.keys(theme.sysColorVars)).toHaveLength(THEME_COLOR_ROLES.length);
  });
});
