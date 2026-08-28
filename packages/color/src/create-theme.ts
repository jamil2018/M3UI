import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  SchemeExpressive,
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  QuantizerCelebi,
  QuantizerMap,
  Score,
} from '@material/material-color-utilities';

/** M3 color spec version for dynamic schemes */
export const SPEC_VERSION = '2025' as const;
export type SpecVersion = typeof SPEC_VERSION | '2021';

export type ThemeVariant = 'expressive' | 'tonalSpot' | 'vibrant' | 'neutral' | 'monochrome';
export type ContrastPreference = -1 | 0 | 0.5 | 1;

export interface CreateThemeOptions {
  seed: string;
  variant?: ThemeVariant;
  contrast?: ContrastPreference;
  isDark?: boolean;
}

export interface ThemeColors {
  [role: string]: string;
}

export interface ThemeResult {
  colors: ThemeColors;
  css: string;
  cssVars: Record<string, string>;
}

const COLOR_ROLE_MAP: Record<string, (s: DynamicScheme) => number> = {
  primary: (s) => s.primary,
  onPrimary: (s) => s.onPrimary,
  primaryContainer: (s) => s.primaryContainer,
  onPrimaryContainer: (s) => s.onPrimaryContainer,
  secondary: (s) => s.secondary,
  onSecondary: (s) => s.onSecondary,
  secondaryContainer: (s) => s.secondaryContainer,
  onSecondaryContainer: (s) => s.onSecondaryContainer,
  tertiary: (s) => s.tertiary,
  onTertiary: (s) => s.onTertiary,
  tertiaryContainer: (s) => s.tertiaryContainer,
  onTertiaryContainer: (s) => s.onTertiaryContainer,
  error: (s) => s.error,
  onError: (s) => s.onError,
  errorContainer: (s) => s.errorContainer,
  onErrorContainer: (s) => s.onErrorContainer,
  background: (s) => s.background,
  onBackground: (s) => s.onBackground,
  surface: (s) => s.surface,
  onSurface: (s) => s.onSurface,
  surfaceVariant: (s) => s.surfaceVariant,
  onSurfaceVariant: (s) => s.onSurfaceVariant,
  outline: (s) => s.outline,
  outlineVariant: (s) => s.outlineVariant,
  shadow: (s) => s.shadow,
  scrim: (s) => s.scrim,
  inverseSurface: (s) => s.inverseSurface,
  inverseOnSurface: (s) => s.inverseOnSurface,
  inversePrimary: (s) => s.inversePrimary,
  surfaceDim: (s) => s.surfaceDim,
  surfaceBright: (s) => s.surfaceBright,
  surfaceContainerLowest: (s) => s.surfaceContainerLowest,
  surfaceContainerLow: (s) => s.surfaceContainerLow,
  surfaceContainer: (s) => s.surfaceContainer,
  surfaceContainerHigh: (s) => s.surfaceContainerHigh,
  surfaceContainerHighest: (s) => s.surfaceContainerHighest,
};

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/** MCU contrast levels: -1 reduced, 0 standard, 0.5 medium, 1 high */
const CONTRAST_LEVELS = {
  reduced: -1,
  standard: 0,
  medium: 0.5,
  high: 1,
} as const;

function contrastToLevel(contrast: ContrastPreference): number {
  switch (contrast) {
    case -1:
      return CONTRAST_LEVELS.reduced;
    case 0:
      return CONTRAST_LEVELS.standard;
    case 0.5:
      return CONTRAST_LEVELS.medium;
    case 1:
      return CONTRAST_LEVELS.high;
    default:
      return CONTRAST_LEVELS.standard;
  }
}

function buildScheme(options: CreateThemeOptions): DynamicScheme {
  const seedArgb = argbFromHex(options.seed);
  const sourceColorHct = Hct.fromInt(seedArgb);
  const contrastLevel = contrastToLevel(options.contrast ?? 0);
  const isDark = options.isDark ?? false;
  const variant = options.variant ?? 'expressive';

  if (variant === 'expressive') {
    return new SchemeExpressive(sourceColorHct, isDark, contrastLevel, SPEC_VERSION);
  }

  const theme = themeFromSourceColor(seedArgb);
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  return scheme as unknown as DynamicScheme;
}

export function createTheme(options: CreateThemeOptions): ThemeResult {
  const scheme = buildScheme(options);
  const colors: ThemeColors = {};
  const cssVars: Record<string, string> = {};

  for (const [role, getter] of Object.entries(COLOR_ROLE_MAP)) {
    const hex = hexFromArgb(getter(scheme));
    colors[role] = hex;
    const kebab = toKebabCase(role);
    cssVars[`--m3-color-${kebab}`] = hex;
    cssVars[`--md-sys-color-${kebab}`] = hex;
  }

  const cssLines = [':root {', ...Object.entries(cssVars).map(([k, v]) => `  ${k}: ${v};`), '}'];

  return {
    colors,
    css: cssLines.join('\n') + '\n',
    cssVars,
  };
}

export function themeToCss(options: CreateThemeOptions): string {
  return createTheme(options).css;
}

export function extractSeedFromImage(
  imageData: Uint8ClampedArray,
  _width: number,
  _height: number,
): string {
  const pixels = new Map<number, number>();
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i] ?? 0;
    const g = imageData[i + 1] ?? 0;
    const b = imageData[i + 2] ?? 0;
    const a = imageData[i + 3] ?? 0;
    if (a < 128) continue;
    const argb = ((255 << 24) | (r << 16) | (g << 8) | b) >>> 0;
    pixels.set(argb, (pixels.get(argb) ?? 0) + 1);
  }

  const quantizerResult = QuantizerCelebi.quantize(pixels, 128);
  const ranked = Score.score(QuantizerMap.quantize(quantizerResult.colorToCount as Map<number, number>));
  const topColor = ranked[0];
  if (topColor === undefined) {
    return '#6750A4';
  }
  return hexFromArgb(topColor);
}

export { SchemeExpressive, MaterialDynamicColors, CONTRAST_LEVELS };
