export {
  createTheme,
  themeToCss,
  extractSeedFromImage,
  SchemeExpressive,
  MaterialDynamicColors,
  CONTRAST_LEVELS,
  SPEC_VERSION,
  THEME_ROOT_SELECTOR,
  THEME_COLOR_ROLES,
  CONTRAST_ROLE_PAIRS,
  contrastRatio,
  auditThemeContrast,
} from './create-theme.js';

export { COLOR_FALLBACKS } from './color-fallbacks.js';

export type { SpecVersion } from './create-theme.js';

export type {
  CreateThemeOptions,
  ThemeColors,
  ThemeResult,
  ThemeVariant,
  ContrastPreference,
  ThemeColorRole,
  ContrastAuditResult,
} from './create-theme.js';
