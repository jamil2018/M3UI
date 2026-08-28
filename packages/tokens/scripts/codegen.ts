import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_DIR = join(__dirname, '../src/spec');
const OUT_DIR = join(__dirname, '../src/generated');

interface KotlinTokenFile {
  objectName: string;
  properties: Record<string, string | number | boolean>;
}

interface ScssTokenFile {
  variables: Record<string, string>;
}

/** M3 sys token definitions derived from spec + canonical values */
const STATE_LAYER_OPACITIES = {
  hover: 0.08,
  focus: 0.1,
  pressed: 0.1,
  dragged: 0.16,
} as const;

const ELEVATION_LEVELS = {
  level0: { elevation: 0, shadowOpacity: 0, surfaceTintOpacity: 0 },
  level1: { elevation: 1, shadowOpacity: 0.05, surfaceTintOpacity: 0.05 },
  level2: { elevation: 3, shadowOpacity: 0.08, surfaceTintOpacity: 0.08 },
  level3: { elevation: 6, shadowOpacity: 0.11, surfaceTintOpacity: 0.11 },
  level4: { elevation: 8, shadowOpacity: 0.12, surfaceTintOpacity: 0.12 },
  level5: { elevation: 12, shadowOpacity: 0.14, surfaceTintOpacity: 0.14 },
} as const;

const SHAPE_SCALE = {
  cornerNone: 0,
  cornerExtraSmall: 4,
  cornerSmall: 8,
  cornerMedium: 12,
  cornerLarge: 16,
  cornerExtraLarge: 28,
  cornerFull: 9999,
} as const;

const TYPE_SCALE = {
  displayLarge: { size: 57, lineHeight: 64, weight: 400, tracking: -0.25 },
  displayMedium: { size: 45, lineHeight: 52, weight: 400, tracking: 0 },
  displaySmall: { size: 36, lineHeight: 44, weight: 400, tracking: 0 },
  headlineLarge: { size: 32, lineHeight: 40, weight: 400, tracking: 0 },
  headlineMedium: { size: 28, lineHeight: 36, weight: 400, tracking: 0 },
  headlineSmall: { size: 24, lineHeight: 32, weight: 400, tracking: 0 },
  titleLarge: { size: 22, lineHeight: 28, weight: 400, tracking: 0 },
  titleMedium: { size: 16, lineHeight: 24, weight: 500, tracking: 0.15 },
  titleSmall: { size: 14, lineHeight: 20, weight: 500, tracking: 0.1 },
  labelLarge: { size: 14, lineHeight: 20, weight: 500, tracking: 0.1 },
  labelMedium: { size: 12, lineHeight: 16, weight: 500, tracking: 0.5 },
  labelSmall: { size: 11, lineHeight: 16, weight: 500, tracking: 0.5 },
  bodyLarge: { size: 16, lineHeight: 24, weight: 400, tracking: 0.5 },
  bodyMedium: { size: 14, lineHeight: 20, weight: 400, tracking: 0.25 },
  bodySmall: { size: 12, lineHeight: 16, weight: 400, tracking: 0.4 },
} as const;

const EMPHASIZED_WEIGHT_OFFSET = 200;

const MOTION_DURATIONS = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  extraLong1: 700,
  extraLong2: 800,
  extraLong3: 900,
  extraLong4: 1000,
} as const;

const MOTION_EASING = {
  linear: 'cubic-bezier(0, 0, 1, 1)',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
} as const;

const COLOR_ROLES = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
] as const;

function loadSpec(): {
  androidx: Record<string, KotlinTokenFile>;
  materialWeb: Record<string, ScssTokenFile>;
} {
  const androidxPath = join(SPEC_DIR, 'androidx-tokens.json');
  const materialWebPath = join(SPEC_DIR, 'material-web-tokens.json');

  let androidx: Record<string, KotlinTokenFile> = {};
  let materialWeb: Record<string, ScssTokenFile> = {};

  try {
    androidx = JSON.parse(readFileSync(androidxPath, 'utf-8')) as Record<string, KotlinTokenFile>;
  } catch {
    console.warn('No androidx-tokens.json found — using canonical defaults');
  }

  try {
    materialWeb = JSON.parse(readFileSync(materialWebPath, 'utf-8')) as Record<
      string,
      ScssTokenFile
    >;
  } catch {
    console.warn('No material-web-tokens.json found — using canonical defaults');
  }

  return { androidx, materialWeb };
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
}

