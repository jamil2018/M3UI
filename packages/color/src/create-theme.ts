import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  SchemeExpressive,
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  QuantizerCelebi,
  Score,
} from '@material/material-color-utilities';
import { COLOR_FALLBACKS } from './color-fallbacks.js';

/** M3 color spec version for dynamic schemes */
export const SPEC_VERSION = '2025' as const;

/** Scoped theme boundary used by M3Provider and standalone theme CSS. */
export const THEME_ROOT_SELECTOR = '[data-m3-root]' as const;
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

export const THEME_COLOR_ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'background', 'onBackground', 'surface', 'onSurface', 'surfaceVariant',
  'onSurfaceVariant', 'surfaceTint', 'outline', 'outlineVariant', 'shadow', 'scrim',
  'inverseSurface', 'inverseOnSurface', 'inversePrimary', 'surfaceDim', 'surfaceBright',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer',
  'surfaceContainerHigh', 'surfaceContainerHighest',
] as const;

export type ThemeColorRole = (typeof THEME_COLOR_ROLES)[number];

export interface ThemeResult {
  colors: ThemeColors;
  css: string;
  /** All custom properties for inline style on `data-m3-root`. */
  cssVars: Record<string, string>;
  /** Source dynamic-color values (`--m3-color-*`). */
  m3ColorVars: Record<string, string>;
  /** labs/gb aliases (`--md-sys-color-*` → `var(--m3-color-*)`). */
  sysColorVars: Record<string, string>;
}

export interface ContrastAuditResult {
  foreground: ThemeColorRole;
  background: ThemeColorRole;
  ratio: number;
  passes: boolean;
}

export const CONTRAST_ROLE_PAIRS: ReadonlyArray<readonly [ThemeColorRole, ThemeColorRole]> = [
  ['onPrimary', 'primary'], ['onPrimaryContainer', 'primaryContainer'],
  ['onSecondary', 'secondary'], ['onSecondaryContainer', 'secondaryContainer'],
  ['onTertiary', 'tertiary'], ['onTertiaryContainer', 'tertiaryContainer'],
  ['onError', 'error'], ['onErrorContainer', 'errorContainer'],
  ['onSurface', 'surface'], ['onSurfaceVariant', 'surfaceVariant'],
  ['inverseOnSurface', 'inverseSurface'],
];

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function auditThemeContrast(theme: Pick<ThemeResult, 'colors'>, minimum = 4.5): ContrastAuditResult[] {
  return CONTRAST_ROLE_PAIRS.map(([foreground, background]) => {
    const ratio = contrastRatio(theme.colors[foreground]!, theme.colors[background]!);
    return { foreground, background, ratio, passes: ratio >= minimum };
  });
}

const COLOR_ROLE_MAP: Record<ThemeColorRole, (s: DynamicScheme) => number> = {
  primary: (s) => s.primary,
  onPrimary: (s) => s.onPrimary,
  primaryContainer: (s) => s.primaryContainer,
  onPrimaryContainer: (s) => s.onPrimaryContainer,
  primaryFixed: (s) => s.primaryFixed,
  primaryFixedDim: (s) => s.primaryFixedDim,
  onPrimaryFixed: (s) => s.onPrimaryFixed,
  onPrimaryFixedVariant: (s) => s.onPrimaryFixedVariant,
  secondary: (s) => s.secondary,
  onSecondary: (s) => s.onSecondary,
  secondaryContainer: (s) => s.secondaryContainer,
  onSecondaryContainer: (s) => s.onSecondaryContainer,
  secondaryFixed: (s) => s.secondaryFixed,
  secondaryFixedDim: (s) => s.secondaryFixedDim,
  onSecondaryFixed: (s) => s.onSecondaryFixed,
  onSecondaryFixedVariant: (s) => s.onSecondaryFixedVariant,
  tertiary: (s) => s.tertiary,
  onTertiary: (s) => s.onTertiary,
  tertiaryContainer: (s) => s.tertiaryContainer,
  onTertiaryContainer: (s) => s.onTertiaryContainer,
  tertiaryFixed: (s) => s.tertiaryFixed,
  tertiaryFixedDim: (s) => s.tertiaryFixedDim,
  onTertiaryFixed: (s) => s.onTertiaryFixed,
  onTertiaryFixedVariant: (s) => s.onTertiaryFixedVariant,
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
  surfaceTint: (s) => s.surfaceTint,
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

function sysColorVar(role: ThemeColorRole, includeFallback: boolean): string {
  const kebab = toKebabCase(role);
  const source = `var(--m3-color-${kebab})`;
  return includeFallback ? `var(--m3-color-${kebab}, ${COLOR_FALLBACKS[role]})` : source;
}

export function createTheme(options: CreateThemeOptions): ThemeResult {
  const scheme = buildScheme(options);
  const colors: ThemeColors = {};
  const m3ColorVars: Record<string, string> = {};
  const sysColorVars: Record<string, string> = {};

  for (const [role, getter] of Object.entries(COLOR_ROLE_MAP)) {
    const hex = hexFromArgb(getter(scheme));
    colors[role] = hex;
    const kebab = toKebabCase(role);
    const m3Key = `--m3-color-${kebab}`;
    const sysKey = `--md-sys-color-${kebab}`;
    m3ColorVars[m3Key] = hex;
    sysColorVars[sysKey] = `var(${m3Key})`;
  }

  const cssVars = { ...m3ColorVars, ...sysColorVars };
  const cssLines = [
    `${THEME_ROOT_SELECTOR} {`,
    ...Object.entries(m3ColorVars).map(([k, v]) => `  ${k}: ${v};`),
    ...THEME_COLOR_ROLES.map((role) => {
      const kebab = toKebabCase(role);
      return `  --md-sys-color-${kebab}: ${sysColorVar(role, true)};`;
    }),
    '}',
  ];

  return {
    colors,
    css: cssLines.join('\n') + '\n',
    cssVars,
    m3ColorVars,
    sysColorVars,
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
  const argbPixels: number[] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i] ?? 0;
    const g = imageData[i + 1] ?? 0;
    const b = imageData[i + 2] ?? 0;
    const a = imageData[i + 3] ?? 0;
    if (a < 128) continue;
    const argb = ((255 << 24) | (r << 16) | (g << 8) | b) >>> 0;
    argbPixels.push(argb);
  }

  const colorToCount = QuantizerCelebi.quantize(argbPixels, 128);
  const ranked = Score.score(colorToCount);
  const topColor = ranked[0];
  if (topColor === undefined) {
    return '#6750A4';
  }
  return hexFromArgb(topColor);
}

export { SchemeExpressive, MaterialDynamicColors, CONTRAST_LEVELS };
