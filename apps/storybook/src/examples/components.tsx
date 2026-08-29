import {
  Button,
  IconButton,
  Fab,
  ExtendedFab,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Card,
  List,
  ListItem,
  Divider,
  Badge,
  Tooltip,
  Surface,
  Chip,
  ChipSet,
  SegmentedButton,
  SegmentedButtonItem,
  Slider,
  Menu,
  MenuItem,
  Select,
  Autocomplete,
  LinearProgress,
  CircularProgress,
  LoadingIndicator,
  Snackbar,
  useSnackbar,
  Meter,
  TopAppBar,
  BottomAppBar,
  NavigationBar,
  NavigationRail,
  NavigationDrawer,
  Tabs,
  SearchBar,
  Dialog,
  BottomSheet,
  SideSheet,
  Carousel,
  Scaffold,
  FabAnchor,
  ButtonGroup,
  ButtonGroupItem,
  SplitButton,
  FabMenu,
  Toolbar,
  ToolbarButton,
  DateInput,
  DatePicker,
  TimePicker,
  PaneScaffold,
  PaneScaffoldRoot,
  AdaptiveNavigation,
  WindowSizeClassProvider,
  PlaceholderButton,
} from '@m3ui/react';

function SnackbarTrigger() {
  const { show } = useSnackbar();
  return (
    <Button
      variant="filled-tonal"
      onClick={() => show({ message: 'Item archived', action: { label: 'Undo', onClick: () => undefined } })}
    >
      Show snackbar
    </Button>
  );
}

export function ButtonExample() {
  return (
    <section data-testid="demo-buttons" className="demo-section">
      <h2>Buttons</h2>
      <div className="demo-row">
        {(['filled', 'elevated', 'filled-tonal', 'outlined', 'text'] as const).map((v) => (
          <Button key={v} variant={v} size="md">{v}</Button>
        ))}
      </div>
      <div className="demo-row">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Button key={s} size={s}>{s}</Button>
        ))}
      </div>
    </section>
  );
}

export function IconButtonExample() {
  return (
    <section data-testid="demo-icon-buttons" className="demo-section">
      <h2>Icon Buttons</h2>
      <div className="demo-row">
        <IconButton aria-label="Star" icon="★" variant="standard" />
        <IconButton aria-label="Star filled" icon="★" variant="filled" />
        <IconButton aria-label="Star tonal" icon="★" variant="filled-tonal" />
        <IconButton aria-label="Star outlined" icon="★" variant="outlined" toggle selected />
      </div>
    </section>
  );
}

export function FabExample() {
  return (
    <section data-testid="demo-fab" className="demo-section">
      <h2>FAB</h2>
      <div className="demo-row">
        <Fab aria-label="Add" icon="+" size="small" />
        <Fab aria-label="Add" icon="+" size="medium" />
        <ExtendedFab icon="+" label="Compose" />
      </div>
    </section>
  );
}

export function CheckboxExample() {
  return (
    <section data-testid="demo-checkbox" className="demo-section">
      <h2>Checkbox</h2>
      <CheckboxGroup defaultValue={['a']}>
        <Checkbox label="Checkbox A" value="a" />
        <Checkbox label="Checkbox B" value="b" />
      </CheckboxGroup>
    </section>
  );
}

export function RadioExample() {
  return (
    <section data-testid="demo-radio" className="demo-section">
      <h2>Radio</h2>
      <RadioGroup defaultValue="1" name="demo-radio">
        <Radio value="1" label="Radio 1" />
        <Radio value="2" label="Radio 2" />
      </RadioGroup>
    </section>
  );
}

export function SwitchExample() {
  return (
    <section data-testid="demo-switch" className="demo-section">
      <h2>Switch</h2>
      <Switch label="Switch" defaultChecked />
    </section>
  );
}

export function TextFieldExample() {
  return (
    <section data-testid="demo-text-field" className="demo-section" style={{ maxWidth: 320 }}>
      <h2>Text Field</h2>
      <TextField label="Email" variant="filled" supportingText="Your email" />
    </section>
  );
}

export function FormControlsExample() {
  return (
    <section data-testid="demo-form" className="demo-section">
      <h2>Form Controls</h2>
      <CheckboxExample />
      <RadioExample />
      <SwitchExample />
      <TextFieldExample />
    </section>
  );
}

