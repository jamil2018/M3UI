import type { ExampleMetadataBySlug } from './types-metadata';

/** Serializable example metadata — safe for server components and docs SSR */
export const METADATA_BY_SLUG: ExampleMetadataBySlug = {
  "button-group": [
    {
      "id": "button-group-connected",
      "componentSlug": "button-group",
      "title": "Connected group",
      "source": "<ButtonGroup>\\n  <ButtonGroupItem>Save</ButtonGroupItem>\\n</ButtonGroup>"
    }
  ],
  "split-button": [
    {
      "id": "split-button-send",
      "componentSlug": "split-button",
      "title": "Send with menu",
      "source": "<SplitButton menuItems={...}>Send</SplitButton>"
    }
  ],
  "fab-menu": [
    {
      "id": "fab-menu-actions",
      "componentSlug": "fab-menu",
      "title": "Labeled actions",
      "source": "<FabMenu icon={<Icon name=\"add\" />} actions={actions} />"
    }
  ],
  "toolbar": [
    {
      "id": "toolbar-floating",
      "componentSlug": "toolbar",
      "title": "Floating toolbar",
      "source": "<Toolbar variant=\"floating\">...</Toolbar>"
    }
  ],
  "adaptive-navigation": [
    {
      "id": "adaptive-navigation-bar",
      "componentSlug": "adaptive-navigation",
      "title": "Navigation bar mode",
      "description": "Adaptive navigation forced to bottom bar layout.",
      "source": "const destinations = [\r\n  { value: 'home', label: 'Home', icon: <Icon name=\"home\" /> },\n  { value: 'search', label: 'Search', icon: <Icon name=\"search\" />, badge: 2 },\n  { value: 'settings', label: 'Settings', icon: <Icon name=\"settings\" /> },\n];\r\n\r\n<AdaptiveNavigation destinations={destinations} mode=\"bar\" />"
    },
    {
      "id": "adaptive-navigation-demo",
      "componentSlug": "adaptive-navigation",
      "title": "Storybook demo",
      "description": "Same scenario used in the monolithic Storybook catalog.",
      "source": "<AdaptiveNavigation\r\n  destinations={[\r\n    { value: 'home', label: 'Home', icon: <Icon name=\"home\" /> },\n    { value: 'search', label: 'Search', icon: <Icon name=\"search\" /> },\n    { value: 'settings', label: 'Settings', icon: <Icon name=\"settings\" /> },\n  ]}\r\n  mode=\"bar\"\r\n/>"
    }
  ],
  "button": [
    {
      "id": "button-variants",
      "componentSlug": "button",
      "title": "Variants",
      "description": "Filled, elevated, tonal, outlined, and text styles with interactive state layers.",
      "source": "<div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>\r\n  <Button variant=\"filled\">Filled</Button>\r\n  <Button variant=\"elevated\">Elevated</Button>\r\n  <Button variant=\"filled-tonal\">Tonal</Button>\r\n  <Button variant=\"outlined\">Outlined</Button>\r\n  <Button variant=\"text\">Text</Button>\r\n</div>"
    },
    {
      "id": "button-sizes",
      "componentSlug": "button",
      "title": "Sizes",
      "description": "Expressive size scale from xs through xl.",
      "source": "<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>\r\n  <Button size=\"xs\">xs</Button>\r\n  <Button size=\"sm\">sm</Button>\r\n  <Button size=\"md\">md</Button>\r\n  <Button size=\"lg\">lg</Button>\r\n  <Button size=\"xl\">xl</Button>\r\n</div>"
    },
    {
      "id": "button-states",
      "componentSlug": "button",
      "title": "Disabled",
      "description": "Disabled state across all variants using semantic disabled tokens.",
      "source": "<Button variant=\"filled\" disabled>Filled</Button>\r\n<Button variant=\"elevated\" disabled>Elevated</Button>\r\n<Button variant=\"outlined\" disabled>Outlined</Button>"
    },
    {
      "id": "button-icons",
      "componentSlug": "button",
      "title": "With icons",
      "description": "Leading and trailing icons at expressive sizes.",
      "source": "<Button startIcon={<Icon name=\"add\" />}>Create</Button>\r\n<Button variant=\"outlined\" endIcon={<Icon name=\"open_in_new\" />}>Open</Button>"
    }
  ],
  "card": [
    {
      "id": "card-variants",
      "componentSlug": "card",
      "title": "Variants",
      "description": "Elevated, filled, and outlined card surfaces.",
      "source": "<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>\r\n  <Card variant=\"elevated\" style={{ padding: 16 }}>Elevated</Card>\r\n  <Card variant=\"filled\" style={{ padding: 16 }}>Filled</Card>\r\n  <Card variant=\"outlined\" style={{ padding: 16 }}>Outlined</Card>\r\n</div>"
    },
    {
      "id": "card-elevation",
      "componentSlug": "card",
      "title": "Elevation levels",
      "description": "Semantic elevation from level0 through level5 on Surface.",
      "source": "<Surface elevation=\"level1\" style={{ padding: 16 }}>level1</Surface>\r\n<Surface elevation=\"level2\" style={{ padding: 16 }}>level2</Surface>\r\n<Surface elevation=\"level3\" style={{ padding: 16 }}>level3</Surface>"
    }
  ],
  "checkbox": [
    {
      "id": "checkbox-basic",
      "componentSlug": "checkbox",
      "title": "Basic",
      "description": "Standalone checkboxes with an indeterminate state.",
      "source": "<CheckboxGroup defaultValue={[]}>\r\n  <Checkbox label=\"Option A\" value=\"a\" />\r\n  <Checkbox label=\"Option B\" value=\"b\" />\r\n  <Checkbox label=\"Indeterminate\" indeterminate />\r\n</CheckboxGroup>"
    },
    {
      "id": "checkbox-group",
      "componentSlug": "checkbox",
      "title": "Group",
      "description": "Checkbox group with a default selection.",
      "source": "<CheckboxGroup defaultValue={['a']}>\r\n  <Checkbox label=\"Checkbox A\" value=\"a\" />\r\n  <Checkbox label=\"Checkbox B\" value=\"b\" />\r\n</CheckboxGroup>"
    }
  ],
  "badge": [
    {
      "id": "badge-types",
      "componentSlug": "badge",
      "title": "Dot and count",
      "description": "Presence dot and numeric notification badges.",
      "source": "<Badge variant=\"dot\" />\\n<Badge count={5} />"
    }
  ],
  "tooltip": [
    {
      "id": "tooltip-plain-rich",
      "componentSlug": "tooltip",
      "title": "Plain and rich",
      "description": "Single-line and rich tooltips with title and body.",
      "source": "<Tooltip trigger={<Button>Help</Button>} content=\"Hint\" />"
    }
  ],
  "chip": [
    {
      "id": "chip-types",
      "componentSlug": "chip",
      "title": "Chip types",
      "description": "Assist, filter, input, and elevated suggestion chips.",
      "source": "<ChipSet>\r\n  <Chip type=\"filter\" label=\"Photos\" />\r\n  <Chip type=\"suggestion\" label=\"Weekend\" elevated />\r\n</ChipSet>"
    }
  ],
  "list": [
    {
      "id": "list-items",
      "componentSlug": "list",
      "title": "List items",
      "description": "One- and two-line items with selection.",
      "source": "<List>\\n  <ListItem headline=\"Inbox\" lines={2} />\\n</List>"
    }
  ],
  "divider": [
    {
      "id": "divider-variants",
      "componentSlug": "divider",
      "title": "Full-width and inset",
      "source": "<Divider />\\n<Divider variant=\"inset\" />"
    }
  ],
  "carousel": [
    {
      "id": "carousel-multi",
      "componentSlug": "carousel",
      "title": "Multi-browse",
      "description": "Horizontal carousel with adjacent item peek.",
      "source": "<Carousel layout=\"multi-browse\" items={items} />"
    }
  ],
  "bottom-sheet": [
    {
      "id": "bottom-sheet-basic",
      "componentSlug": "bottom-sheet",
      "title": "Modal sheet",
      "source": "<BottomSheet trigger={<Button>Open</Button>}>Content</BottomSheet>"
    }
  ],
  "side-sheet": [
    {
      "id": "side-sheet-basic",
      "componentSlug": "side-sheet",
      "title": "Side panel",
      "source": "<SideSheet trigger={<Button>Filters</Button>} headline=\"Filters\" />"
    }
  ],
  "date-picker": [
    {
      "id": "date-picker-variants",
      "componentSlug": "date-picker",
      "title": "Variants",
      "description": "Docked, modal, and range date pickers.",
      "source": "<WindowSizeClassProvider defaultSizeClass=\"compact\" style={{ minHeight: 400 }}>\r\n  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>\r\n    <DatePicker variant=\"docked\" trigger={<Button variant=\"outlined\">Docked</Button>} />\r\n    <DatePicker variant=\"modal\" trigger={<Button variant=\"filled-tonal\">Modal</Button>} />\r\n    <DatePicker variant=\"modal\" mode=\"range\" trigger={<Button variant=\"text\">Range</Button>} />\r\n  </div>\r\n</WindowSizeClassProvider>"
    },
    {
      "id": "date-picker-docked",
      "componentSlug": "date-picker",
      "title": "Docked",
      "description": "Inline docked picker from the Storybook demo.",
      "source": "<WindowSizeClassProvider defaultSizeClass=\"compact\" style={{ minHeight: 200 }}>\r\n  <DatePicker variant=\"docked\" />\r\n</WindowSizeClassProvider>"
    }
  ],
  "dialog": [
    {
      "id": "dialog-variants",
      "componentSlug": "dialog",
      "title": "Variants",
      "description": "Basic, alert, and full-screen dialog patterns.",
      "source": "<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>\r\n  <Dialog\r\n    trigger={<Button variant=\"filled\">Basic dialog</Button>}\r\n    headline=\"Dialog title\"\r\n    body=\"Supporting text\"\r\n    actions={<DialogAction>OK</DialogAction>}\r\n  />\r\n  <AlertDialog\r\n    trigger={<Button variant=\"outlined\">Alert</Button>}\r\n    headline=\"Delete file?\"\r\n    body=\"This cannot be undone.\"\r\n  />\r\n  <FullScreenDialog\r\n    trigger={<Button variant=\"text\">Full screen</Button>}\r\n    headline=\"Edit\"\r\n    body=\"Full screen content\"\r\n  />\r\n</div>"
    },
    {
      "id": "dialog-basic",
      "componentSlug": "dialog",
      "title": "Basic",
      "description": "Minimal dialog trigger from the Storybook demo.",
      "source": "<Dialog trigger={<Button variant=\"outlined\">Dialog</Button>} headline=\"Dialog\" body=\"Body\" />"
    }
  ],
  "fab": [
    {
      "id": "fab-sizes",
      "componentSlug": "fab",
      "title": "Sizes",
      "description": "Standard, medium, and large FABs plus the small extended FAB.",
      "source": "<div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>\r\n  <Fab aria-label=\"Add\" icon={<Icon name=\"add\" />} size=\"standard\" />\r\n  <Fab aria-label=\"Add\" icon={<Icon name=\"add\" />} size=\"medium\" />\r\n  <Fab aria-label=\"Add\" icon={<Icon name=\"add\" />} size=\"large\" />\r\n  <ExtendedFab icon={<Icon name=\"edit\" />} label=\"Compose\" size=\"small\" />\r\n</div>"
    },
    {
      "id": "fab-colors",
      "componentSlug": "fab",
      "title": "Color variants",
      "description": "Expressive tone and container color families.",
      "source": "<Fab aria-label=\"Edit\" icon={<Icon name=\"edit\" />} variant=\"primary\" />\r\n<Fab aria-label=\"Edit\" icon={<Icon name=\"edit\" />} variant=\"secondary\" />\r\n<Fab aria-label=\"Edit\" icon={<Icon name=\"edit\" />} variant=\"tertiary-container\" />"
    }
  ],
  "progress": [
    {
      "id": "progress-linear-circular",
      "componentSlug": "progress",
      "title": "Linear and circular",
      "description": "Determinate progress including wavy Expressive variant.",
      "source": "<LinearProgress value={60} />\\n<CircularProgress value={75} />"
    }
  ],
  "loading-indicator": [
    {
      "id": "loading-contained",
      "componentSlug": "loading-indicator",
      "title": "Contained loader",
      "description": "Shape-cycling Expressive loading indicator.",
      "source": "<LoadingIndicator contained />"
    }
  ],
  "meter": [
    {
      "id": "meter-storage",
      "componentSlug": "meter",
      "title": "Storage meter",
      "source": "<Meter value={65} label=\"Storage\" />"
    }
  ],
  "icon-button": [
    {
      "id": "icon-button-variants",
      "componentSlug": "icon-button",
      "title": "Variants",
      "description": "Standard, filled, tonal, and outlined icon buttons with state layers.",
      "source": "<div style={{ display: 'flex', gap: 12 }}>\r\n  <IconButton aria-label=\"Standard\" icon={<Icon name=\"favorite\" />} variant=\"standard\" />\r\n  <IconButton aria-label=\"Filled\" icon={<Icon name=\"favorite\" fill={1} />} variant=\"filled\" />\r\n  <IconButton aria-label=\"Tonal\" icon={<Icon name=\"favorite\" />} variant=\"filled-tonal\" />\r\n  <IconButton aria-label=\"Outlined\" icon={<Icon name=\"favorite\" />} variant=\"outlined\" toggle selected />\r\n</div>"
    },
    {
      "id": "icon-button-sizes",
      "componentSlug": "icon-button",
      "title": "Sizes",
      "description": "Expressive size scale from xs through xl.",
      "source": "<IconButton aria-label=\"Favorite xs\" icon={<Icon name=\"favorite\" />} size=\"xs\" />\r\n<IconButton aria-label=\"Favorite sm\" icon={<Icon name=\"favorite\" />} size=\"sm\" />\r\n<IconButton aria-label=\"Favorite md\" icon={<Icon name=\"favorite\" />} size=\"md\" />\r\n<IconButton aria-label=\"Favorite lg\" icon={<Icon name=\"favorite\" />} size=\"lg\" />\r\n<IconButton aria-label=\"Favorite xl\" icon={<Icon name=\"favorite\" />} size=\"xl\" />"
    }
  ],
  "autocomplete": [
    {
      "id": "autocomplete-basic",
      "componentSlug": "autocomplete",
      "title": "Filtered options",
      "source": "<Autocomplete label=\"Framework\" options={options} />"
    }
  ],
  "search": [
    {
      "id": "search-bar",
      "componentSlug": "search",
      "title": "Search bar",
      "source": "<SearchBar placeholder=\"Search\" />"
    }
  ],
  "segmented-button": [
    {
      "id": "segmented-day-week",
      "componentSlug": "segmented-button",
      "title": "View switcher",
      "source": "<SegmentedButton defaultValue={['day']}>...</SegmentedButton>"
    }
  ],
  "date-input": [
    {
      "id": "date-input-locale",
      "componentSlug": "date-input",
      "title": "Locale-aware input",
      "source": "<DateInput label=\"Date\" />"
    }
  ],
  "time-picker": [
    {
      "id": "time-picker-dial",
      "componentSlug": "time-picker",
      "title": "Dial picker",
      "source": "<TimePicker variant=\"dial\" />"
    }
  ],
  "scaffold": [
    {
      "id": "scaffold-chrome",
      "componentSlug": "scaffold",
      "title": "App chrome",
      "description": "Top bar, FAB anchor, and content insets.",
      "source": "<Scaffold topAppBar={...} fab={...}>{children}</Scaffold>"
    }
  ],
  "pane-scaffold": [
    {
      "id": "pane-list-detail",
      "componentSlug": "pane-scaffold",
      "title": "List-detail",
      "source": "<PaneScaffold list={...} detail={...} />"
    }
  ],
  "menu": [
    {
      "id": "menu-basic",
      "componentSlug": "menu",
      "title": "Basic",
      "description": "Dropdown menu with icons and keyboard shortcuts.",
      "source": "<Menu trigger={<Button variant=\"outlined\">Open menu</Button>}>\r\n  <MenuItem leadingIcon={<Icon name=\"edit\" />}>Edit</MenuItem>\r\n  <MenuItem shortcut=\"⌘C\">Copy</MenuItem>\r\n  <MenuItem trailingIcon={<Icon name=\"delete\" />}>Delete</MenuItem>\r\n</Menu>"
    }
  ],
  "navigation-bar": [
    {
      "id": "navigation-bar-basic",
      "componentSlug": "navigation-bar",
      "title": "Destinations",
      "description": "Bottom navigation bar with badges on destinations.",
      "source": "<NavigationBar\r\n  destinations={[\r\n    { value: 'home', label: 'Home', icon: <Icon name=\"home\" /> },\n    { value: 'search', label: 'Search', icon: <Icon name=\"search\" />, badge: 3 },\n    { value: 'library', label: 'Library', icon: <Icon name=\"photo_library\" /> },\n  ]}\r\n  defaultValue=\"home\"\r\n/>"
    }
  ],
  "top-app-bar": [
    {
      "id": "top-app-bar-medium",
      "componentSlug": "top-app-bar",
      "title": "Medium flexible",
      "source": "<TopAppBar title=\"Photos\" trailing={<IconButton icon={<Icon name=\"search\" />} />} />"
    }
  ],
  "bottom-app-bar": [
    {
      "id": "bottom-app-bar-fab",
      "componentSlug": "bottom-app-bar",
      "title": "With FAB",
      "source": "<BottomAppBar fab={<Fab icon={<Icon name=\"add\" />} size=\"standard\" />} actions={...} />"
    }
  ],
  "navigation-rail": [
    {
      "id": "nav-rail-collapsed",
      "componentSlug": "navigation-rail",
      "title": "Collapsed rail",
      "source": "<NavigationRail destinations={destinations} mode=\"collapsed\" />"
    }
  ],
  "navigation-drawer": [
    {
      "id": "nav-drawer-standard",
      "componentSlug": "navigation-drawer",
      "title": "Standard drawer",
      "source": "<NavigationDrawer variant=\"standard\" sections={sections} />"
    }
  ],
  "radio": [
    {
      "id": "radio-group",
      "componentSlug": "radio",
      "title": "Group",
      "description": "Mutually exclusive radio options in a group.",
      "source": "<RadioGroup defaultValue=\"pro\" name=\"plan\">\r\n  <Radio value=\"free\" label=\"Free\" />\r\n  <Radio value=\"pro\" label=\"Pro\" />\r\n  <Radio value=\"team\" label=\"Team\" />\r\n</RadioGroup>"
    }
  ],
  "select": [
    {
      "id": "select-basic",
      "componentSlug": "select",
      "title": "Basic",
      "description": "Dropdown select styled as an M3 text field.",
      "source": "<Select\r\n  label=\"Framework\"\r\n  options={[\r\n    { value: 'react', label: 'React' },\r\n    { value: 'vue', label: 'Vue' },\r\n    { value: 'svelte', label: 'Svelte' },\r\n  ]}\r\n  defaultValue=\"react\"\r\n/>"
    }
  ],
  "slider": [
    {
      "id": "slider-variants",
      "componentSlug": "slider",
      "title": "Single and range",
      "description": "Continuous slider with value indicator and dual-thumb range.",
      "source": "<div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>\r\n  <Slider defaultValue={50} label=\"Volume\" showValueIndicator min={0} max={100} />\r\n  <Slider defaultValue={[25, 75]} label=\"Range\" showValueIndicator min={0} max={100} />\r\n</div>"
    }
  ],
  "snackbar": [
    {
      "id": "snackbar-basic",
      "componentSlug": "snackbar",
      "title": "With action",
      "description": "Snackbar provider with undo action.",
      "source": "function App() {\r\n  const { show } = useSnackbar();\r\n  return (\r\n    <Button onClick={() => show({ message: 'Saved', action: { label: 'Undo', onClick: undo } })}>\r\n      Save\r\n    </Button>\r\n  );\r\n}\r\n\r\nexport default () => (\r\n  <Snackbar><App /></Snackbar>\r\n);"
    }
  ],
  "switch": [
    {
      "id": "switch-states",
      "componentSlug": "switch",
      "title": "States",
      "description": "On, off, and labeled switch settings.",
      "source": "<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>\r\n  <Switch label=\"Dark mode\" defaultChecked />\r\n  <Switch label=\"Wi-Fi only downloads\" />\r\n</div>"
    }
  ],
  "tabs": [
    {
      "id": "tabs-primary",
      "componentSlug": "tabs",
      "title": "Primary tabs",
      "description": "Fixed primary tabs with three panels.",
      "source": "<Tabs\r\n  variant=\"primary\"\r\n  layout=\"fixed\"\r\n  items={[\r\n    { value: 'photos', label: 'Photos', panel: 'Photos panel' },\r\n    { value: 'albums', label: 'Albums', panel: 'Albums panel' },\r\n    { value: 'stories', label: 'Stories', panel: 'Stories panel' },\r\n  ]}\r\n/>"
    },
    {
      "id": "tabs-compact",
      "componentSlug": "tabs",
      "title": "Compact",
      "description": "Default tabs layout from the Storybook demo.",
      "source": "<Tabs\r\n  items={[\r\n    { value: 'a', label: 'Tab A', panel: 'Panel A' },\r\n    { value: 'b', label: 'Tab B', panel: 'Panel B' },\r\n  ]}\r\n/>"
    }
  ],
  "text-field": [
    {
      "id": "text-field-variants",
      "componentSlug": "text-field",
      "title": "Variants",
      "description": "Filled and outlined text fields with supporting text.",
      "source": "<div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>\r\n  <TextField label=\"Filled\" variant=\"filled\" supportingText=\"Supporting text\" />\r\n  <TextField label=\"Outlined\" variant=\"outlined\" />\r\n</div>"
    }
  ]
};

export function getExampleMetadataForSlug(slug: string) {
  return METADATA_BY_SLUG[slug] ?? [];
}

export function getAllExampleMetadataSlugs(): string[] {
  return Object.keys(METADATA_BY_SLUG).sort();
}
