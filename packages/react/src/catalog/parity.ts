import type { ComponentParity, ParityReference, ParityResidualDiff, ParityTier } from './types.js';

/** Pinned upstream Expressive reference shipped in @material/web v2.5.0 (July 2026). */
export const MATERIAL_WEB_UPSTREAM_VERSION = '@material/web@2.5.0';

export const TIER_A_SLUGS = [
  'button',
  'icon-button',
  'fab',
  'split-button',
  'card',
  'checkbox',
  'radio',
  'switch',
  'chip',
  'divider',
  'list',
  'menu',
  'badge',
  'top-app-bar',
] as const;

export const TIER_B_SLUGS = [
  'dialog',
  'slider',
  'text-field',
  'select',
  'tabs',
  'progress',
] as const;

export const TIER_C_SLUGS = [
  'autocomplete',
  'snackbar',
  'tooltip',
  'navigation-bar',
  'navigation-rail',
  'navigation-drawer',
  'adaptive-navigation',
  'search',
  'segmented-button',
  'date-input',
  'date-picker',
  'time-picker',
  'bottom-sheet',
  'side-sheet',
  'carousel',
  'bottom-app-bar',
  'toolbar',
  'button-group',
  'fab-menu',
  'meter',
  'loading-indicator',
  'scaffold',
  'pane-scaffold',
] as const;

export type TierASlug = (typeof TIER_A_SLUGS)[number];
export type TierBSlug = (typeof TIER_B_SLUGS)[number];
export type TierCSlug = (typeof TIER_C_SLUGS)[number];

const EMPTY_RESIDUAL: ParityResidualDiff = { missing: [], extra: [], drifted: [] };

/** Reviewed residual gaps documented per Tier A slug until parity-report automation lands. */
export const TIER_A_RESIDUAL_DIFF: Partial<Record<TierASlug, ParityResidualDiff>> = {
  button: {
    missing: [
      'focus-state-layer-color',
      'focus-state-layer-opacity',
      'label-text-tracking',
      'label-text-type',
    ],
    extra: [],
    drifted: [],
  },
};

/**
 * Upstream md-comp-* keys used when diffing supported tokens.
 * Sass file names; emitted CSS uses --md-{name}-* without the comp segment.
 */
export const COMPONENT_UPSTREAM_KEYS: Partial<Record<string, readonly string[]>> = {
  button: [
    'md-comp-elevated-button',
    'md-comp-filled-button',
    'md-comp-filled-tonal-button',
    'md-comp-outlined-button',
    'md-comp-text-button',
  ],
  'icon-button': [
    'md-comp-filled-icon-button',
    'md-comp-filled-tonal-icon-button',
    'md-comp-outlined-icon-button',
    'md-comp-standard-icon-button',
  ],
  fab: ['md-comp-fab', 'md-comp-fab-branded', 'md-comp-extended-fab'],
  'split-button': ['md-comp-split-button'],
  card: ['md-comp-elevated-card', 'md-comp-filled-card', 'md-comp-outlined-card'],
  checkbox: ['md-comp-checkbox'],
  radio: ['md-comp-radio'],
  switch: ['md-comp-switch'],
  chip: [
    'md-comp-assist-chip',
    'md-comp-filter-chip',
    'md-comp-input-chip',
    'md-comp-suggestion-chip',
  ],
  divider: ['md-comp-divider'],
  list: ['md-comp-list', 'md-comp-list-item'],
  menu: ['md-comp-menu', 'md-comp-menu-item'],
  badge: ['md-comp-badge'],
  'top-app-bar': ['md-comp-app-bar'],
  dialog: ['md-comp-dialog'],
  slider: ['md-comp-slider'],
  'text-field': ['md-comp-filled-text-field', 'md-comp-outlined-text-field'],
  select: ['md-comp-filled-select', 'md-comp-outlined-select'],
  tabs: ['md-comp-primary-tab', 'md-comp-secondary-tab'],
  progress: ['md-comp-linear-progress-indicator', 'md-comp-circular-progress-indicator'],
  autocomplete: ['md-comp-filled-autocomplete', 'md-comp-outlined-autocomplete'],
  snackbar: ['md-comp-snackbar'],
  tooltip: ['md-comp-plain-tooltip', 'md-comp-rich-tooltip'],
  'navigation-bar': ['md-comp-navigation-bar', 'md-comp-navigation-bar-horizontal-item', 'md-comp-navigation-bar-vertical-item'],
  'navigation-rail': [
    'md-comp-navigation-rail-collapsed',
    'md-comp-navigation-rail-expanded',
    'md-comp-navigation-rail-color',
    'md-comp-navigation-rail-baseline-item',
  ],
  'navigation-drawer': ['md-comp-navigation-drawer'],
  search: ['md-comp-search-bar', 'md-comp-search-view'],
  'segmented-button': ['md-comp-outlined-segmented-button'],
  'date-input': ['md-comp-date-input-modal'],
  'date-picker': ['md-comp-date-picker-modal'],
  'time-picker': ['md-comp-time-picker', 'md-comp-time-input'],
  'bottom-sheet': ['md-comp-sheet-bottom-docked'],
  'side-sheet': ['md-comp-navigation-drawer-modal'],
  carousel: ['md-comp-carousel'],
  'bottom-app-bar': ['md-comp-bottom-app-bar'],
  toolbar: ['md-comp-docked-toolbar', 'md-comp-floating-toolbar'],
  'button-group': ['md-comp-button-group-small', 'md-comp-connected-button-group-small'],
  'fab-menu': ['md-comp-fab-menu-baseline'],
  meter: ['md-comp-linear-progress-indicator', 'md-comp-progress-indicator'],
  'loading-indicator': ['md-comp-loading-indicator'],
  scaffold: ['md-comp-scaffold'],
  'pane-scaffold': ['md-comp-pane-scaffold'],
};