/** Phase 1 androidx token objects → CSS custom properties (--md-comp-*) */
const PHASE1_ANDROIDX_OBJECTS = [
  'ButtonXSmallTokens',
  'ButtonSmallTokens',
  'ButtonMediumTokens',
  'ButtonLargeTokens',
  'ButtonXLargeTokens',
  'ElevatedButtonTokens',
  'FilledButtonTokens',
  'FilledTonalButtonTokens',
  'OutlinedButtonTokens',
  'TextButtonTokens',
  'XSmallIconButtonTokens',
  'SmallIconButtonTokens',
  'MediumIconButtonTokens',
  'LargeIconButtonTokens',
  'XLargeIconButtonTokens',
  'IconButtonTokens',
  'FilledIconButtonTokens',
  'FilledTonalIconButtonTokens',
  'OutlinedIconButtonTokens',
  'FabSmallTokens',
  'FabMediumTokens',
  'FabLargeTokens',
  'FabPrimaryContainerTokens',
  'ExtendedFabSmallTokens',
  'ExtendedFabMediumTokens',
  'ExtendedFabLargeTokens',
  'ExtendedFabPrimaryTokens',
  'CheckboxTokens',
  'RadioButtonTokens',
  'SwitchTokens',
  'FilledTextFieldTokens',
  'OutlinedTextFieldTokens',
  'ElevatedCardTokens',
  'FilledCardTokens',
  'OutlinedCardTokens',
  'ListTokens',
  'DividerTokens',
  'BadgeTokens',
  'PlainTooltipTokens',
  'RichTooltipTokens',
] as const;

/** Phase 2 androidx token objects → CSS custom properties (--md-comp-*) */
const PHASE2_ANDROIDX_OBJECTS = [
  'AssistChipTokens',
  'FilterChipTokens',
  'InputChipTokens',
  'SuggestionChipTokens',
  'ChipsTokens',
  'SliderTokens',
  'LinearProgressIndicatorTokens',
  'CircularProgressIndicatorTokens',
  'ProgressIndicatorTokens',
  'OutlinedSegmentedButtonTokens',
  'MenuTokens',
  'SnackbarTokens',
  'FilledAutocompleteTokens',
  'OutlinedAutocompleteTokens',
] as const;

/** Phase 3 androidx token objects → CSS custom properties (--md-comp-*) */
const PHASE3_ANDROIDX_OBJECTS = [
  'AppBarTokens',
  'AppBarSmallTokens',
  'AppBarMediumTokens',
  'AppBarLargeTokens',
  'AppBarMediumFlexibleTokens',
  'AppBarLargeFlexibleTokens',
  'BottomAppBarTokens',
  'NavigationBarTokens',
  'NavigationBarHorizontalItemTokens',
  'NavigationBarVerticalItemTokens',
  'NavigationDrawerTokens',
  'NavigationRailCollapsedTokens',
  'NavigationRailExpandedTokens',
  'NavigationRailColorTokens',
  'NavigationRailBaselineItemTokens',
  'NavigationRailHorizontalItemTokens',
  'NavigationRailVerticalItemTokens',
  'PrimaryNavigationTabTokens',
  'SecondaryNavigationTabTokens',
  'SearchBarTokens',
  'SearchViewTokens',
  'DialogTokens',
  'SheetBottomTokens',
  'ScrimTokens',
] as const;

/** Phase 4 androidx token objects → CSS custom properties (--md-comp-*) */
const PHASE4_ANDROIDX_OBJECTS = [
  'ButtonGroupSmallTokens',
  'ConnectedButtonGroupSmallTokens',
  'SplitButtonXSmallTokens',
  'SplitButtonSmallTokens',
  'SplitButtonMediumTokens',
  'SplitButtonLargeTokens',
  'SplitButtonXLargeTokens',
  'FabMenuBaselineTokens',
  'DockedToolbarTokens',
  'FloatingToolbarTokens',
] as const;

