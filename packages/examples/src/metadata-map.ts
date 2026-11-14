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
      "source": "const destinations = [\n  { value: 'home', label: 'Home', icon: <Icon name=\"home\" /> },\n  { value: 'search', label: 'Search', icon: <Icon name=\"search\" />, badge: 2 },\n  { value: 'settings', label: 'Settings', icon: <Icon name=\"settings\" /> },\n];\n\n<AdaptiveNavigation destinations={destinations} mode=\"bar\" />"
    },
    {
      "id": "adaptive-navigation-demo",
      "componentSlug": "adaptive-navigation",
      "title": "Storybook demo",
      "description": "Same scenario used in the monolithic Storybook catalog.",
      "source": "<AdaptiveNavigation\n  destinations={[\n    { value: 'home', label: 'Home', icon: <Icon name=\"home\" /> },\n    { value: 'search', label: 'Search', icon: <Icon name=\"search\" /> },\n    { value: 'settings', label: 'Settings', icon: <Icon name=\"settings\" /> },\n  ]}\n  mode=\"bar\"\n/>"
    }
  ],
  "button": [
    {
      "id": "button-variants",
      "componentSlug": "button",
      "title": "Variants",
      "description": "Filled, elevated, tonal, outlined, and text styles with interactive state layers.",
      "source": "<div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>\n  <Button variant=\"filled\">Filled</Button>\n  <Button variant=\"elevated\">Elevated</Button>\n  <Button variant=\"filled-tonal\">Tonal</Button>\n  <Button variant=\"outlined\">Outlined</Button>\n  <Button variant=\"text\">Text</Button>\n</div>"
    },
    {
      "id": "button-sizes",
      "componentSlug": "button",
      "title": "Sizes",
      "description": "Expressive size scale from xs through xl.",
      "source": "<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>\n  <Button size=\"xs\">xs</Button>\n  <Button size=\"sm\">sm</Button>\n  <Button size=\"md\">md</Button>\n  <Button size=\"lg\">lg</Button>\n  <Button size=\"xl\">xl</Button>\n</div>"
    },
    {
      "id": "button-states",
      "componentSlug": "button",
      "title": "Disabled",
      "description": "Disabled state across all variants using semantic disabled tokens.",
      "source": "<Button variant=\"filled\" disabled>Filled</Button>\n<Button variant=\"elevated\" disabled>Elevated</Button>\n<Button variant=\"outlined\" disabled>Outlined</Button>"
    },
    {
      "id": "button-icons",
      "componentSlug": "button",
      "title": "With icons",
      "description": "Leading and trailing icons at expressive sizes.",
      "source": "<Button startIcon={<Icon name=\"add\" />}>Create</Button>\n<Button variant=\"outlined\" endIcon={<Icon name=\"open_in_new\" />}>Open</Button>"
    }
  ],
  "card": [
    {
      "id": "card-variants",
      "componentSlug": "card",
      "title": "Variants",
      "description": "Elevated, filled, and outlined card surfaces.",
      "source": "<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>\n  <Card variant=\"elevated\" style={{ padding: 16 }}>Elevated</Card>\n  <Card variant=\"filled\" style={{ padding: 16 }}>Filled</Card>\n  <Card variant=\"outlined\" style={{ padding: 16 }}>Outlined</Card>\n</div>"
    },
    {
      "id": "card-elevation",
      "componentSlug": "card",
      "title": "Elevation levels",
      "description": "Semantic elevation from level0 through level5 on Surface.",
      "source": "<Surface elevation=\"level1\" style={{ padding: 16 }}>level1</Surface>\n<Surface elevation=\"level2\" style={{ padding: 16 }}>level2</Surface>\n<Surface elevation=\"level3\" style={{ padding: 16 }}>level3</Surface>"
    }
  ],
  "checkbox": [
    {
      "id": "checkbox-basic",
      "componentSlug": "checkbox",
      "title": "Basic",
      "description": "Standalone checkboxes with an indeterminate state.",
      "source": "<CheckboxGroup defaultValue={[]}>\n  <Checkbox label=\"Option A\" value=\"a\" />\n  <Checkbox label=\"Option B\" value=\"b\" />\n  <Checkbox label=\"Indeterminate\" indeterminate />\n</CheckboxGroup>"
    },
    {
      "id": "checkbox-group",
      "componentSlug": "checkbox",
      "title": "Group",
      "description": "Checkbox group with a default selection.",
      "source": "<CheckboxGroup defaultValue={['a']}>\n  <Checkbox label=\"Checkbox A\" value=\"a\" />\n  <Checkbox label=\"Checkbox B\" value=\"b\" />\n</CheckboxGroup>"
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
      "source": "<ChipSet>\n  <Chip type=\"filter\" label=\"Photos\" />\n  <Chip type=\"suggestion\" label=\"Weekend\" elevated />\n</ChipSet>"
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
      "source": "<WindowSizeClassProvider defaultSizeClass=\"compact\" style={{ minHeight: 400 }}>\n  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>\n    <DatePicker variant=\"docked\" trigger={<Button variant=\"outlined\">Docked</Button>} />\n    <DatePicker variant=\"modal\" trigger={<Button variant=\"filled-tonal\">Modal</Button>} />\n    <DatePicker variant=\"modal\" mode=\"range\" trigger={<Button variant=\"text\">Range</Button>} />\n  </div>\n</WindowSizeClassProvider>"
    },
    {
      "id": "date-picker-docked",
      "componentSlug": "date-picker",
      "title": "Docked",
      "description": "Inline docked picker from the Storybook demo.",
      "source": "<WindowSizeClassProvider defaultSizeClass=\"compact\" style={{ minHeight: 200 }}>\n  <DatePicker variant=\"docked\" />\n</WindowSizeClassProvider>"
    }
  ],
  "dialog": [
    {
      "id": "dialog-variants",
      "componentSlug": "dialog",
      "title": "Variants",
      "description": "Basic, alert, and full-screen dialog patterns.",
      "source": "<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>\n  <Dialog\n    trigger={<Button variant=\"filled\">Basic dialog</Button>}\n    headline=\"Dialog title\"\n    body=\"Supporting text\"\n    actions={<DialogAction>OK</DialogAction>}\n  />\n  <AlertDialog\n    trigger={<Button variant=\"outlined\">Alert</Button>}\n    headline=\"Delete file?\"\n    body=\"This cannot be undone.\"\n  />\n  <FullScreenDialog\n    trigger={<Button variant=\"text\">Full screen</Button>}\n    headline=\"Edit\"\n    body=\"Full screen content\"\n  />\n</div>"
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
      "source": "<div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>\n  <Fab aria-label=\"Add\" icon={<Icon name=\"add\" />} size=\"standard\" />\n  <Fab aria-label=\"Add\" icon={<Icon name=\"add\" />} size=\"medium\" />\n  <Fab aria-label=\"Add\" icon={<Icon name=\"add\" />} size=\"large\" />\n  <ExtendedFab icon={<Icon name=\"edit\" />} label=\"Compose\" size=\"small\" />\n</div>"
    },
    {
      "id": "fab-colors",
      "componentSlug": "fab",
      "title": "Color variants",
      "description": "Expressive tone and container color families.",
      "source": "<Fab aria-label=\"Edit\" icon={<Icon name=\"edit\" />} variant=\"primary\" />\n<Fab aria-label=\"Edit\" icon={<Icon name=\"edit\" />} variant=\"secondary\" />\n<Fab aria-label=\"Edit\" icon={<Icon name=\"edit\" />} variant=\"tertiary-container\" />"
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
      "source": "<div style={{ display: 'flex', gap: 12 }}>\n  <IconButton aria-label=\"Standard\" icon={<Icon name=\"favorite\" />} variant=\"standard\" />\n  <IconButton aria-label=\"Filled\" icon={<Icon name=\"favorite\" fill={1} />} variant=\"filled\" />\n  <IconButton aria-label=\"Tonal\" icon={<Icon name=\"favorite\" />} variant=\"filled-tonal\" />\n  <IconButton aria-label=\"Outlined\" icon={<Icon name=\"favorite\" />} variant=\"outlined\" toggle selected />\n</div>"
    },
    {
      "id": "icon-button-sizes",
      "componentSlug": "icon-button",
      "title": "Sizes",
      "description": "Expressive size scale from xs through xl.",
      "source": "<IconButton aria-label=\"Favorite xs\" icon={<Icon name=\"favorite\" />} size=\"xs\" />\n<IconButton aria-label=\"Favorite sm\" icon={<Icon name=\"favorite\" />} size=\"sm\" />\n<IconButton aria-label=\"Favorite md\" icon={<Icon name=\"favorite\" />} size=\"md\" />\n<IconButton aria-label=\"Favorite lg\" icon={<Icon name=\"favorite\" />} size=\"lg\" />\n<IconButton aria-label=\"Favorite xl\" icon={<Icon name=\"favorite\" />} size=\"xl\" />"
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
      "source": "<Menu trigger={<Button variant=\"outlined\">Open menu</Button>}>\n  <MenuItem leadingIcon={<Icon name=\"edit\" />}>Edit</MenuItem>\n  <MenuItem shortcut=\"⌘C\">Copy</MenuItem>\n  <MenuItem trailingIcon={<Icon name=\"delete\" />}>Delete</MenuItem>\n</Menu>"
    }
  ],
  "navigation-bar": [
    {
      "id": "navigation-bar-basic",
      "componentSlug": "navigation-bar",
      "title": "Destinations",
      "description": "Bottom navigation bar with badges on destinations.",
      "source": "<NavigationBar\n  destinations={[\n    { value: 'home', label: 'Home', icon: <Icon name=\"home\" /> },\n    { value: 'search', label: 'Search', icon: <Icon name=\"search\" />, badge: 3 },\n    { value: 'library', label: 'Library', icon: <Icon name=\"photo_library\" /> },\n  ]}\n  defaultValue=\"home\"\n/>"
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
      "source": "<RadioGroup defaultValue=\"pro\" name=\"plan\">\n  <Radio value=\"free\" label=\"Free\" />\n  <Radio value=\"pro\" label=\"Pro\" />\n  <Radio value=\"team\" label=\"Team\" />\n</RadioGroup>"
    }
  ],
  "select": [
    {
      "id": "select-basic",
      "componentSlug": "select",
      "title": "Basic",
      "description": "Dropdown select styled as an M3 text field.",
      "source": "<Select\n  label=\"Framework\"\n  options={[\n    { value: 'react', label: 'React' },\n    { value: 'vue', label: 'Vue' },\n    { value: 'svelte', label: 'Svelte' },\n  ]}\n  defaultValue=\"react\"\n/>"
    }
  ],
  "slider": [
    {
      "id": "slider-variants",
      "componentSlug": "slider",
      "title": "Single and range",
      "description": "Continuous slider with value indicator and dual-thumb range.",
      "source": "<div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 400 }}>\n  <Slider defaultValue={50} label=\"Volume\" showValueIndicator min={0} max={100} />\n  <Slider defaultValue={[25, 75]} label=\"Range\" showValueIndicator min={0} max={100} />\n</div>"
    }
  ],
  "snackbar": [
    {
      "id": "snackbar-basic",
      "componentSlug": "snackbar",
      "title": "With action",
      "description": "Snackbar provider with undo action.",
      "source": "function App() {\n  const { show } = useSnackbar();\n  return (\n    <Button onClick={() => show({ message: 'Saved', action: { label: 'Undo', onClick: undo } })}>\n      Save\n    </Button>\n  );\n}\n\nexport default () => (\n  <Snackbar><App /></Snackbar>\n);"
    }
  ],
  "switch": [
    {
      "id": "switch-states",
      "componentSlug": "switch",
      "title": "States",
      "description": "On, off, and labeled switch settings.",
      "source": "<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>\n  <Switch label=\"Dark mode\" defaultChecked />\n  <Switch label=\"Wi-Fi only downloads\" />\n</div>"
    }
  ],
  "tabs": [
    {
      "id": "tabs-primary",
      "componentSlug": "tabs",
      "title": "Primary tabs",
      "description": "Fixed primary tabs with three panels.",
      "source": "<Tabs\n  variant=\"primary\"\n  layout=\"fixed\"\n  items={[\n    { value: 'photos', label: 'Photos', panel: 'Photos panel' },\n    { value: 'albums', label: 'Albums', panel: 'Albums panel' },\n    { value: 'stories', label: 'Stories', panel: 'Stories panel' },\n  ]}\n/>"
    },
    {
      "id": "tabs-compact",
      "componentSlug": "tabs",
      "title": "Compact",
      "description": "Default tabs layout from the Storybook demo.",
      "source": "<Tabs\n  items={[\n    { value: 'a', label: 'Tab A', panel: 'Panel A' },\n    { value: 'b', label: 'Tab B', panel: 'Panel B' },\n  ]}\n/>"
    }
  ],
  "text-field": [
    {
      "id": "text-field-variants",
      "componentSlug": "text-field",
      "title": "Variants",
      "description": "Filled and outlined text fields with supporting text.",
      "source": "<div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>\n  <TextField label=\"Filled\" variant=\"filled\" supportingText=\"Supporting text\" />\n  <TextField label=\"Outlined\" variant=\"outlined\" />\n</div>"
    }
  ]
};

export function getExampleMetadataForSlug(slug: string) {
  return METADATA_BY_SLUG[slug] ?? [];
}

export function getAllExampleMetadataSlugs(): string[] {
  return Object.keys(METADATA_BY_SLUG).sort();
}
