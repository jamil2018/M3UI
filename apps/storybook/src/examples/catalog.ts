/** Component catalog metadata for Storybook story generation (mirrors registry slugs). */
export const STORYBOOK_CATEGORIES = [
  'Actions',
  'Inputs',
  'Selection',
  'Communication',
  'Containment',
  'Navigation',
  'Feedback',
  'Pickers',
  'Layout',
] as const;

export type StorybookCategory = (typeof STORYBOOK_CATEGORIES)[number];

export interface StorybookCatalogEntry {
  slug: string;
  title: string;
  description: string;
  category: StorybookCategory;
  /** Example module export name under `src/examples/components/` */
  example: string;
  /** Skip public story generation (internal fixtures) */
  internal?: boolean;
}

export const STORYBOOK_CATALOG: StorybookCatalogEntry[] = [
  { slug: 'button', title: 'Button', description: 'M3 Expressive button variants and sizes', category: 'Actions', example: 'ButtonExample' },
  { slug: 'icon-button', title: 'Icon Button', description: 'Icon button variants and toggle', category: 'Actions', example: 'IconButtonExample' },
  { slug: 'fab', title: 'FAB', description: 'Floating action buttons', category: 'Actions', example: 'FabExample' },
  { slug: 'button-group', title: 'Button Group', description: 'Connected button groups', category: 'Actions', example: 'ButtonGroupExample' },
  { slug: 'split-button', title: 'Split Button', description: 'Action with trailing menu', category: 'Actions', example: 'SplitButtonExample' },
  { slug: 'fab-menu', title: 'FAB Menu', description: 'Expanding FAB action list', category: 'Actions', example: 'FabMenuExample' },
  { slug: 'text-field', title: 'Text Field', description: 'Filled and outlined text fields', category: 'Inputs', example: 'TextFieldExample' },
  { slug: 'search', title: 'Search', description: 'Search bar', category: 'Inputs', example: 'SearchExample' },
  { slug: 'checkbox', title: 'Checkbox', description: 'Checkbox and group', category: 'Selection', example: 'CheckboxExample' },
  { slug: 'radio', title: 'Radio', description: 'Radio button group', category: 'Selection', example: 'RadioExample' },
  { slug: 'switch', title: 'Switch', description: 'Toggle switch', category: 'Selection', example: 'SwitchExample' },
  { slug: 'segmented-button', title: 'Segmented Button', description: 'Single-select segments', category: 'Selection', example: 'SegmentedButtonExample' },
  { slug: 'slider', title: 'Slider', description: 'Continuous slider with value indicator', category: 'Selection', example: 'SliderExample' },
  { slug: 'chip', title: 'Chip', description: 'Assist, filter, input, and suggestion chips', category: 'Selection', example: 'ChipExample' },
  { slug: 'menu', title: 'Menu', description: 'Dropdown menu', category: 'Selection', example: 'MenuExample' },
  { slug: 'select', title: 'Select', description: 'Exposed dropdown select', category: 'Selection', example: 'SelectExample' },
  { slug: 'autocomplete', title: 'Autocomplete', description: 'Combobox with suggestions', category: 'Selection', example: 'AutocompleteExample' },
  { slug: 'badge', title: 'Badge', description: 'Dot and numbered badges', category: 'Communication', example: 'BadgeExample' },
  { slug: 'tooltip', title: 'Tooltip', description: 'Plain tooltip trigger', category: 'Communication', example: 'TooltipExample' },
  { slug: 'card', title: 'Card', description: 'Elevated card surface', category: 'Containment', example: 'CardExample' },
  { slug: 'list', title: 'List', description: 'List and list items', category: 'Containment', example: 'ListExample' },
  { slug: 'divider', title: 'Divider', description: 'Horizontal divider', category: 'Containment', example: 'DividerExample' },
  { slug: 'tabs', title: 'Tabs', description: 'Primary tabs with panels', category: 'Containment', example: 'TabsExample' },
  { slug: 'dialog', title: 'Dialog', description: 'Modal dialog', category: 'Containment', example: 'DialogExample' },
  { slug: 'bottom-sheet', title: 'Bottom Sheet', description: 'Modal bottom sheet', category: 'Containment', example: 'BottomSheetExample' },
  { slug: 'side-sheet', title: 'Side Sheet', description: 'Side sheet with header', category: 'Containment', example: 'SideSheetExample' },
  { slug: 'carousel', title: 'Carousel', description: 'Multi-browse carousel', category: 'Containment', example: 'CarouselExample' },
  { slug: 'top-app-bar', title: 'Top App Bar', description: 'Flexible top app bar', category: 'Navigation', example: 'TopAppBarExample' },
  { slug: 'navigation-rail', title: 'Navigation Rail', description: 'Collapsed navigation rail', category: 'Navigation', example: 'NavigationRailExample' },
  { slug: 'navigation-drawer', title: 'Navigation Drawer', description: 'Standard navigation drawer', category: 'Navigation', example: 'NavigationDrawerExample' },
  { slug: 'navigation-bar', title: 'Navigation Bar', description: 'Bottom navigation bar', category: 'Navigation', example: 'NavigationBarExample' },
  { slug: 'adaptive-navigation', title: 'Adaptive Navigation', description: 'Responsive navigation chrome', category: 'Navigation', example: 'AdaptiveNavigationExample' },
  { slug: 'progress', title: 'Progress', description: 'Linear and circular progress', category: 'Feedback', example: 'ProgressExample' },
  { slug: 'loading-indicator', title: 'Loading Indicator', description: 'Expressive shape loader', category: 'Feedback', example: 'LoadingIndicatorExample' },
  { slug: 'snackbar', title: 'Snackbar', description: 'Toast with action', category: 'Feedback', example: 'SnackbarExample' },
  { slug: 'meter', title: 'Meter', description: 'Storage meter', category: 'Feedback', example: 'MeterExample' },
  { slug: 'date-input', title: 'Date Input', description: 'Locale-aware date input', category: 'Pickers', example: 'DateInputExample' },
  { slug: 'date-picker', title: 'Date Picker', description: 'Docked date picker', category: 'Pickers', example: 'DatePickerExample' },
  { slug: 'time-picker', title: 'Time Picker', description: 'Dial time picker', category: 'Pickers', example: 'TimePickerExample' },
  { slug: 'scaffold', title: 'Scaffold', description: 'App layout with FAB', category: 'Layout', example: 'ScaffoldExample' },
  { slug: 'pane-scaffold', title: 'Pane Scaffold', description: 'List-detail adaptive layout', category: 'Layout', example: 'PaneScaffoldExample' },
  { slug: 'toolbar', title: 'Toolbar', description: 'Floating toolbar', category: 'Layout', example: 'ToolbarExample' },
  { slug: 'placeholder-button', title: 'Placeholder Button', description: 'Internal registry placeholder', category: 'Actions', example: 'PlaceholderButtonExample', internal: true },
];

export const PUBLIC_CATALOG = STORYBOOK_CATALOG.filter((entry) => !entry.internal);