/** Phase 5 androidx token objects → CSS custom properties (--md-comp-*) */
const PHASE5_ANDROIDX_OBJECTS = [
  'DatePickerModalTokens',
  'DateInputModalTokens',
  'TimePickerTokens',
  'TimeInputTokens',
] as const;

const ALL_ANDROIDX_OBJECTS = [
  ...PHASE1_ANDROIDX_OBJECTS,
  ...PHASE2_ANDROIDX_OBJECTS,
  ...PHASE3_ANDROIDX_OBJECTS,
  ...PHASE4_ANDROIDX_OBJECTS,
  ...PHASE5_ANDROIDX_OBJECTS,
] as const;

const TYPE_SCALE_NAMES = new Set(Object.keys(TYPE_SCALE).map((k) => k.replace(/^./, (c) => c.toUpperCase())));

function objectNameToPrefix(name: string): string {
  return toKebabCase(name.replace(/Tokens$/, ''));
}

function propertyNameToKebab(name: string): string {
  return toKebabCase(name);
}

function resolveTokenValue(value: string): string {
  const dpMatch = /^(\d+(?:\.\d+)?)\.dp$/.exec(value);
  if (dpMatch) return `${parseFloat(dpMatch[1])}px`;

  const spMatch = /^(\d+(?:\.\d+)?)\.sp$/.exec(value);
  if (spMatch) return `${parseFloat(spMatch[1])}px`;

  if (value.startsWith('Corner')) {
    const cornerKey = value.replace(/^Corner/, 'corner');
    if (cornerKey === 'cornerExtraSmallTop') {
      return 'var(--md-sys-shape-corner-extra-small)';
    }
    const sysKey = toKebabCase(cornerKey);
    if (sysKey in SHAPE_SCALE || sysKey.replace(/-/g, '') in SHAPE_SCALE) {
      return `var(--md-sys-shape-${sysKey})`;
    }
    return `var(--md-sys-shape-${sysKey})`;
  }

  if (value.startsWith('ColorSchemeKeyTokens.')) {
    const role = value.replace('ColorSchemeKeyTokens.', '');
    return `var(--md-sys-color-${toKebabCase(role)})`;
  }

  if (/^Level\d$/.test(value)) {
    return `var(--md-sys-elevation-${value.toLowerCase()})`;
  }

  if (TYPE_SCALE_NAMES.has(value) || value in TYPE_SCALE) {
    const role = toKebabCase(value);
    return `var(--md-sys-typescale-${role}-size)`;
  }

  return value;
}

function generateComponentTokensCss(androidx: Record<string, KotlinTokenFile>): {
  css: string;
  vars: string[];
} {
  const lines: string[] = [];
  const vars: string[] = [];

  for (const objectName of ALL_ANDROIDX_OBJECTS) {
    const tokenFile = androidx[objectName];
    if (!tokenFile?.properties) continue;

    const prefix = objectNameToPrefix(objectName);
    for (const [prop, rawValue] of Object.entries(tokenFile.properties)) {
      const varName = `--md-comp-${prefix}-${propertyNameToKebab(prop)}`;
      const resolved = resolveTokenValue(String(rawValue));
      lines.push(`  ${varName}: ${resolved};`);
      vars.push(varName);
    }
  }

  return {
    css: lines.length > 0 ? `\n  /* Component tokens (Phase 1–4) */\n${lines.join('\n')}\n` : '',
    vars,
  };
}

