import {
  CATALOG_VARIANTS_SIZES,
  parityForSlug,
  TIER_C_CATALOG,
  type TierASlug,
  type TierBSlug,
  type TierCSlug,
} from './parity.js';
import type {
  CatalogCategory,
  CatalogStatus,
  ComponentCatalogEntry,
  ComponentConformance,
} from './types.js';

interface UiCatalogOptions {
  status?: CatalogStatus;
  registryDependencies?: string[];
  related?: string[];
  docs?: Partial<ComponentCatalogEntry['docs']>;
  conformance?: Partial<ComponentConformance>;
}

const INTERACTION_STATES = ['rest', 'hover', 'focus', 'pressed', 'disabled'] as const;

/** Stable MWC (v0_192) reference defaults for Tier B components. */
const TIER_B_SOURCES = ['material-tokens', 'material-web', 'm3ui-web-adaptation'] as const;

function tierAConformance(
  slug: TierASlug,
  overrides: Partial<ComponentConformance> = {},
): Partial<ComponentConformance> {
  const parity = parityForSlug(slug);
  if (!parity) {
    throw new Error(`Expected Tier A parity metadata for "${slug}"`);
  }
  return {
    ...overrides,
    parity,
  };
}

function tierBConformance(
  slug: TierBSlug,
  overrides: Partial<ComponentConformance> = {},
): Partial<ComponentConformance> {
  const parity = parityForSlug(slug);
  if (!parity) {
    throw new Error(`Expected Tier B parity metadata for "${slug}"`);
  }
  return {
    status: 'verified',
    sources: [...TIER_B_SOURCES],
    ...overrides,
    parity,
  };
}

function tierCConformance(slug: TierCSlug): Partial<ComponentConformance> {
  const meta = TIER_C_CATALOG[slug];
  const parity = parityForSlug(slug);
  return {
    ...(meta ? { tokenPrefixes: meta.tokenPrefixes, adaptations: meta.adaptations } : {}),
    ...(parity ? { parity } : {}),
  };
}

function conformanceFor(
  slug: string,
  options: Partial<ComponentConformance> = {},
): ComponentConformance {
  const catalogMeta = CATALOG_VARIANTS_SIZES[slug];
  const parity = parityForSlug(slug);

  const conformance: ComponentConformance = {
    version: '1.0',
    status: 'adapted',
    sources: ['material-tokens', 'material-web', 'android-expressive', 'm3ui-web-adaptation'],
    variants: catalogMeta?.variants ?? ['standard'],
    sizes: catalogMeta?.sizes ?? ['standard'],
    states: [...INTERACTION_STATES],
    responsive: false,
    rtl: true,
    reducedMotion: true,
    forcedColors: true,
    tokenPrefixes: [`--md-comp-${slug}-`],
    adaptations: [],
    ...options,
  };

  if ('parity' in options) {
    conformance.parity = options.parity;
  } else if (parity) {
    conformance.parity = parity;
  }

  return conformance;
}

function registryUi(
  slug: string,
  sourceFile: string,
  title: string,
  description: string,
  category: CatalogCategory,
  npmDependencies: string[],
  exports: string[],
  options: UiCatalogOptions = {},
): ComponentCatalogEntry {
  const status = options.status ?? 'stable';
  return {
    slug,
    title,
    description,
    category,
    status,
    registryType: 'registry:ui',
    sourceFile,
    npmDependencies,
    registryDependencies: options.registryDependencies ?? [],
    exports,
    related: options.related ?? [],
    docs: {
      route: options.docs?.route ?? true,
      publicIndex: options.docs?.publicIndex ?? status !== 'internal',
      hasContent: options.docs?.hasContent ?? false,
    },
    conformance: conformanceFor(slug, options.conformance),
  };
}

/**
 * Single source of truth for registry items, docs navigation, and completeness gates.
 * Consumed by `scripts/build-registry.ts` and emitted as `registry/docs-catalog.json`.
 */