export function CardExample() {
  return (
    <section data-testid="demo-card" className="demo-section">
      <h2>Card</h2>
      <Card variant="elevated" style={{ padding: 16 }}>Card</Card>
    </section>
  );
}

export function ListExample() {
  return (
    <section data-testid="demo-list" className="demo-section">
      <h2>List</h2>
      <List>
        <ListItem headline="List item" supportingText="Supporting" lines={2} divider />
        <ListItem headline="Selected" selected />
      </List>
    </section>
  );
}

export function DividerExample() {
  return (
    <section data-testid="demo-divider" className="demo-section">
      <h2>Divider</h2>
      <Divider />
    </section>
  );
}

export function ContainmentExample() {
  return (
    <section data-testid="demo-containment" className="demo-section">
      <h2>Containment</h2>
      <div className="demo-row" style={{ gap: 16, alignItems: 'flex-start' }}>
        <CardExample />
        <div style={{ flex: 1 }}><ListExample /></div>
      </div>
      <Divider style={{ margin: '16px 0' }} />
    </section>
  );
}

export function BadgeExample() {
  return (
    <section data-testid="demo-badge" className="demo-section">
      <h2>Badge</h2>
      <div className="demo-row">
        <Badge variant="dot" />
        <Badge count={5} />
      </div>
    </section>
  );
}

export function TooltipExample() {
  return (
    <section data-testid="demo-tooltip" className="demo-section">
      <h2>Tooltip</h2>
      <Tooltip trigger={<Button variant="outlined">Tooltip</Button>} content="Help text" />
    </section>
  );
}

export function CommunicationExample() {
  return (
    <section data-testid="demo-communication" className="demo-section">
      <h2>Communication</h2>
      <div className="demo-row" style={{ gap: 16 }}>
        <BadgeExample />
        <TooltipExample />
      </div>
    </section>
  );
}

export function ChipExample() {
  return (
    <section data-testid="demo-chips" className="demo-section">
      <h2>Chips</h2>
      <ChipSet>
        <Chip type="assist" label="Assist" />
        <Chip type="filter" label="Filter" defaultSelected />
        <Chip type="input" label="Input" onRemove={() => undefined} />
        <Chip type="suggestion" label="Suggestion" elevated />
      </ChipSet>
    </section>
  );
}

export function SegmentedButtonExample() {
  return (
    <section data-testid="demo-segmented" className="demo-section">
      <h2>Segmented Button</h2>
      <SegmentedButton defaultValue={['day']}>
        <SegmentedButtonItem value="day" label="Day" />
        <SegmentedButtonItem value="week" label="Week" />
        <SegmentedButtonItem value="month" label="Month" />
      </SegmentedButton>
    </section>
  );
}

export function SliderExample() {
  return (
    <section data-testid="demo-slider" className="demo-section" style={{ maxWidth: 320 }}>
      <h2>Slider</h2>
      <Slider defaultValue={50} label="Volume" showValueIndicator />
    </section>
  );
}

export function MenuExample() {
  return (
    <section data-testid="demo-menu" className="demo-section">
      <h2>Menu</h2>
      <Menu trigger={<Button variant="outlined">Menu</Button>}>
        <MenuItem>Edit</MenuItem>
        <MenuItem shortcut="⌘C">Copy</MenuItem>
      </Menu>
    </section>
  );
}

export function SelectExample() {
  return (
    <section data-testid="demo-select" className="demo-section" style={{ minWidth: 200, maxWidth: 320 }}>
      <h2>Select</h2>
      <Select
        label="Pick"
        options={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
        defaultValue="a"
      />
    </section>
  );
}

export function AutocompleteExample() {
  return (
    <section data-testid="demo-autocomplete" className="demo-section" style={{ minWidth: 200, maxWidth: 320 }}>
      <h2>Autocomplete</h2>
      <Autocomplete
        label="Search"
        options={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
        ]}
      />
    </section>
  );
}

export function MenuSelectExample() {
  return (
    <section data-testid="demo-menu-select" className="demo-section">
      <h2>Menu &amp; Select</h2>
      <div className="demo-row" style={{ gap: 16, alignItems: 'flex-start' }}>
        <MenuExample />
        <SelectExample />
        <AutocompleteExample />
      </div>
    </section>
  );
}