function generateTokensCss(componentCss: string): string {
  const lines: string[] = [
    '/**',
    ' * @m3ui/tokens — generated from spec JSON',
    ' * Do not edit by hand. Run: pnpm tokens:codegen',
    ' */',
    ':root {',
  ];

  // Color roles (values injected by @m3ui/color at runtime or build time)
  for (const role of COLOR_ROLES) {
    const kebab = toKebabCase(role);
    lines.push(`  --md-sys-color-${kebab}: var(--m3-color-${kebab}, #6750a4);`);
  }

  // State layer opacities
  for (const [state, opacity] of Object.entries(STATE_LAYER_OPACITIES)) {
    lines.push(`  --md-sys-state-${state}-state-layer-opacity: ${opacity};`);
  }

  // Elevation
  for (const [level, values] of Object.entries(ELEVATION_LEVELS)) {
    const kebab = toKebabCase(level);
    lines.push(`  --md-sys-elevation-${kebab}: ${values.elevation}px;`);
    lines.push(`  --md-sys-elevation-${kebab}-shadow-opacity: ${values.shadowOpacity};`);
    lines.push(`  --md-sys-elevation-${kebab}-surface-tint-opacity: ${values.surfaceTintOpacity};`);
  }

  // Shape
  for (const [corner, radius] of Object.entries(SHAPE_SCALE)) {
    const kebab = toKebabCase(corner);
    lines.push(`  --md-sys-shape-${kebab}: ${radius}px;`);
  }

  // Type scale
  for (const [name, scale] of Object.entries(TYPE_SCALE)) {
    const kebab = toKebabCase(name);
    lines.push(`  --md-sys-typescale-${kebab}-size: ${scale.size}px;`);
    lines.push(`  --md-sys-typescale-${kebab}-line-height: ${scale.lineHeight}px;`);
    lines.push(`  --md-sys-typescale-${kebab}-weight: ${scale.weight};`);
    lines.push(`  --md-sys-typescale-${kebab}-tracking: ${scale.tracking}px;`);
    const emphasizedWeight = Math.min(scale.weight + EMPHASIZED_WEIGHT_OFFSET, 900);
    lines.push(`  --md-sys-typescale-${kebab}-weight-emphasized: ${emphasizedWeight};`);
  }

  // Motion durations
  for (const [name, ms] of Object.entries(MOTION_DURATIONS)) {
    const kebab = toKebabCase(name);
    lines.push(`  --md-sys-motion-duration-${kebab}: ${ms}ms;`);
  }

  // Motion easing
  for (const [name, bezier] of Object.entries(MOTION_EASING)) {
    const kebab = toKebabCase(name);
    lines.push(`  --md-sys-motion-easing-${kebab}: ${bezier};`);
  }

  if (componentCss) {
    lines.push(componentCss.trimEnd());
  }

  lines.push('}');
  return lines.join('\n') + '\n';
}

function generateThemeCss(): string {
  return `/**
 * Tailwind v4 @theme layer — M3 token bridge
 * Import after tokens.css in your app.
 */
@import './tokens.css';

@theme {
  /* Color roles */
${COLOR_ROLES.map((role) => {
  const kebab = toKebabCase(role);
  return `  --color-md-${kebab}: var(--md-sys-color-${kebab});`;
}).join('\n')}

  /* Shape */
${Object.keys(SHAPE_SCALE)
  .map((corner) => {
    const kebab = toKebabCase(corner);
    return `  --radius-md-${kebab}: var(--md-sys-shape-${kebab});`;
  })
  .join('\n')}

  /* Elevation */
${Object.keys(ELEVATION_LEVELS)
  .map((level) => {
    const kebab = toKebabCase(level);
    return `  --shadow-md-${kebab}: var(--md-sys-elevation-${kebab});`;
  })
  .join('\n')}

  /* Motion */
${Object.keys(MOTION_DURATIONS)
  .map((name) => {
    const kebab = toKebabCase(name);
    return `  --duration-md-${kebab}: var(--md-sys-motion-duration-${kebab});`;
  })
  .join('\n')}
}

@utility m3-state-hover {
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
    pointer-events: none;
  }
  &:hover::before {
    opacity: var(--md-sys-state-hover-state-layer-opacity);
  }
}

@utility m3-state-focus {
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
  }
  &:focus-visible::after {
    opacity: var(--md-sys-state-focus-state-layer-opacity);
  }
}

@utility m3-state-pressed {
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
  }
  &:active::before {
    opacity: var(--md-sys-state-pressed-state-layer-opacity);
  }
}

@utility m3-elevation-1 {
  box-shadow: 0 var(--md-sys-elevation-level1) calc(var(--md-sys-elevation-level1) * 2)
    rgba(0, 0, 0, var(--md-sys-elevation-level1-shadow-opacity));
}
`;
}