export const COMPONENT_CATALOG: ComponentCatalogEntry[] = [
  registryUi(
    'button',
    'button.tsx',
    'Button',
    'M3 Expressive button with press shape morph',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'],
    ['Button'],
    {
      related: ['icon-button', 'fab', 'button-group'],
      conformance: tierAConformance('button', {
        variants: ['elevated', 'filled', 'filled-tonal', 'outlined', 'text'],
        sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
        tokenPrefixes: ['--md-comp-filled-button-', '--md-comp-elevated-button-', '--md-comp-outlined-button-', '--md-comp-text-button-', '--md-comp-filled-tonal-button-', '--md-comp-button-'],
      }),
    },
  ),
  registryUi(
    'icon-button',
    'icon-button.tsx',
    'Icon Button',
    'M3 Expressive icon button with toggle support',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'],
    ['IconButton'],
    {
      related: ['button', 'fab'],
      conformance: tierAConformance('icon-button', {
        variants: ['standard', 'filled', 'filled-tonal', 'outlined'],
        sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
        tokenPrefixes: ['--md-comp-icon-button-', '--md-comp-filled-icon-button-', '--md-comp-outlined-icon-button-', '--md-comp-filled-tonal-icon-button-', '--md-comp-medium-icon-button-'],
      }),
    },
  ),
  registryUi(
    'fab',
    'fab.tsx',
    'FAB',
    'Floating action button and extended FAB',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Fab', 'ExtendedFab'],
    {
      related: ['icon-button', 'fab-menu', 'scaffold'],
      conformance: tierAConformance('fab', {
        variants: ['primary', 'secondary', 'tertiary', 'primary-container', 'secondary-container', 'tertiary-container'],
        sizes: ['standard', 'medium', 'large'],
        tokenPrefixes: ['--md-comp-fab-', '--md-comp-extended-fab-', '--md-comp-fab-primary-container-'],
      }),
    },
  ),
  registryUi(
    'checkbox',
    'checkbox.tsx',
    'Checkbox',
    'Checkbox and checkbox group',
    'selection',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Checkbox', 'CheckboxGroup'],
    {
      related: ['radio', 'switch'],
      conformance: tierAConformance('checkbox', {
        variants: ['unchecked', 'checked', 'indeterminate'],
        sizes: ['standard'],
        states: ['rest', 'hover', 'focus', 'pressed', 'disabled', 'error', 'indeterminate'],
        tokenPrefixes: ['--md-comp-checkbox-'],
      }),
    },
  ),
  registryUi(
    'radio',
    'radio.tsx',
    'Radio',
    'Radio button and radio group',
    'selection',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Radio', 'RadioGroup'],
    {
      related: ['checkbox', 'switch'],
      conformance: tierAConformance('radio', {
        tokenPrefixes: ['--md-comp-radio-button-'],
      }),
    },
  ),
  registryUi(
    'switch',
    'switch.tsx',
    'Switch',
    'M3 Expressive switch with icon slots',
    'selection',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Switch'],
    {
      related: ['checkbox', 'radio'],
      conformance: tierAConformance('switch', {
        variants: ['unselected', 'selected', 'with-icon'],
        tokenPrefixes: ['--md-comp-switch-'],
      }),
    },
  ),
  registryUi(
    'text-field',
    'text-field.tsx',
    'Text Field',
    'Filled and outlined text fields with floating labels',
    'inputs',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['TextField'],
    {
      related: ['select', 'autocomplete', 'search'],
      conformance: tierBConformance('text-field', {
        variants: ['filled', 'outlined'],
        sizes: ['standard'],
        states: ['rest', 'hover', 'focus', 'disabled', 'error'],
        tokenPrefixes: ['--md-comp-filled-text-field-', '--md-comp-outlined-text-field-'],
        adaptations: [
          'Floating label animation uses Motion springs rather than CSS keyframes.',
          'Shared field internals extracted for select parity (field-internals.ts).',
        ],
      }),
    },
  ),
  registryUi(
    'card',
    'card.tsx',
    'Card',
    'Elevated, filled, and outlined cards',
    'containment',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Card'],
    {
      related: ['list', 'carousel'],
      conformance: tierAConformance('card', {
        variants: ['elevated', 'filled', 'outlined'],
        tokenPrefixes: ['--md-comp-elevated-card-', '--md-comp-filled-card-', '--md-comp-outlined-card-'],
      }),
    },
  ),
  registryUi(
    'list',
    'list.tsx',
    'List',
    'M3 list and list items',
    'containment',
    ['@m3ui/react', '@m3ui/tokens'],
    ['List', 'ListItem'],
    {
      related: ['card', 'divider'],
      conformance: tierAConformance('list', {
        variants: ['one-line', 'two-line', 'three-line'],
        sizes: ['standard', 'dense'],
        tokenPrefixes: ['--md-comp-list-'],
      }),
    },
  ),
  registryUi(
    'divider',
    'divider.tsx',
    'Divider',
    'Full-width, inset, and vertical dividers',
    'containment',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Divider'],
    {
      related: ['list'],
      conformance: tierAConformance('divider', {
        variants: ['full-width', 'inset', 'middle-inset'],
        sizes: ['horizontal', 'vertical'],
        tokenPrefixes: ['--md-comp-divider-', '--md-comp-list-divider-'],
      }),
    },
  ),
  registryUi(
    'badge',
    'badge.tsx',
    'Badge',
    'Dot and numbered badges',
    'communication',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Badge'],
    {
      related: ['navigation-bar', 'icon-button'],
      conformance: tierAConformance('badge', {
        variants: ['dot', 'large'],
        tokenPrefixes: ['--md-comp-badge-'],
      }),
    },
  ),
  registryUi(
    'tooltip',
    'tooltip.tsx',
    'Tooltip',
    'Plain and rich tooltips',
    'communication',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Tooltip', 'RichTooltip'],
    { related: ['icon-button', 'button'], conformance: tierCConformance('tooltip') },
  ),
  registryUi(
    'chip',
    'chip.tsx',
    'Chip',
    'Assist, filter, input, and suggestion chips',
    'selection',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Chip', 'ChipSet', 'FilterChipGroup'],
    {
      related: ['segmented-button', 'button'],
      conformance: tierAConformance('chip', {
        variants: ['assist', 'filter', 'input', 'suggestion'],
        sizes: ['standard'],
        tokenPrefixes: ['--md-comp-assist-chip-', '--md-comp-filter-chip-', '--md-comp-input-chip-', '--md-comp-suggestion-chip-', '--md-comp-chips-'],
      }),
    },
  ),
  registryUi(
    'segmented-button',
    'segmented-button.tsx',
    'Segmented Button',
    'Single and multi-select segmented buttons',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['SegmentedButton', 'SegmentedButtonItem'],
    { related: ['button', 'tabs'], conformance: tierCConformance('segmented-button') },
  ),
  registryUi(
    'slider',
    'slider.tsx',
    'Slider',
    'Continuous, discrete, centered, range, and vertical sliders',
    'selection',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Slider'],
    {
      related: ['switch', 'meter'],
      conformance: tierBConformance('slider', {
        variants: ['continuous', 'discrete', 'centered', 'range'],
        sizes: ['standard'],
        states: ['rest', 'hover', 'focus', 'pressed', 'disabled'],
        tokenPrefixes: ['--md-comp-slider-'],
        adaptations: [
          'Thumb width transition uses Motion springs instead of CSS transitions.',
          'Vertical orientation height is a web layout default.',
        ],
      }),
    },
  ),
  registryUi(
    'menu',
    'menu.tsx',
    'Menu',
    'Dropdown menu, context menu, and menubar',
    'containment',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Menu', 'MenuItem', 'ContextMenu', 'Menubar', 'MenubarMenu'],
    {
      related: ['select', 'split-button'],
      conformance: tierAConformance('menu', {
        variants: ['dropdown', 'context', 'menubar'],
        tokenPrefixes: ['--md-comp-menu-', '--md-comp-list-'],
        adaptations: [
          'Menu popup uses Material Web WAAPI: 500ms open with per-item stagger and upward translateY correction, 150ms close to 35% height, abort-signal interruption.',
        ],
      }),
    },
  ),
  registryUi(
    'select',
    'select.tsx',
    'Select',
    'M3 exposed dropdown menu styled as text field',
    'selection',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Select', 'ExposedDropdownMenu'],
    {
      related: ['menu', 'text-field', 'autocomplete'],
      conformance: tierBConformance('select', {
        variants: ['filled', 'outlined'],
        sizes: ['standard'],
        states: ['rest', 'hover', 'focus', 'disabled', 'error'],
        tokenPrefixes: ['--md-comp-filled-text-field-', '--md-comp-outlined-text-field-', '--md-comp-menu-'],
        adaptations: [
          'Field container styling shared with text-field via field-internals.ts.',
          'Dropdown list reuses Menu WAAPI popup motion.',
        ],
      }),
    },
  ),
  registryUi(
    'autocomplete',
    'autocomplete.tsx',
    'Autocomplete',
    'Autocomplete and combobox with M3 text field styling',
    'inputs',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Autocomplete', 'Combobox'],
    { related: ['text-field', 'select', 'search'], conformance: tierCConformance('autocomplete') },
  ),
  registryUi(
    'progress',
    'progress.tsx',
    'Progress',
    'Linear and circular progress indicators',
    'feedback',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Progress', 'LinearProgress', 'CircularProgress'],
    {
      related: ['loading-indicator', 'meter'],
      conformance: tierBConformance('progress', {
        variants: ['linear', 'circular', 'flat', 'wavy'],
        sizes: ['standard'],
        states: ['rest', 'determinate', 'indeterminate'],
        tokenPrefixes: ['--md-comp-progress-indicator-', '--md-comp-linear-progress-indicator-', '--md-comp-circular-progress-indicator-'],
        adaptations: [
          'Wavy variant is an Expressive extension not shipped in stable MWC.',
          'Wavy animation uses SVG path generation with Motion animation frames.',
        ],
      }),
    },
  ),
  registryUi(
    'loading-indicator',
    'loading-indicator.tsx',
    'Loading Indicator',
    'Expressive shape-cycling loader',
    'feedback',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'],
    ['LoadingIndicator'],
    { related: ['progress', 'shapes'], conformance: tierCConformance('loading-indicator') },
  ),
  registryUi(
    'snackbar',
    'snackbar.tsx',
    'Snackbar',
    'Toast snackbars with queueing and positioning',
    'communication',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Snackbar', 'SnackbarProvider', 'useSnackbar'],
    { related: ['dialog', 'bottom-sheet'], conformance: tierCConformance('snackbar') },
  ),
  registryUi(
    'meter',
    'meter.tsx',
    'Meter',
    'Meter styled consistently with progress indicators',
    'feedback',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Meter'],
    { related: ['progress', 'slider'], conformance: tierCConformance('meter') },
  ),
  registryUi(
    'top-app-bar',
    'top-app-bar.tsx',
    'Top App Bar',
    'Small, medium, large, and flexible Expressive top app bars',
    'navigation',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['TopAppBar'],
    {
      related: ['scaffold', 'navigation-bar', 'search'],
      conformance: tierAConformance('top-app-bar', {
        variants: ['default', 'center-aligned'],
        sizes: ['small', 'medium', 'large', 'medium-flexible', 'large-flexible'],
        tokenPrefixes: ['--md-comp-app-bar-'],
      }),
    },
  ),
  registryUi(
    'bottom-app-bar',
    'bottom-app-bar.tsx',
    'Bottom App Bar',
    'Bottom app bar with action slots and attached FAB',
    'navigation',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['BottomAppBar'],
    { related: ['navigation-bar', 'fab', 'scaffold'], conformance: tierCConformance('bottom-app-bar') },
  ),
  registryUi(
    'navigation-bar',
    'navigation-bar.tsx',
    'Navigation Bar',
    'Bottom navigation bar with active indicator pill and badges',
    'navigation',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['NavigationBar'],
    { related: ['navigation-rail', 'adaptive-navigation'], conformance: tierCConformance('navigation-bar') },
  ),
  registryUi(
    'navigation-rail',
    'navigation-rail.tsx',
    'Navigation Rail',
    'Collapsed, expanded, and modal navigation rail',
    'navigation',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['NavigationRail'],
    { related: ['navigation-drawer', 'adaptive-navigation'], conformance: tierCConformance('navigation-rail') },
  ),
  registryUi(
    'navigation-drawer',
    'navigation-drawer.tsx',
    'Navigation Drawer',
    'Standard and modal navigation drawer with sections',
    'navigation',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['NavigationDrawer', 'NavigationDrawerTrigger'],
    { related: ['navigation-rail', 'adaptive-navigation'], conformance: tierCConformance('navigation-drawer') },
  ),
  registryUi(
    'tabs',
    'tabs.tsx',
    'Tabs',
    'Primary and secondary tabs with scrollable layout',
    'containment',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Tabs', 'TabsPrimitive'],
    {
      related: ['segmented-button', 'carousel'],
      conformance: tierBConformance('tabs', {
        variants: ['primary', 'secondary'],
        sizes: ['fixed', 'scrollable'],
        states: ['rest', 'selected', 'disabled'],
        responsive: true,
        tokenPrefixes: ['--md-comp-primary-navigation-tab-', '--md-comp-secondary-navigation-tab-'],
        adaptations: [
          'Active indicator position uses Motion springs instead of CSS transitions.',
          'Scrollable layout is a web composition pattern.',
        ],
      }),
    },
  ),
  registryUi(
    'search',
    'search.tsx',
    'Search',
    'Search bar and full-screen search view',
    'inputs',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['SearchBar', 'SearchView'],
    { related: ['text-field', 'autocomplete', 'top-app-bar'], conformance: tierCConformance('search') },
  ),
  registryUi(
    'dialog',
    'dialog.tsx',
    'Dialog',
    'Dialog, alert dialog, and full-screen dialog',
    'containment',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Dialog', 'AlertDialog', 'FullScreenDialog', 'DialogAction'],
    {
      related: ['bottom-sheet', 'side-sheet', 'snackbar'],
      conformance: tierBConformance('dialog', {
        variants: ['basic', 'alert', 'full-screen'],
        sizes: ['standard'],
        states: ['rest', 'open', 'closed'],
        tokenPrefixes: ['--md-comp-dialog-', '--md-comp-scrim-'],
        adaptations: [
          'FullScreenDialog is a web layout adaptation beyond stable MWC basic dialog.',
          'Dialog actions delegate to standard text Button; action-* dialog tokens are unused per upstream.',
          'Dialog and AlertDialog use Material Web WAAPI open/close choreography; FullScreenDialog keeps Motion overlay.',
        ],
      }),
    },
  ),
  registryUi(
    'bottom-sheet',
    'bottom-sheet.tsx',
    'Bottom Sheet',
    'Modal bottom sheet with snap points and drag handle',
    'containment',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['BottomSheet'],
    { related: ['dialog', 'side-sheet'], conformance: tierCConformance('bottom-sheet') },
  ),
  registryUi(
    'side-sheet',
    'side-sheet.tsx',
    'Side Sheet',
    'Side sheet with header and action row',
    'containment',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['SideSheet'],
    { related: ['dialog', 'bottom-sheet', 'navigation-drawer'], conformance: tierCConformance('side-sheet') },
  ),
  registryUi(
    'carousel',
    'carousel.tsx',
    'Carousel',
    'M3 carousel layouts with scroll-linked resize',
    'containment',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Carousel'],
    { related: ['card', 'tabs'], conformance: tierCConformance('carousel') },
  ),
  registryUi(
    'scaffold',
    'scaffold.tsx',
    'Scaffold',
    'App layout composing chrome with inset CSS variables',
    'layout',
    ['@m3ui/react', '@m3ui/tokens'],
    ['Scaffold', 'FabAnchor'],
    { related: ['top-app-bar', 'pane-scaffold', 'adaptive-navigation'], conformance: tierCConformance('scaffold') },
  ),
  registryUi(
    'button-group',
    'button-group.tsx',
    'Button Group',
    'Standard and connected button groups with neighbor bump',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'],
    ['ButtonGroup', 'ButtonGroupItem'],
    { related: ['button', 'split-button', 'segmented-button'], conformance: tierCConformance('button-group') },
  ),
  registryUi(
    'split-button',
    'split-button.tsx',
    'Split Button',
    'Leading action with trailing menu trigger',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'],
    ['SplitButton'],
    {
      related: ['button', 'menu', 'button-group'],
      conformance: tierAConformance('split-button', {
        variants: ['filled', 'filled-tonal', 'outlined'],
        sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
        tokenPrefixes: ['--md-comp-split-button-'],
      }),
    },
  ),
  registryUi(
    'fab-menu',
    'fab-menu.tsx',
    'FAB Menu',
    'FAB expanding to labeled action list',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'],
    ['FabMenu'],
    { related: ['fab', 'menu'], conformance: tierCConformance('fab-menu') },
  ),
  registryUi(
    'toolbar',
    'toolbar.tsx',
    'Toolbar',
    'Docked and floating toolbars with scroll hide/show',
    'actions',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['Toolbar', 'ToolbarButton'],
    { related: ['top-app-bar', 'button-group'], conformance: tierCConformance('toolbar') },
  ),
  registryUi(
    'date-input',
    'date-input.tsx',
    'Date Input',
    'Locale-aware date input with Field validation',
    'pickers',
    ['@m3ui/react', '@m3ui/tokens', '@internationalized/date'],
    ['DateInput'],
    { related: ['date-picker', 'text-field'], conformance: tierCConformance('date-input') },
  ),
  registryUi(
    'date-picker',
    'date-picker.tsx',
    'Date Picker',
    'Docked, modal, and range date pickers with calendar engine',
    'pickers',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@internationalized/date'],
    ['DatePicker'],
    { related: ['date-input', 'time-picker'], conformance: tierCConformance('date-picker') },
  ),
  registryUi(
    'time-picker',
    'time-picker.tsx',
    'Time Picker',
    'Dial and input time pickers with 12h/24h support',
    'pickers',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['TimePicker'],
    { related: ['date-picker', 'date-input'], conformance: tierCConformance('time-picker') },
  ),
  registryUi(
    'pane-scaffold',
    'pane-scaffold.tsx',
    'Pane Scaffold',
    'List-detail and supporting-pane adaptive layouts',
    'layout',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['PaneScaffold', 'PaneScaffoldRoot'],
    { related: ['scaffold', 'adaptive-navigation'], conformance: tierCConformance('pane-scaffold') },
  ),
  registryUi(
    'adaptive-navigation',
    'adaptive-navigation.tsx',
    'Adaptive Navigation',
    'Auto-switching navigation bar, rail, and drawer',
    'navigation',
    ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'],
    ['AdaptiveNavigation', 'resolveAdaptiveNavMode'],
    { related: ['navigation-bar', 'navigation-rail', 'navigation-drawer', 'scaffold'], conformance: tierCConformance('adaptive-navigation') },
  ),
  registryUi(
    'placeholder-button',
    'placeholder-button.tsx',
    'Placeholder Button',
    'Registry placeholder for install testing',
    'actions',
    ['@m3ui/react', '@m3ui/tokens'],
    ['PlaceholderButton'],
    {
      status: 'internal',
      docs: { route: true, publicIndex: false },
    },
  ),
  {
    slug: 'shapes',
    title: 'Shapes',
    description: 'Material Design 3 Expressive shape morphing, ShapeCrop, and the shapes library',
    category: 'foundations',
    status: 'stable',
    registryType: 'foundations',
    npmDependencies: ['@m3ui/shapes', '@m3ui/react', '@m3ui/tokens'],
    registryDependencies: [],
    exports: ['ShapeCrop', 'MaterialShapes'],
    related: ['button', 'loading-indicator', 'button-group'],
    docs: {
      route: true,
      publicIndex: true,
      hasContent: false,
    },
    conformance: conformanceFor('shapes', {
      status: 'adapted',
      sources: ['android-expressive', 'm3ui-web-adaptation'],
      states: ['rest', 'morphed'],
      tokenPrefixes: ['--md-sys-shape-'],
      adaptations: ['CSS clip-path and Motion springs adapt the Android Expressive shape system.'],
      parity: undefined,
    }),
  },
];

export function getCatalogEntry(slug: string): ComponentCatalogEntry | undefined {
  return COMPONENT_CATALOG.find((entry) => entry.slug === slug);
}

export function getRegistryUiEntries(): ComponentCatalogEntry[] {
  return COMPONENT_CATALOG.filter((entry) => entry.registryType === 'registry:ui');
}

export function getPublicCatalogEntries(): ComponentCatalogEntry[] {
  return COMPONENT_CATALOG.filter(
    (entry) => entry.status !== 'internal' && entry.docs.publicIndex,
  );
}

export function getCatalogEntriesByCategory(category: CatalogCategory): ComponentCatalogEntry[] {
  return COMPONENT_CATALOG.filter((entry) => entry.category === category);
}