export function ProgressExample() {
  return (
    <section data-testid="demo-progress" className="demo-section">
      <h2>Progress</h2>
      <div style={{ flex: 1, minWidth: 200 }}>
        <LinearProgress value={60} />
        <div style={{ marginTop: 12 }}>
          <LinearProgress value={40} variant="wavy" />
        </div>
      </div>
      <CircularProgress value={75} />
    </section>
  );
}

export function LoadingIndicatorExample() {
  return (
    <section data-testid="demo-loading-indicator" className="demo-section">
      <h2>Loading Indicator</h2>
      <LoadingIndicator contained />
    </section>
  );
}

export function MeterExample() {
  return (
    <section data-testid="demo-meter" className="demo-section" style={{ minWidth: 160, maxWidth: 320 }}>
      <h2>Meter</h2>
      <Meter value={65} label="Storage" />
    </section>
  );
}

export function FeedbackExample() {
  return (
    <section data-testid="demo-feedback" className="demo-section">
      <h2>Feedback</h2>
      <div className="demo-row" style={{ gap: 24, alignItems: 'center' }}>
        <ProgressExample />
        <LoadingIndicatorExample />
        <MeterExample />
      </div>
    </section>
  );
}

export function SnackbarExample() {
  return (
    <Snackbar>
      <section data-testid="demo-snackbar" className="demo-section">
        <h2>Snackbar</h2>
        <SnackbarTrigger />
      </section>
    </Snackbar>
  );
}

export function TopAppBarExample() {
  return (
    <section data-testid="demo-top-app-bar" className="demo-section">
      <h2>Top App Bar</h2>
      <TopAppBar title="Photos" subtitle="Album" size="medium-flexible" trailing={<IconButton aria-label="Search" icon="🔍" />} />
    </section>
  );
}

export function BottomAppBarExample() {
  return (
    <section data-testid="demo-bottom-app-bar" className="demo-section">
      <h2>Bottom App Bar</h2>
      <BottomAppBar
        actions={
          <>
            <IconButton aria-label="Menu" icon="☰" variant="standard" />
            <IconButton aria-label="Search" icon="🔍" variant="standard" />
          </>
        }
        fab={<Fab aria-label="Create" icon="+" size="small" />}
      />
    </section>
  );
}

export function NavigationRailExample() {
  return (
    <section data-testid="demo-nav-rail-compact" className="demo-section">
      <h2>Navigation Rail</h2>
      <NavigationRail
        destinations={[
          { value: 'home', label: 'Home', icon: '🏠' },
          { value: 'browse', label: 'Browse', icon: '📂' },
          { value: 'settings', label: 'Settings', icon: '⚙️' },
        ]}
        mode="collapsed"
      />
    </section>
  );
}

export function NavigationDrawerExample() {
  return (
    <section data-testid="demo-nav-drawer" className="demo-section">
      <h2>Navigation Drawer</h2>
      <NavigationDrawer
        variant="standard"
        sections={[{ items: [{ value: 'inbox', label: 'Inbox', icon: '📥' }] }]}
      />
    </section>
  );
}