export function parityTierForSlug(slug: string): ParityTier | undefined {
  if ((TIER_A_SLUGS as readonly string[]).includes(slug)) return 'A';
  if ((TIER_B_SLUGS as readonly string[]).includes(slug)) return 'B';
  if ((TIER_C_SLUGS as readonly string[]).includes(slug)) return 'C';
  return undefined;
}

export function parityReferenceForSlug(slug: string): ParityReference | undefined {
  if ((TIER_A_SLUGS as readonly string[]).includes(slug)) return 'labs/gb';
  if ((TIER_B_SLUGS as readonly string[]).includes(slug)) return 'stable';
  if ((TIER_C_SLUGS as readonly string[]).includes(slug)) return 'tokens-only';
  return undefined;
}

export function parityForSlug(slug: string): ComponentParity | undefined {
  const reference = parityReferenceForSlug(slug);
  const tier = parityTierForSlug(slug);
  if (!reference || !tier) return undefined;

  const residualDiff =
    tier === 'A'
      ? (TIER_A_RESIDUAL_DIFF[slug as TierASlug] ?? EMPTY_RESIDUAL)
      : EMPTY_RESIDUAL;

  return {
    tier,
    reference,
    upstreamVersion: MATERIAL_WEB_UPSTREAM_VERSION,
    residualDiff,
  };
}

