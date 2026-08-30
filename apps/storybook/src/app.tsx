'use client';

import { useState } from 'react';
import {
  M3Provider,
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
  Icon,
} from '@m3ui/react';
import type { ContrastPreference } from '@m3ui/color';

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

function Phase2SnackbarDemo() {
  return (
    <Snackbar>
      <section data-testid="demo-snackbar">
        <h2>Snackbar</h2>
        <SnackbarTrigger />
      </section>
    </Snackbar>
  );
}

export function App() {
  const [seed, setSeed] = useState('#6750A4');
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [contrast, setContrast] = useState<ContrastPreference>(0);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  return (
    <M3Provider seed={seed} scheme={scheme} contrast={contrast} direction={direction}>
      <div className="demo-grid" data-testid="demo-root">
        <h1>M3UI Phase 1–3 Demo</h1>

        <div className="demo-controls">
          <label>
            Seed
            <input type="color" value={seed} onChange={(e) => setSeed(e.target.value)} data-testid="seed-input" />
          </label>
          <label>
            Scheme
            <select value={scheme} onChange={(e) => setScheme(e.target.value as 'light' | 'dark')} data-testid="scheme-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label>
            Contrast
            <select value={String(contrast)} onChange={(e) => setContrast(parseFloat(e.target.value) as ContrastPreference)} data-testid="contrast-select">
              <option value="-1">Reduced</option>
              <option value="0">Standard</option>
              <option value="0.5">Medium</option>
              <option value="1">High</option>
            </select>
          </label>
          <label>
            Direction
            <select value={direction} onChange={(e) => setDirection(e.target.value as 'ltr' | 'rtl')} data-testid="direction-select">
              <option value="ltr">LTR</option>
              <option value="rtl">RTL</option>
            </select>
          </label>
        </div>

        <Surface elevation="level1" data-testid="demo-surface">
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section data-testid="demo-buttons">
              <h2>Buttons</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(['filled', 'elevated', 'filled-tonal', 'outlined', 'text'] as const).map((v) => (
                  <Button key={v} variant={v} size="md">{v}</Button>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <Button key={s} size={s}>{s}</Button>
                ))}
              </div>
            </section>

            <section data-testid="demo-icon-buttons">
              <h2>Icon Buttons</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <IconButton aria-label="Star" icon="★" variant="standard" />
                <IconButton aria-label="Star filled" icon="★" variant="filled" />
                <IconButton aria-label="Star tonal" icon="★" variant="filled-tonal" />
                <IconButton aria-label="Star outlined" icon="★" variant="outlined" toggle selected />
              </div>
            </section>

            <section data-testid="demo-fab">
              <h2>FAB</h2>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Fab aria-label="Add" icon={<Icon name="add" />} size="standard" />
                <Fab aria-label="Add" icon={<Icon name="add" />} size="medium" />
                <ExtendedFab icon={<Icon name="edit" />} label="Compose" />
              </div>
            </section>

            <section data-testid="demo-form">
              <h2>Form Controls</h2>
              <CheckboxGroup defaultValue={['a']}>
                <Checkbox label="Checkbox A" value="a" />
                <Checkbox label="Checkbox B" value="b" />
              </CheckboxGroup>
              <div style={{ marginTop: 16 }}>
              <RadioGroup defaultValue="1" name="demo-radio">
                <Radio value="1" label="Radio 1" />
                <Radio value="2" label="Radio 2" />
              </RadioGroup>
              </div>
              <div style={{ marginTop: 16 }}>
                <Switch label="Switch" defaultChecked />
              </div>
              <div style={{ marginTop: 16, maxWidth: 320 }}>
                <TextField label="Email" variant="filled" supportingText="Your email" />
              </div>
            </section>

            <section data-testid="demo-containment">
              <h2>Containment</h2>
              <div style={{ display: 'flex', gap: 16 }}>
                <Card variant="elevated" style={{ padding: 16 }}>Card</Card>
                <div style={{ flex: 1 }}>
                <List>
                  <ListItem headline="List item" supportingText="Supporting" lines={2} divider />
                  <ListItem headline="Selected" selected />
                </List>
                </div>
              </div>
              <Divider style={{ margin: '16px 0' }} />
            </section>

            <section data-testid="demo-communication">
              <h2>Communication</h2>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Badge variant="dot" />
                <Badge count={5} />
                <Tooltip trigger={<Button variant="outlined">Tooltip</Button>} content="Help text" />
              </div>
            </section>

            <section data-testid="demo-chips">
              <h2>Chips</h2>
              <ChipSet>
                <Chip type="assist" label="Assist" />
                <Chip type="filter" label="Filter" defaultSelected />
                <Chip type="input" label="Input" onRemove={() => undefined} />
                <Chip type="suggestion" label="Suggestion" elevated />
              </ChipSet>
            </section>

            <section data-testid="demo-segmented">
              <h2>Segmented Button</h2>
              <SegmentedButton defaultValue={['day']}>
                <SegmentedButtonItem value="day" label="Day" />
                <SegmentedButtonItem value="week" label="Week" />
                <SegmentedButtonItem value="month" label="Month" />
              </SegmentedButton>
            </section>

            <section data-testid="demo-slider">
              <h2>Slider</h2>
              <div style={{ maxWidth: 320 }}>
                <Slider defaultValue={50} label="Volume" showValueIndicator />
              </div>
            </section>

            <section data-testid="demo-menu-select">
              <h2>Menu &amp; Select</h2>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Menu trigger={<Button variant="outlined">Menu</Button>}>
                  <MenuItem>Edit</MenuItem>
                  <MenuItem shortcut="⌘C">Copy</MenuItem>
                </Menu>
                <div style={{ minWidth: 200 }}>
                  <Select
                    label="Pick"
                    options={[
                      { value: 'a', label: 'Alpha' },
                      { value: 'b', label: 'Beta' },
                    ]}
                    defaultValue="a"
                  />
                </div>
                <div style={{ minWidth: 200 }}>
                  <Autocomplete
                    label="Search"
                    options={[
                      { value: 'react', label: 'React' },
                      { value: 'vue', label: 'Vue' },
                    ]}
                  />
                </div>
              </div>
            </section>

            <section data-testid="demo-feedback">
              <h2>Feedback</h2>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <LinearProgress value={60} />
                  <div style={{ marginTop: 12 }}>
                  <LinearProgress value={40} variant="wavy" />
                  </div>
                </div>
                <CircularProgress value={75} />
                <LoadingIndicator contained />
                <div style={{ flex: 1, minWidth: 160 }}>
                <Meter value={65} label="Storage" />
                </div>
              </div>
            </section>

            <Phase2SnackbarDemo />

            <section data-testid="demo-phase3-nav">
              <h2>Phase 3 — Navigation</h2>
              <TopAppBar title="Photos" subtitle="Album" size="medium-flexible" data-testid="demo-top-app-bar" trailing={<IconButton aria-label="Search" icon="🔍" />} />
              <div style={{ display: 'flex', gap: 16, marginTop: 16, minHeight: 200 }}>
                <NavigationRail
                  destinations={[
                    { value: 'home', label: 'Home', icon: '🏠' },
                    { value: 'browse', label: 'Browse', icon: '📂' },
                    { value: 'settings', label: 'Settings', icon: '⚙️' },
                  ]}
                  mode="collapsed"
                  data-testid="demo-nav-rail-compact"
                />
                <NavigationDrawer
                  variant="standard"
                  sections={[{ items: [{ value: 'inbox', label: 'Inbox', icon: '📥' }] }]}
                  data-testid="demo-nav-drawer"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <NavigationBar
                  destinations={[
                    { value: 'home', label: 'Home', icon: '🏠' },
                    { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
                    { value: 'settings', label: 'Settings', icon: '⚙️' },
                  ]}
                  data-testid="demo-nav-bar-compact"
                />
              </div>
            </section>

            <section data-testid="demo-phase3-containment">
              <h2>Phase 3 — Containment</h2>
              <Tabs
                items={[
                  { value: 'a', label: 'Tab A', panel: 'Panel A' },
                  { value: 'b', label: 'Tab B', panel: 'Panel B' },
                ]}
                data-testid="demo-tabs"
              />
              <div style={{ marginTop: 16, maxWidth: 400 }}>
                <SearchBar placeholder="Search" data-testid="demo-search-bar" />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                <Dialog trigger={<Button variant="outlined">Dialog</Button>} headline="Dialog" body="Body" />
                <BottomSheet trigger={<Button variant="filled-tonal">Bottom sheet</Button>}>Sheet body</BottomSheet>
                <SideSheet trigger={<Button variant="text">Side sheet</Button>} headline="Filters">Content</SideSheet>
              </div>
              <div style={{ marginTop: 16 }}>
                <Carousel
                  items={[
                    { key: '1', content: <Card variant="elevated" style={{ padding: 24 }}>One</Card> },
                    { key: '2', content: <Card variant="elevated" style={{ padding: 24 }}>Two</Card> },
                  ]}
                  layout="multi-browse"
                  data-testid="demo-carousel-compact"
                />
              </div>
            </section>

            <section data-testid="demo-scaffold">
              <h2>Scaffold</h2>
              <Scaffold topAppBar={<TopAppBar title="App" size="small" />} fab={<FabAnchor><Fab aria-label="Add" icon={<Icon name="add" />} /></FabAnchor>}>
                <p style={{ padding: 16 }}>Scaffold content area</p>
              </Scaffold>
            </section>

            <section data-testid="demo-phase4">
              <h2>Phase 4 — Expressive Signatures</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <ButtonGroup data-testid="demo-button-group">
                  <ButtonGroupItem>Save</ButtonGroupItem>
                  <ButtonGroupItem>Share</ButtonGroupItem>
                </ButtonGroup>
                <SplitButton menuItems={<MenuItem>More</MenuItem>}>Send</SplitButton>
                <FabMenu aria-label="Create" icon={<Icon name="add" />} actions={[{ label: 'Task', icon: <Icon name="check" /> }]} />
              </div>
              <div style={{ marginTop: 16 }}>
                <Toolbar variant="floating" data-testid="demo-toolbar">
                  <ToolbarButton aria-label="Copy">C</ToolbarButton>
                  <ToolbarButton aria-label="Paste">P</ToolbarButton>
                </Toolbar>
              </div>
            </section>

            <section data-testid="demo-phase5">
              <h2>Phase 5 — Pickers &amp; Adaptive</h2>
              <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 200 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
                  <DateInput label="Date" data-testid="demo-date-input" />
                  <DatePicker variant="docked" data-testid="demo-date-picker" />
                  <TimePicker variant="dial" data-testid="demo-time-picker" />
                </div>
              </WindowSizeClassProvider>
              <div style={{ marginTop: 16 }}>
                <PaneScaffoldRoot defaultSizeClass="expanded" style={{ minHeight: 240 }}>
                  <PaneScaffold
                    list={<List><ListItem headline="Inbox item" /></List>}
                    detail={<p style={{ padding: 16 }}>Detail pane</p>}
                    data-testid="demo-pane-scaffold"
                  />
                </PaneScaffoldRoot>
              </div>
              <div style={{ marginTop: 16 }}>
                <AdaptiveNavigation
                  destinations={[
                    { value: 'home', label: 'Home', icon: '🏠' },
                    { value: 'search', label: 'Search', icon: '🔍' },
                    { value: 'settings', label: 'Settings', icon: '⚙️' },
                  ]}
                  mode="bar"
                  data-testid="demo-adaptive-nav"
                />
              </div>
            </section>
          </div>
        </Surface>
      </div>
    </M3Provider>
  );
}