export function NavigationBarExample() {
  return (
    <section data-testid="demo-nav-bar-compact" className="demo-section">
      <h2>Navigation Bar</h2>
      <NavigationBar
        destinations={[
          { value: 'home', label: 'Home', icon: '🏠' },
          { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
          { value: 'settings', label: 'Settings', icon: '⚙️' },
        ]}
      />
    </section>
  );
}

export function Phase3NavExample() {
  return (
    <section data-testid="demo-phase3-nav" className="demo-section">
      <h2>Phase 3 — Navigation</h2>
      <TopAppBarExample />
      <div className="demo-row" style={{ gap: 16, minHeight: 200, alignItems: 'flex-start' }}>
        <NavigationRailExample />
        <NavigationDrawerExample />
      </div>
      <NavigationBarExample />
    </section>
  );
}

export function TabsExample() {
  return (
    <section data-testid="demo-tabs" className="demo-section">
      <h2>Tabs</h2>
      <Tabs
        items={[
          { value: 'a', label: 'Tab A', panel: 'Panel A' },
          { value: 'b', label: 'Tab B', panel: 'Panel B' },
        ]}
      />
    </section>
  );
}

export function SearchExample() {
  return (
    <section data-testid="demo-search-bar" className="demo-section" style={{ maxWidth: 400 }}>
      <h2>Search</h2>
      <SearchBar placeholder="Search" />
    </section>
  );
}

export function DialogExample() {
  return (
    <section data-testid="demo-dialog" className="demo-section">
      <h2>Dialog</h2>
      <Dialog trigger={<Button variant="outlined">Dialog</Button>} headline="Dialog" body="Body" />
    </section>
  );
}

export function BottomSheetExample() {
  return (
    <section data-testid="demo-bottom-sheet" className="demo-section">
      <h2>Bottom Sheet</h2>
      <BottomSheet trigger={<Button variant="filled-tonal">Bottom sheet</Button>}>Sheet body</BottomSheet>
    </section>
  );
}

export function SideSheetExample() {
  return (
    <section data-testid="demo-side-sheet" className="demo-section">
      <h2>Side Sheet</h2>
      <SideSheet trigger={<Button variant="text">Side sheet</Button>} headline="Filters">Content</SideSheet>
    </section>
  );
}

export function CarouselExample() {
  return (
    <section data-testid="demo-carousel-compact" className="demo-section">
      <h2>Carousel</h2>
      <Carousel
        items={[
          { key: '1', content: <Card variant="elevated" style={{ padding: 24 }}>One</Card> },
          { key: '2', content: <Card variant="elevated" style={{ padding: 24 }}>Two</Card> },
        ]}
        layout="multi-browse"
      />
    </section>
  );
}

export function Phase3ContainmentExample() {
  return (
    <section data-testid="demo-phase3-containment" className="demo-section">
      <h2>Phase 3 — Containment</h2>
      <TabsExample />
      <SearchExample />
      <div className="demo-row" style={{ marginTop: 16 }}>
        <DialogExample />
        <BottomSheetExample />
        <SideSheetExample />
      </div>
      <CarouselExample />
    </section>
  );
}

export function ScaffoldExample() {
  return (
    <section data-testid="demo-scaffold" className="demo-section">
      <h2>Scaffold</h2>
      <Scaffold topAppBar={<TopAppBar title="App" size="small" />} fab={<FabAnchor><Fab aria-label="Add" icon="+" /></FabAnchor>}>
        <p style={{ padding: 16 }}>Scaffold content area</p>
      </Scaffold>
    </section>
  );
}

export function ButtonGroupExample() {
  return (
    <section data-testid="demo-button-group" className="demo-section">
      <h2>Button Group</h2>
      <ButtonGroup>
        <ButtonGroupItem>Save</ButtonGroupItem>
        <ButtonGroupItem>Share</ButtonGroupItem>
      </ButtonGroup>
    </section>
  );
}

export function SplitButtonExample() {
  return (
    <section data-testid="demo-split-button" className="demo-section">
      <h2>Split Button</h2>
      <SplitButton menuItems={<MenuItem>More</MenuItem>}>Send</SplitButton>
    </section>
  );
}

export function FabMenuExample() {
  return (
    <section data-testid="demo-fab-menu" className="demo-section">
      <h2>FAB Menu</h2>
      <FabMenu aria-label="Create" icon="+" actions={[{ label: 'Task', icon: '✓' }]} />
    </section>
  );
}

export function ToolbarExample() {
  return (
    <section data-testid="demo-toolbar" className="demo-section">
      <h2>Toolbar</h2>
      <Toolbar variant="floating">
        <ToolbarButton aria-label="Copy">C</ToolbarButton>
        <ToolbarButton aria-label="Paste">P</ToolbarButton>
      </Toolbar>
    </section>
  );
}

export function Phase4Example() {
  return (
    <section data-testid="demo-phase4" className="demo-section">
      <h2>Phase 4 — Expressive Signatures</h2>
      <div className="demo-row" style={{ gap: 16 }}>
        <ButtonGroupExample />
        <SplitButtonExample />
        <FabMenuExample />
      </div>
      <ToolbarExample />
    </section>
  );
}

export function DateInputExample() {
  return (
    <section data-testid="demo-date-input" className="demo-section">
      <h2>Date Input</h2>
      <DateInput label="Date" />
    </section>
  );
}

export function DatePickerExample() {
  return (
    <section data-testid="demo-date-picker" className="demo-section">
      <h2>Date Picker</h2>
      <DatePicker variant="docked" />
    </section>
  );
}

export function TimePickerExample() {
  return (
    <section data-testid="demo-time-picker" className="demo-section">
      <h2>Time Picker</h2>
      <TimePicker variant="dial" />
    </section>
  );
}

export function PaneScaffoldExample() {
  return (
    <section data-testid="demo-pane-scaffold" className="demo-section">
      <h2>Pane Scaffold</h2>
      <PaneScaffoldRoot defaultSizeClass="expanded" style={{ minHeight: 240 }}>
        <PaneScaffold
          list={<List><ListItem headline="Inbox item" /></List>}
          detail={<p style={{ padding: 16 }}>Detail pane</p>}
        />
      </PaneScaffoldRoot>
    </section>
  );
}

export function AdaptiveNavigationExample() {
  return (
    <section data-testid="demo-adaptive-nav" className="demo-section">
      <h2>Adaptive Navigation</h2>
      <AdaptiveNavigation
        destinations={[
          { value: 'home', label: 'Home', icon: '🏠' },
          { value: 'search', label: 'Search', icon: '🔍' },
          { value: 'settings', label: 'Settings', icon: '⚙️' },
        ]}
        mode="bar"
      />
    </section>
  );
}

export function Phase5Example() {
  return (
    <section data-testid="demo-phase5" className="demo-section">
      <h2>Phase 5 — Pickers &amp; Adaptive</h2>
      <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 200 }}>
        <div className="demo-row" style={{ gap: 16, alignItems: 'flex-start' }}>
          <DateInputExample />
          <DatePickerExample />
          <TimePickerExample />
        </div>
      </WindowSizeClassProvider>
      <PaneScaffoldExample />
      <AdaptiveNavigationExample />
    </section>
  );
}