/** Real variant and size enumerations mirrored from component public APIs. */
export const CATALOG_VARIANTS_SIZES: Record<string, { variants: string[]; sizes: string[] }> = {
  button: {
    variants: ['elevated', 'filled', 'filled-tonal', 'outlined', 'text'],
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  'icon-button': {
    variants: ['standard', 'filled', 'filled-tonal', 'outlined'],
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  fab: {
    variants: [
      'primary',
      'secondary',
      'tertiary',
      'primary-container',
      'secondary-container',
      'tertiary-container',
    ],
    sizes: ['standard', 'medium', 'large', 'extended-small', 'extended-medium', 'extended-large'],
  },
  'split-button': {
    variants: ['filled', 'filled-tonal', 'outlined'],
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  card: { variants: ['elevated', 'filled', 'outlined'], sizes: ['standard'] },
  checkbox: { variants: ['unchecked', 'checked', 'indeterminate'], sizes: ['standard'] },
  radio: { variants: ['unselected', 'selected'], sizes: ['standard'] },
  switch: { variants: ['unselected', 'selected'], sizes: ['standard'] },
  chip: {
    variants: ['assist', 'filter', 'input', 'suggestion'],
    sizes: ['standard'],
  },
  divider: {
    variants: ['full-width', 'inset', 'middle-inset'],
    sizes: ['horizontal', 'vertical'],
  },
  list: { variants: ['one-line', 'two-line', 'three-line'], sizes: ['standard', 'dense'] },
  menu: { variants: ['dropdown', 'context', 'menubar'], sizes: ['standard'] },
  badge: { variants: ['dot', 'large'], sizes: ['standard'] },
  'top-app-bar': {
    variants: ['default', 'center-aligned'],
    sizes: ['small', 'medium', 'large', 'medium-flexible', 'large-flexible'],
  },
  dialog: { variants: ['basic', 'alert', 'full-screen'], sizes: ['standard'] },
  slider: { variants: ['continuous', 'discrete', 'centered', 'range'], sizes: ['standard'] },
  'text-field': { variants: ['filled', 'outlined'], sizes: ['standard'] },
  select: { variants: ['filled', 'outlined'], sizes: ['standard'] },
  tabs: { variants: ['primary', 'secondary'], sizes: ['fixed', 'scrollable'] },
  progress: {
    variants: ['linear', 'circular', 'flat', 'wavy'],
    sizes: ['standard'],
  },
  autocomplete: { variants: ['filled', 'outlined'], sizes: ['standard'] },
  snackbar: { variants: ['standard'], sizes: ['standard'] },
  tooltip: { variants: ['plain', 'rich'], sizes: ['standard'] },
  'navigation-bar': { variants: ['standard', 'tall'], sizes: ['standard'] },
  'navigation-rail': {
    variants: ['collapsed', 'expanded', 'modal'],
    sizes: ['standard'],
  },
  'navigation-drawer': { variants: ['standard', 'modal'], sizes: ['standard'] },
  'adaptive-navigation': { variants: ['bar', 'rail', 'drawer'], sizes: ['standard'] },
  search: { variants: ['bar', 'view'], sizes: ['standard'] },
  'segmented-button': { variants: ['single-select', 'multi-select'], sizes: ['standard'] },
  'date-input': { variants: ['filled', 'outlined'], sizes: ['standard'] },
  'date-picker': {
    variants: ['docked', 'modal', 'modal-input'],
    sizes: ['standard', 'range'],
  },
  'time-picker': { variants: ['dial', 'input'], sizes: ['12h', '24h'] },
  'bottom-sheet': { variants: ['standard', 'modal'], sizes: ['standard'] },
  'side-sheet': { variants: ['standard', 'modal'], sizes: ['start', 'end'] },
  carousel: {
    variants: ['multi-browse', 'uncontained', 'hero', 'full-screen'],
    sizes: ['standard'],
  },
  'bottom-app-bar': { variants: ['standard'], sizes: ['standard'] },
  toolbar: {
    variants: ['docked', 'floating'],
    sizes: ['horizontal', 'vertical'],
  },
  'button-group': { variants: ['standard', 'connected'], sizes: ['standard'] },
  'fab-menu': { variants: ['standard'], sizes: ['standard'] },
  meter: { variants: ['standard'], sizes: ['standard'] },
  'loading-indicator': { variants: ['expressive'], sizes: ['small', 'medium', 'large'] },
  scaffold: { variants: ['standard'], sizes: ['standard'] },
  'pane-scaffold': {
    variants: ['list-detail', 'supporting-pane'],
    sizes: ['compact', 'medium', 'expanded'],
  },
  shapes: { variants: ['shape-crop', 'morph'], sizes: ['standard'] },
  'placeholder-button': { variants: ['placeholder'], sizes: ['standard'] },
};

/** Catalog conformance overrides for Tier C (tokens-only upstream reference). */
export const TIER_C_CATALOG: Partial<
  Record<TierCSlug, { tokenPrefixes: string[]; adaptations: string[] }>
> = {
  autocomplete: {
    tokenPrefixes: [
      '--md-comp-filled-autocomplete-',
      '--md-comp-outlined-autocomplete-',
      '--md-comp-filled-text-field-',
      '--md-comp-outlined-text-field-',
      '--md-comp-menu-',
    ],
    adaptations: [
      'Autocomplete field styling reuses text-field tokens; dedicated autocomplete container tokens are redundant on web.',
      'Suggestion menu reuses menu container tokens.',
    ],
  },
  snackbar: {
    tokenPrefixes: ['--md-comp-snackbar-'],
    adaptations: [
      'Toast queue, dismiss control, and viewport positioning are web-specific.',
      'Container width follows content; no upstream min/max width tokens.',
    ],
  },
  tooltip: {
    tokenPrefixes: ['--md-comp-plain-tooltip-', '--md-comp-rich-tooltip-'],
    adaptations: ['Rich tooltip action slot tokens reserved; PreviewCard hosts rich content.'],
  },
  'navigation-bar': {
    tokenPrefixes: [
      '--md-comp-navigation-bar-',
      '--md-comp-navigation-bar-horizontal-item-',
      '--md-comp-navigation-bar-vertical-item-',
    ],
    adaptations: ['Vertical layout tokens unused; web bar uses horizontal item subset.'],
  },
  'navigation-rail': {
    tokenPrefixes: [
      '--md-comp-navigation-rail-collapsed-',
      '--md-comp-navigation-rail-expanded-',
      '--md-comp-navigation-rail-color-',
      '--md-comp-navigation-rail-baseline-item-',
    ],
    adaptations: ['Expanded/modal layout tokens partially mapped to collapsed width defaults.'],
  },
  'navigation-drawer': {
    tokenPrefixes: ['--md-comp-navigation-drawer-'],
    adaptations: ['Badge overlay tokens delegated to Badge component.'],
  },
  'adaptive-navigation': {
    tokenPrefixes: [
      '--md-comp-navigation-bar-',
      '--md-comp-navigation-rail-',
      '--md-comp-navigation-drawer-',
    ],
    adaptations: ['Composes navigation-bar, navigation-rail, and navigation-drawer with window-size-class switching.'],
  },
  search: {
    tokenPrefixes: ['--md-comp-search-bar-', '--md-comp-search-view-', '--md-comp-menu-'],
    adaptations: ['SearchBar suggestions reuse menu popup tokens; docked view max width follows header height token.'],
  },
  'segmented-button': {
    tokenPrefixes: ['--md-comp-outlined-segmented-button-'],
    adaptations: ['Selected/unselected colors bound via Toggle pressed state.'],
  },
  'date-input': {
    tokenPrefixes: [
      '--md-comp-date-input-modal-',
      '--md-comp-filled-text-field-',
      '--md-comp-outlined-text-field-',
    ],
    adaptations: ['Inline segments reuse text-field focus and container tokens.'],
  },
  'date-picker': {
    tokenPrefixes: ['--md-comp-date-picker-modal-'],
    adaptations: ['Calendar grid uses modal token subset; range selection is a web extension.'],
  },
  'time-picker': {
    tokenPrefixes: ['--md-comp-time-picker-', '--md-comp-time-input-'],
    adaptations: [
      'Dial geometry reads clock-dial-container-size; inner/outer radii approximate Compose precision.',
      'Period selector uses period-selector color tokens.',
    ],
  },
  'bottom-sheet': {
    tokenPrefixes: ['--md-comp-sheet-bottom-docked-', '--md-comp-sheet-bottom-'],
    adaptations: ['Snap points and drag gestures are web-specific; sheet-bottom-docked tokens drive visuals.'],
  },
  'side-sheet': {
    tokenPrefixes: ['--md-comp-navigation-drawer-', '--md-comp-navigation-drawer-modal-'],
    adaptations: ['Side sheet maps to navigation-drawer modal container tokens.'],
  },
  carousel: {
    tokenPrefixes: ['--md-comp-carousel-', '--md-comp-elevated-card-'],
    adaptations: [
      'Dedicated carousel tokens are Compose-only; slides use elevated-card container tokens.',
      'Scroll-linked scale uses Motion; layout widths are percentage-based web defaults.',
    ],
  },
  'bottom-app-bar': {
    tokenPrefixes: ['--md-comp-bottom-app-bar-', '--md-comp-app-bar-', '--md-comp-fab-medium-'],
    adaptations: ['Hide-on-scroll behavior is a web extension.'],
  },
  toolbar: {
    tokenPrefixes: ['--md-comp-docked-toolbar-', '--md-comp-floating-toolbar-'],
    adaptations: ['Hide-on-scroll floating toolbar is a web extension.'],
  },
  'button-group': {
    tokenPrefixes: [
      '--md-comp-button-group-small-',
      '--md-comp-connected-button-group-small-',
      '--md-comp-filled-button-',
    ],
    adaptations: ['Expressive neighbor bump uses shape morph springs beyond upstream token spec.'],
  },
  'fab-menu': {
    tokenPrefixes: ['--md-comp-fab-menu-baseline-', '--md-comp-fab-primary-container-'],
    adaptations: ['Shape morph pill expansion uses @m3ui/shapes; list items reuse fab-menu-baseline tokens.'],
  },
  meter: {
    tokenPrefixes: ['--md-comp-linear-progress-indicator-', '--md-comp-progress-indicator-'],
    adaptations: ['Meter reuses linear progress indicator track and active indicator tokens.'],
  },
  'loading-indicator': {
    tokenPrefixes: ['--md-comp-loading-indicator-'],
    adaptations: ['Expressive shape-cycling animation is Android-derived; not in Material Web.'],
  },
  scaffold: {
    tokenPrefixes: ['--md-comp-fab-medium-', '--md-comp-list-'],
    adaptations: ['Inset CSS variables compose chrome; no dedicated scaffold tokens in upstream.'],
  },
  'pane-scaffold': {
    tokenPrefixes: ['--md-comp-divider-'],
    adaptations: ['Adaptive list-detail layout is a web composition pattern.'],
  },
};