function generateTypesTs(
  spec: ReturnType<typeof loadSpec>,
  compTokenVars: string[],
): string {
  return `/** Generated — do not edit */
export const STATE_LAYER_OPACITIES = ${JSON.stringify(STATE_LAYER_OPACITIES, null, 2)} as const;

export const ELEVATION_LEVELS = ${JSON.stringify(ELEVATION_LEVELS, null, 2)} as const;

export const SHAPE_SCALE = ${JSON.stringify(SHAPE_SCALE, null, 2)} as const;

export const TYPE_SCALE = ${JSON.stringify(TYPE_SCALE, null, 2)} as const;

export const MOTION_DURATIONS = ${JSON.stringify(MOTION_DURATIONS, null, 2)} as const;

export const MOTION_EASING = ${JSON.stringify(MOTION_EASING, null, 2)} as const;

export const COLOR_ROLES = ${JSON.stringify(COLOR_ROLES)} as const;

export type ColorRole = (typeof COLOR_ROLES)[number];
export type StateLayerState = keyof typeof STATE_LAYER_OPACITIES;
export type ElevationLevel = keyof typeof ELEVATION_LEVELS;
export type ShapeCorner = keyof typeof SHAPE_SCALE;
export type TypeScaleRole = keyof typeof TYPE_SCALE;
export type MotionDuration = keyof typeof MOTION_DURATIONS;
export type MotionEasing = keyof typeof MOTION_EASING;

/** Spec metadata */
export const SPEC_ANDROIDX_FILE_COUNT = ${Object.keys(spec.androidx).length};
export const SPEC_MATERIAL_WEB_FILE_COUNT = ${Object.keys(spec.materialWeb).length};

/** All sys token CSS custom property names */
export const SYS_TOKEN_VARS = [
${[
  ...COLOR_ROLES.map((r) => `  '--md-sys-color-${toKebabCase(r)}'`),
  ...Object.keys(STATE_LAYER_OPACITIES).map((s) => `  '--md-sys-state-${s}-state-layer-opacity'`),
  ...Object.keys(ELEVATION_LEVELS).flatMap((l) => {
    const k = toKebabCase(l);
    return [
      `  '--md-sys-elevation-${k}'`,
      `  '--md-sys-elevation-${k}-shadow-opacity'`,
      `  '--md-sys-elevation-${k}-surface-tint-opacity'`,
    ];
  }),
  ...Object.keys(SHAPE_SCALE).map((s) => `  '--md-sys-shape-${toKebabCase(s)}'`),
  ...Object.entries(TYPE_SCALE).flatMap(([role, scale]) => {
    const k = toKebabCase(role);
    return [
      `  '--md-sys-typescale-${k}-size'`,
      `  '--md-sys-typescale-${k}-line-height'`,
      `  '--md-sys-typescale-${k}-weight'`,
      `  '--md-sys-typescale-${k}-tracking'`,
      `  '--md-sys-typescale-${k}-weight-emphasized'`,
    ];
  }),
  ...Object.keys(MOTION_DURATIONS).map((d) => `  '--md-sys-motion-duration-${toKebabCase(d)}'`),
  ...Object.keys(MOTION_EASING).map((e) => `  '--md-sys-motion-easing-${toKebabCase(e)}'`),
] .join(',\n')}
] as const;

export type SysTokenVar = (typeof SYS_TOKEN_VARS)[number];

/** md-comp token CSS custom property names */
export const COMP_TOKEN_VARS = [
${compTokenVars.map((v) => `  '${v}'`).join(',\n')}
] as const;

export type CompTokenVar = (typeof COMP_TOKEN_VARS)[number];
`;
}

function main(): void {
  const spec = loadSpec();
  mkdirSync(OUT_DIR, { recursive: true });

  const { css: componentCss, vars: compTokenVars } = generateComponentTokensCss(spec.androidx);

  writeFileSync(join(OUT_DIR, 'tokens.css'), generateTokensCss(componentCss));
  writeFileSync(join(OUT_DIR, 'theme.css'), generateThemeCss());
  writeFileSync(join(OUT_DIR, 'tokens.ts'), generateTypesTs(spec, compTokenVars));

  console.log(`Token codegen complete (${compTokenVars.length} component tokens)`);
}

main();