export function PlaceholderButtonExample() {
  return (
    <section data-testid="demo-placeholder-button" className="demo-section">
      <h2>Placeholder Button</h2>
      <PlaceholderButton>Placeholder</PlaceholderButton>
    </section>
  );
}

/** Full component gallery migrated from the legacy Vite demo page. */
export function OverviewExample() {
  return (
    <div className="demo-grid" data-testid="demo-root">
      <h1>M3UI Component Gallery</h1>
      <Surface elevation="level1">
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <ButtonExample />
          <IconButtonExample />
          <FabExample />
          <FormControlsExample />
          <ContainmentExample />
          <CommunicationExample />
          <ChipExample />
          <SegmentedButtonExample />
          <SliderExample />
          <MenuSelectExample />
          <FeedbackExample />
          <SnackbarExample />
          <Phase3NavExample />
          <Phase3ContainmentExample />
          <ScaffoldExample />
          <Phase4Example />
          <Phase5Example />
        </div>
      </Surface>
    </div>
  );
}

export const EXAMPLE_COMPONENTS = {
  ButtonExample,
  IconButtonExample,
  FabExample,
  CheckboxExample,
  RadioExample,
  SwitchExample,
  TextFieldExample,
  CardExample,
  ListExample,
  DividerExample,
  BadgeExample,
  TooltipExample,
  ChipExample,
  SegmentedButtonExample,
  SliderExample,
  MenuExample,
  SelectExample,
  AutocompleteExample,
  ProgressExample,
  LoadingIndicatorExample,
  MeterExample,
  SnackbarExample,
  TopAppBarExample,
  BottomAppBarExample,
  NavigationRailExample,
  NavigationDrawerExample,
  NavigationBarExample,
  TabsExample,
  SearchExample,
  DialogExample,
  BottomSheetExample,
  SideSheetExample,
  CarouselExample,
  ScaffoldExample,
  ButtonGroupExample,
  SplitButtonExample,
  FabMenuExample,
  ToolbarExample,
  DateInputExample,
  DatePickerExample,
  TimePickerExample,
  PaneScaffoldExample,
  AdaptiveNavigationExample,
  PlaceholderButtonExample,
  OverviewExample,
} as const;

export type ExampleComponentName = keyof typeof EXAMPLE_COMPONENTS;
