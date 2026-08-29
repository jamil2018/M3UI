import type { ComponentDocContent } from './types';

export const COMPONENT_DOCS: Record<string, ComponentDocContent> = {
  button: {
    slug: 'button',
    title: 'Button',
    overview:
      'Buttons let users take actions and make choices with a single tap. M3UI buttons support all five Material 3 Expressive variants with press shape morph and token-driven styling.',
    imports: ['Button'],
    usageCode: `import { Button } from '@m3ui/react';

<Button variant="filled" onClick={() => save()}>
  Save changes
</Button>`,
    variants: [
      { title: 'Variants', description: 'filled, elevated, filled-tonal, outlined, and text.' },
      { title: 'Sizes', description: 'xs, sm, md (default), lg, and xl for dense or prominent layouts.' },
      { title: 'States', description: 'disabled, loading with aria-busy, and full-width stretch.' },
    ],
    accessibility: [
      'Renders a native button element with visible focus ring.',
      'Activate with Enter or Space; disabled buttons are removed from the tab order.',
      'Loading state exposes aria-busy so assistive tech knows the action is in progress.',
    ],
    related: ['icon-button', 'button-group', 'split-button', 'fab'],
  },
  'icon-button': {
    slug: 'icon-button',
    title: 'Icon Button',
    overview:
      'Icon buttons trigger compact icon-only actions. Toggle mode supports selected state for tools like favorites or bookmarks.',
    imports: ['IconButton'],
    usageCode: `import { IconButton } from '@m3ui/react';

<IconButton aria-label="Add to favorites" icon="★" variant="standard" />`,
    variants: [
      { title: 'Variants', description: 'standard, filled, filled-tonal, and outlined.' },
      { title: 'Toggle', description: 'Set toggle with selected for on/off icon actions.' },
      { title: 'Sizes', description: 'xs through xl matching button scale.' },
    ],
    accessibility: [
      'Requires aria-label (or aria-labelledby) because there is no visible text.',
      'Toggle buttons communicate pressed state to assistive technology.',
      'Focus indicator meets contrast requirements in all schemes.',
    ],
    related: ['button', 'toolbar', 'top-app-bar'],
  },
  fab: {
    slug: 'fab',
    title: 'FAB',
    overview:
      'Floating action buttons represent the primary action on a screen. Use standard FABs for icon-only actions or ExtendedFab when a text label improves clarity.',
    imports: ['Fab', 'ExtendedFab', 'FabAnchor'],
    usageCode: `import { Fab, ExtendedFab } from '@m3ui/react';

<Fab aria-label="Compose" icon="+" size="medium" />
<ExtendedFab icon="+" label="Compose" />`,
    variants: [
      { title: 'Sizes', description: 'small, medium, and large FAB diameters.' },
      { title: 'Extended', description: 'ExtendedFab adds a visible label beside the icon.' },
      { title: 'Placement', description: 'Pair with FabAnchor inside Scaffold for correct inset positioning.' },
    ],
    accessibility: [
      'FAB requires aria-label when using the icon-only variant.',
      'ExtendedFab exposes the label as visible text for screen readers.',
      'Should not compete with more than one primary action per view.',
    ],
    related: ['fab-menu', 'scaffold', 'bottom-app-bar'],
  },
  checkbox: {
    slug: 'checkbox',
    title: 'Checkbox',
    overview:
      'Checkboxes let users select one or more options from a set. CheckboxGroup manages multi-select value state and keyboard roving focus.',
    imports: ['Checkbox', 'CheckboxGroup'],
    usageCode: `import { Checkbox, CheckboxGroup } from '@m3ui/react';

<CheckboxGroup defaultValue={['email']}>
  <Checkbox label="Email" value="email" />
  <Checkbox label="SMS" value="sms" />
</CheckboxGroup>`,
    variants: [
      { title: 'States', description: 'checked, unchecked, and indeterminate for partial selections.' },
      { title: 'Group', description: 'CheckboxGroup supports controlled and uncontrolled multi-select.' },
      { title: 'Error', description: 'Individual checkboxes can show error styling and supporting text.' },
    ],
    accessibility: [
      'Uses native checkbox semantics via Base UI with proper aria-checked including mixed.',
      'Labels are associated with inputs; group roving tabindex supports arrow-key navigation.',
      'Indeterminate state is announced correctly to screen readers.',
    ],
    related: ['radio', 'switch', 'segmented-button'],
  },
  radio: {
    slug: 'radio',
    title: 'Radio',
    overview:
      'Radio buttons let users select exactly one option from a mutually exclusive set. RadioGroup enforces single selection.',
    imports: ['Radio', 'RadioGroup'],
    usageCode: `import { Radio, RadioGroup } from '@m3ui/react';

<RadioGroup name="plan" defaultValue="pro">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
</RadioGroup>`,
    variants: [
      { title: 'Group', description: 'RadioGroup wraps options with shared name and value state.' },
      { title: 'States', description: 'disabled individual options and error styling.' },
      { title: 'Layout', description: 'Stack vertically or inline depending on option count.' },
    ],
    accessibility: [
      'Arrow keys move selection within the group per WAI-ARIA radio pattern.',
      'Each radio has an associated label; only the selected item is in the tab order by default.',
      'Group name ties options together for form submission.',
    ],
    related: ['checkbox', 'segmented-button', 'select'],
  },
  switch: {
    slug: 'switch',
    title: 'Switch',
    overview:
      'Switches toggle a single setting on or off immediately, without a separate submit action. Optional icon slots reinforce on/off meaning.',
    imports: ['Switch'],
    usageCode: `import { Switch } from '@m3ui/react';

<Switch label="Dark mode" defaultChecked />`,
    variants: [
      { title: 'States', description: 'on, off, and disabled.' },
      { title: 'Icons', description: 'Optional on/off icon slots for expressive affordance.' },
      { title: 'Controlled', description: 'Use checked and onCheckedChange for controlled state.' },
    ],
    accessibility: [
      'Exposes role="switch" with aria-checked reflecting on/off state.',
      'Label click toggles the switch; keyboard Space toggles when focused.',
      'Prefer switches only for settings that take effect immediately.',
    ],
    related: ['checkbox', 'radio'],
  },
  'text-field': {
    slug: 'text-field',
    title: 'Text Field',
    overview:
      'Text fields collect single-line user input with floating labels, supporting text, and error states. Filled and outlined variants match M3 spec.',
    imports: ['TextField'],
    usageCode: `import { TextField } from '@m3ui/react';

<TextField
  label="Email"
  variant="filled"
  type="email"
  supportingText="We'll never share your email"
/>`,
    variants: [
      { title: 'Variants', description: 'filled (default) and outlined.' },
      { title: 'Types', description: 'text, email, password, number, and search input types.' },
      { title: 'States', description: 'error with error text, disabled, and read-only.' },
    ],
    accessibility: [
      'Label, input, supporting text, and error message are programmatically linked.',
      'Error state sets aria-invalid and exposes the error message via aria-describedby.',
      'Floating label animation respects prefers-reduced-motion.',
    ],
    related: ['select', 'autocomplete', 'search', 'date-input'],
  },
  card: {
    slug: 'card',
    title: 'Card',
    overview:
      'Cards group related content and actions in a contained surface. Elevated, filled, and outlined variants communicate hierarchy.',
    imports: ['Card'],
    usageCode: `import { Card } from '@m3ui/react';

<Card variant="elevated" style={{ padding: 16 }}>
  <h3>Title</h3>
  <p>Supporting content</p>
</Card>`,
    variants: [
      { title: 'Variants', description: 'elevated, filled, and outlined.' },
      { title: 'Composition', description: 'Nest media, text, and actions; cards are unstyled containers.' },
      { title: 'Interactive', description: 'Wrap with a link or button for clickable cards (add focus styles).' },
    ],
    accessibility: [
      'Use heading elements inside cards for document structure.',
      'If the entire card is clickable, use a single focusable element with descriptive label.',
      'Maintain sufficient contrast between card surface and page background.',
    ],
    related: ['list', 'divider', 'carousel'],
  },
  list: {
    slug: 'list',
    title: 'List',
    overview:
      'Lists present continuous vertical indexes of text or images. ListItem supports one-, two-, and three-line layouts with leading/trailing slots.',
    imports: ['List', 'ListItem'],
    usageCode: `import { List, ListItem } from '@m3ui/react';

<List>
  <ListItem headline="Inbox" supportingText="12 new messages" lines={2} />
  <ListItem headline="Drafts" selected />
</List>`,
    variants: [
      { title: 'Lines', description: '1-line headline, 2-line with supporting text, 3-line with overline.' },
      { title: 'States', description: 'selected, disabled, and divider between items.' },
      { title: 'Slots', description: 'leading icon/avatar, trailing icon/meta, and custom children.' },
    ],
    accessibility: [
      'Use list role semantics; interactive items should be buttons or links.',
      'Selected state is communicated to assistive technology.',
      'Dividers between items are decorative unless labeled.',
    ],
    related: ['divider', 'card', 'navigation-drawer'],
  },
  divider: {
    slug: 'divider',
    title: 'Divider',
    overview:
      'Dividers separate content into clear groups. Full-width, inset, and vertical orientations match Material layout guidance.',
    imports: ['Divider'],
    usageCode: `import { Divider } from '@m3ui/react';

<Divider />
<Divider variant="inset" />
<Divider orientation="vertical" />`,
    variants: [
      { title: 'Variants', description: 'full-width (default) and inset with leading margin.' },
      { title: 'Orientation', description: 'horizontal and vertical.' },
      { title: 'Thickness', description: 'Hairline token stroke using outline-variant color.' },
    ],
    accessibility: [
      'Decorative dividers use role="separator" with aria-hidden when purely visual.',
      'Do not rely on color alone—divider contrast meets token requirements.',
      'Vertical dividers in toolbars should not trap keyboard focus.',
    ],
    related: ['list', 'toolbar'],
  },
  badge: {
    slug: 'badge',
    title: 'Badge',
    overview:
      'Badges highlight unread counts or status on navigation items and icons. Dot badges indicate presence; numbered badges show quantities.',
    imports: ['Badge'],
    usageCode: `import { Badge } from '@m3ui/react';

<Badge count={5}>
  <IconButton aria-label="Notifications" icon="🔔" />
</Badge>`,
    variants: [
      { title: 'Dot', description: 'Small indicator without a numeric label.' },
      { title: 'Count', description: 'Numeric badge with overflow cap (e.g. 99+).' },
      { title: 'Placement', description: 'Anchors to children via relative positioning.' },
    ],
    accessibility: [
      'Supplement icon-only targets with aria-label that includes the count when meaningful.',
      'Avoid relying on badge color alone to convey critical information.',
      'Hide decorative dot badges from assistive tech when redundant with label text.',
    ],
    related: ['navigation-bar', 'icon-button'],
  },
  tooltip: {
    slug: 'tooltip',
    title: 'Tooltip',
    overview:
      'Tooltips display brief contextual help on hover or focus. RichTooltip supports titles and longer descriptive content.',
    imports: ['Tooltip', 'RichTooltip'],
    usageCode: `import { Tooltip, Button } from '@m3ui/react';

<Tooltip trigger={<Button variant="outlined">Save</Button>} content="Save draft" />`,
    variants: [
      { title: 'Plain', description: 'Single-line tooltip for icon labels and truncated text.' },
      { title: 'Rich', description: 'RichTooltip with title and body for more context.' },
      { title: 'Placement', description: 'Auto-flipping placement via Floating UI.' },
    ],
    accessibility: [
      'Tooltip content is available on keyboard focus, not hover-only.',
      'Do not put essential information only in tooltips—use visible labels.',
      'Trigger must be a focusable element; tooltip id is linked via aria-describedby.',
    ],
    related: ['icon-button', 'button'],
  },
  chip: {
    slug: 'chip',
    title: 'Chip',
    overview:
      'Chips represent small blocks of information or actions. Assist, filter, input, and suggestion types cover common M3 patterns.',
    imports: ['Chip', 'ChipSet'],
    usageCode: `import { Chip, ChipSet } from '@m3ui/react';

<ChipSet>
  <Chip type="filter" label="Photos" defaultSelected />
  <Chip type="input" label="Tag" onRemove={() => removeTag()} />
</ChipSet>`,
    variants: [
      { title: 'Types', description: 'assist, filter, input, and suggestion.' },
      { title: 'Filter', description: 'Selectable chips for multi-filter UIs.' },
      { title: 'Input', description: 'Removable tags with onRemove callback.' },
    ],
    accessibility: [
      'Filter chips use aria-pressed; input chips expose remove button with accessible name.',
      'ChipSet manages focus order for keyboard navigation between chips.',
      'Selected filter state must be announced when toggled.',
    ],
    related: ['segmented-button', 'autocomplete'],
  },
  'segmented-button': {
    slug: 'segmented-button',
    title: 'Segmented Button',
    overview:
      'Segmented buttons help users select options, switch views, or sort elements. Supports single- or multi-select segments.',
    imports: ['SegmentedButton', 'SegmentedButtonItem'],
    usageCode: `import { SegmentedButton, SegmentedButtonItem } from '@m3ui/react';

<SegmentedButton defaultValue={['day']}>
  <SegmentedButtonItem value="day" label="Day" />
  <SegmentedButtonItem value="week" label="Week" />
</SegmentedButton>`,
    variants: [
      { title: 'Selection', description: 'Single-select (default) or multi-select mode.' },
      { title: 'Icons', description: 'Optional leading icons per segment.' },
      { title: 'Sizes', description: 'Matches button height scale.' },
    ],
    accessibility: [
      'Implements toolbar or toggle button pattern depending on selection mode.',
      'Arrow keys move between segments; selection is announced on change.',
      'Each segment has an accessible name via label prop.',
    ],
    related: ['tabs', 'radio', 'chip'],
  },
  slider: {
    slug: 'slider',
    title: 'Slider',
    overview:
      'Sliders let users select a value from a continuous or discrete range. Supports centered, range, and vertical orientations.',
    imports: ['Slider'],
    usageCode: `import { Slider } from '@m3ui/react';

<Slider defaultValue={50} label="Volume" showValueIndicator min={0} max={100} />`,
    variants: [
      { title: 'Modes', description: 'continuous, discrete with step, centered, and range (two thumbs).' },
      { title: 'Orientation', description: 'horizontal (default) and vertical.' },
      { title: 'Value indicator', description: 'Optional floating value label on drag.' },
    ],
    accessibility: [
      'Thumb is keyboard operable with arrow keys; Home/End jump to min/max.',
      'aria-valuemin, aria-valuemax, and aria-valuenow reflect current value.',
      'Associated label is linked for screen reader context.',
    ],
    related: ['switch', 'meter', 'progress'],
  },
  menu: {
    slug: 'menu',
    title: 'Menu',
    overview:
      'Menus display a list of choices on a temporary surface. Supports dropdown triggers, context menus, and menubar patterns.',
    imports: ['Menu', 'MenuItem'],
    usageCode: `import { Menu, MenuItem, Button } from '@m3ui/react';

<Menu trigger={<Button variant="outlined">Options</Button>}>
  <MenuItem>Edit</MenuItem>
  <MenuItem shortcut="⌘C">Copy</MenuItem>
</Menu>`,
    variants: [
      { title: 'Trigger', description: 'Button or custom element opens the menu popup.' },
      { title: 'Shortcuts', description: 'MenuItem shortcut text for keyboard hints.' },
      { title: 'Submenus', description: 'Nested menus for hierarchical actions.' },
    ],
    accessibility: [
      'Typeahead search and arrow-key navigation follow WAI-ARIA menu pattern.',
      'Escape closes the menu and returns focus to the trigger.',
      'Disabled items are skipped and not activatable.',
    ],
    related: ['select', 'split-button', 'fab-menu'],
  },
  select: {
    slug: 'select',
    title: 'Select',
    overview:
      'Select presents a dropdown of options styled as an M3 text field. Ideal when all choices are known upfront.',
    imports: ['Select'],
    usageCode: `import { Select } from '@m3ui/react';

<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
  ]}
  defaultValue="us"
/>`,
    variants: [
      { title: 'Variants', description: 'filled and outlined field appearance.' },
      { title: 'States', description: 'error, disabled, and required.' },
      { title: 'Options', description: 'Flat options array with value/label pairs.' },
    ],
    accessibility: [
      'Combobox/listbox roles with aria-expanded on the trigger.',
      'Selected option is reflected in aria-activedescendant while open.',
      'Label and error messages are associated with the control.',
    ],
    related: ['autocomplete', 'text-field', 'menu'],
  },
  autocomplete: {
    slug: 'autocomplete',
    title: 'Autocomplete',
    overview:
      'Autocomplete combines a text field with filtered suggestions. Use when users may type freely or pick from a large option set.',
    imports: ['Autocomplete'],
    usageCode: `import { Autocomplete } from '@m3ui/react';

<Autocomplete
  label="Framework"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ]}
/>`,
    variants: [
      { title: 'Filtering', description: 'Options filter as the user types.' },
      { title: 'Free solo', description: 'Allow values not in the options list when configured.' },
      { title: 'States', description: 'loading, error, and disabled.' },
    ],
    accessibility: [
      'Follows combobox pattern with live suggestion count when appropriate.',
      'Arrow keys navigate suggestions; Enter confirms selection.',
      'Announce loading and empty states to screen readers.',
    ],
    related: ['select', 'text-field', 'search'],
  },
  progress: {
    slug: 'progress',
    title: 'Progress',
    overview:
      'Progress indicators show the status of an ongoing process. Linear and circular forms include Expressive wavy variants.',
    imports: ['LinearProgress', 'CircularProgress'],
    usageCode: `import { LinearProgress, CircularProgress } from '@m3ui/react';

<LinearProgress value={60} />
<CircularProgress value={75} variant="wavy" />`,
    variants: [
      { title: 'Linear', description: 'Horizontal bar for determinate and indeterminate progress.' },
      { title: 'Circular', description: 'Radial indicator for compact spaces.' },
      { title: 'Wavy', description: 'Expressive wavy path animation variant.' },
    ],
    accessibility: [
      'Determinate progress exposes aria-valuenow as a percentage.',
      'Indeterminate progress uses aria-busy without a specific value.',
      'Pair with visible text describing what is loading when possible.',
    ],
    related: ['loading-indicator', 'meter'],
  },
  'loading-indicator': {
    slug: 'loading-indicator',
    title: 'Loading Indicator',
    overview:
      'The Expressive loading indicator cycles through Material shape morphs. Use for full-page or contained loading states.',
    imports: ['LoadingIndicator'],
    usageCode: `import { LoadingIndicator } from '@m3ui/react';

<LoadingIndicator contained />`,
    variants: [
      { title: 'Contained', description: 'Fits within a parent bounds (e.g. card or dialog).' },
      { title: 'Full screen', description: 'Covers the viewport for route-level loading.' },
      { title: 'Reduced motion', description: 'Respects prefers-reduced-motion with simplified animation.' },
    ],
    accessibility: [
      'Exposes aria-busy and an accessible name describing the wait state.',
      'Animation pauses or simplifies when reduced motion is preferred.',
      'Do not use as the only feedback for operations over 10 seconds without progress text.',
    ],
    related: ['progress', 'dialog'],
  },
  snackbar: {
    slug: 'snackbar',
    title: 'Snackbar',
    overview:
      'Snackbars provide brief feedback about an operation, often with an optional action. The provider queues multiple messages.',
    imports: ['Snackbar', 'useSnackbar'],
    usageCode: `import { Snackbar, useSnackbar, Button } from '@m3ui/react';

function App() {
  const { show } = useSnackbar();
  return (
    <Button onClick={() => show({ message: 'Saved', action: { label: 'Undo', onClick: undo } })}>
      Save
    </Button>
  );
}

export default () => (
  <Snackbar><App /></Snackbar>
);`,
    variants: [
      { title: 'Action', description: 'Optional text action (e.g. Undo) beside the message.' },
      { title: 'Queue', description: 'Multiple snackbars queue and dismiss in order.' },
      { title: 'Position', description: 'Bottom-centered with safe-area inset awareness.' },
    ],
    accessibility: [
      'Uses role="status" or live region so messages are announced without stealing focus.',
      'Action button is focusable when the snackbar is visible.',
      'Auto-dismiss timing should allow enough time to read and act.',
    ],
    related: ['dialog', 'button'],
  },
  meter: {
    slug: 'meter',
    title: 'Meter',
    overview:
      'Meters display a scalar measurement within a known range, such as storage used or signal strength.',
    imports: ['Meter'],
    usageCode: `import { Meter } from '@m3ui/react';

<Meter value={65} label="Storage" min={0} max={100} />`,
    variants: [
      { title: 'Range', description: 'min and max define the scale endpoints.' },
      { title: 'Label', description: 'Visible label and optional value readout.' },
      { title: 'Colors', description: 'Token-driven track and indicator fills.' },
    ],
    accessibility: [
      'Uses native meter semantics with aria-valuemin, aria-valuemax, aria-valuenow.',
      'Label is programmatically associated with the meter element.',
      'Do not use for indeterminate loading—use Progress instead.',
    ],
    related: ['progress', 'slider'],
  },
  'top-app-bar': {
    slug: 'top-app-bar',
    title: 'Top App Bar',
    overview:
      'Top app bars display navigation, title, and actions at the top of the screen. Supports small, medium, large, and flexible Expressive sizes.',
    imports: ['TopAppBar'],
    usageCode: `import { TopAppBar, IconButton } from '@m3ui/react';

<TopAppBar
  title="Photos"
  subtitle="Album"
  trailing={<IconButton aria-label="Search" icon="🔍" />}
/>`,
    variants: [
      { title: 'Sizes', description: 'small, medium, large, and medium-flexible with scroll behavior.' },
      { title: 'Slots', description: 'leading navigation icon, title, subtitle, and trailing actions.' },
      { title: 'Scroll', description: 'Flexible variants collapse on scroll.' },
    ],
    accessibility: [
      'Title uses heading semantics appropriate to page structure.',
      'All icon actions require aria-label.',
      'Scroll collapse animation respects reduced motion.',
    ],
    related: ['scaffold', 'navigation-bar', 'bottom-app-bar'],
  },
  'bottom-app-bar': {
    slug: 'bottom-app-bar',
    title: 'Bottom App Bar',
    overview:
      'Bottom app bars anchor primary actions and navigation at the bottom, optionally with a attached FAB cutout.',
    imports: ['BottomAppBar'],
    usageCode: `import { BottomAppBar, Fab } from '@m3ui/react';

<BottomAppBar
  fab={<Fab aria-label="Create" icon="+" />}
  actions={[
    { icon: '☰', label: 'Menu', onClick: openMenu },
  ]}
/>`,
    variants: [
      { title: 'FAB attachment', description: 'Docked FAB slot with shape cutout.' },
      { title: 'Actions', description: 'Up to three icon actions plus FAB.' },
      { title: 'Hide on scroll', description: 'Optional scroll-away behavior.' },
    ],
    accessibility: [
      'Each action exposes an accessible name.',
      'FAB cutout does not trap focus; tab order follows visual layout.',
      'Pair with safe-area padding for notched devices.',
    ],
    related: ['fab', 'navigation-bar', 'scaffold'],
  },
  'navigation-bar': {
    slug: 'navigation-bar',
    title: 'Navigation Bar',
    overview:
      'Navigation bars let users switch between primary destinations at the bottom of compact layouts.',
    imports: ['NavigationBar'],
    usageCode: `import { NavigationBar } from '@m3ui/react';

<NavigationBar
  destinations={[
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  ]}
/>`,
    variants: [
      { title: 'Destinations', description: 'Three to five primary routes with icons and labels.' },
      { title: 'Badges', description: 'Per-destination notification counts.' },
      { title: 'Active indicator', description: 'Expressive pill morph on the selected destination.' },
    ],
    accessibility: [
      'Uses tablist/tab pattern or navigation landmark with current page indicated.',
      'Selected destination has aria-current or equivalent.',
      'Badge counts should be included in the destination accessible name when nonzero.',
    ],
    related: ['navigation-rail', 'adaptive-navigation', 'badge'],
  },
  'navigation-rail': {
    slug: 'navigation-rail',
    title: 'Navigation Rail',
    overview:
      'Navigation rails provide start-aligned vertical navigation for medium and expanded window sizes.',
    imports: ['NavigationRail'],
    usageCode: `import { NavigationRail } from '@m3ui/react';

<NavigationRail
  destinations={[
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'browse', label: 'Browse', icon: '📂' },
  ]}
  mode="collapsed"
/>`,
    variants: [
      { title: 'Modes', description: 'collapsed (icons), expanded (icons + labels), and modal.' },
      { title: 'FAB slot', description: 'Optional FAB anchored in the rail.' },
      { title: 'Badges', description: 'Notification indicators on destinations.' },
    ],
    accessibility: [
      'Expanded mode shows visible labels; collapsed relies on aria-label per destination.',
      'Modal mode traps focus until dismissed.',
      'Keyboard navigation between destinations with arrow keys.',
    ],
    related: ['navigation-drawer', 'adaptive-navigation', 'pane-scaffold'],
  },
  'navigation-drawer': {
    slug: 'navigation-drawer',
    title: 'Navigation Drawer',
    overview:
      'Navigation drawers provide access to destinations and app sections from the screen edge.',
    imports: ['NavigationDrawer'],
    usageCode: `import { NavigationDrawer } from '@m3ui/react';

<NavigationDrawer
  variant="standard"
  sections={[
    { items: [{ value: 'inbox', label: 'Inbox', icon: '📥' }] },
  ]}
/>`,
    variants: [
      { title: 'Variants', description: 'standard (persistent) and modal (overlay).' },
      { title: 'Sections', description: 'Grouped items with optional section headers.' },
      { title: 'Width', description: 'Standard and expanded drawer widths.' },
    ],
    accessibility: [
      'Modal drawer traps focus and closes on Escape.',
      'Current destination is indicated with aria-current.',
      'Section headers use heading semantics when structuring long lists.',
    ],
    related: ['navigation-rail', 'list', 'adaptive-navigation'],
  },
  tabs: {
    slug: 'tabs',
    title: 'Tabs',
    overview:
      'Tabs organize content into sections within the same context. Primary and secondary tab styles are supported.',
    imports: ['Tabs'],
    usageCode: `import { Tabs } from '@m3ui/react';

<Tabs
  items={[
    { value: 'photos', label: 'Photos', panel: <Gallery /> },
    { value: 'albums', label: 'Albums', panel: <AlbumList /> },
  ]}
/>`,
    variants: [
      { title: 'Primary / secondary', description: 'Visual emphasis levels for nested tab hierarchies.' },
      { title: 'Scrollable', description: 'Horizontal scroll when tabs overflow.' },
      { title: 'Icons', description: 'Optional leading icons per tab.' },
    ],
    accessibility: [
      'Implements tablist/tab/tabpanel roles with roving tabindex.',
      'Arrow keys switch tabs; panels are linked via aria-labelledby.',
      'Do not use tabs for primary app navigation—use navigation components.',
    ],
    related: ['segmented-button', 'navigation-bar'],
  },
  search: {
    slug: 'search',
    title: 'Search',
    overview:
      'Search components collect queries with M3 search bar styling. Supports expanded full-screen search views.',
    imports: ['SearchBar'],
    usageCode: `import { SearchBar } from '@m3ui/react';

<SearchBar placeholder="Search photos" onSubmit={(q) => search(q)} />`,
    variants: [
      { title: 'Search bar', description: 'Docked bar with leading search icon and clear action.' },
      { title: 'Full screen', description: 'Expanded search view for dedicated search flows.' },
      { title: 'States', description: 'focused, filled, and disabled.' },
    ],
    accessibility: [
      'Search input has an accessible name via label or aria-label.',
      'Clear button is labeled and does not submit the form.',
      'Results region should use live region when suggestions update.',
    ],
    related: ['text-field', 'autocomplete', 'top-app-bar'],
  },
  dialog: {
    slug: 'dialog',
    title: 'Dialog',
    overview:
      'Dialogs interrupt the user with urgent information or required decisions. Supports alert and full-screen variants.',
    imports: ['Dialog'],
    usageCode: `import { Dialog, Button } from '@m3ui/react';

<Dialog
  trigger={<Button variant="outlined">Delete</Button>}
  headline="Delete photo?"
  body="This action cannot be undone."
  confirmLabel="Delete"
/>`,
    variants: [
      { title: 'Standard', description: 'Modal dialog with headline, body, and actions.' },
      { title: 'Alert', description: 'Simplified confirmation without dismiss scrim tap.' },
      { title: 'Full screen', description: 'Edge-to-edge dialog on compact widths.' },
    ],
    accessibility: [
      'Focus is trapped inside the open dialog; Escape closes when allowed.',
      'aria-modal="true" and labelledby/describedby link headline and body.',
      'Return focus to the trigger on close.',
    ],
    related: ['bottom-sheet', 'side-sheet', 'snackbar'],
  },
  'bottom-sheet': {
    slug: 'bottom-sheet',
    title: 'Bottom Sheet',
    overview:
      'Bottom sheets slide up from the bottom for supplementary content or short tasks without leaving context.',
    imports: ['BottomSheet'],
    usageCode: `import { BottomSheet, Button } from '@m3ui/react';

<BottomSheet trigger={<Button variant="filled-tonal">Share</Button>}>
  <ShareOptions />
</BottomSheet>`,
    variants: [
      { title: 'Snap points', description: 'Partial and full-height snap positions.' },
      { title: 'Drag handle', description: 'Expressive handle for swipe-to-dismiss.' },
      { title: 'Modal', description: 'Scrim blocks interaction with content behind.' },
    ],
    accessibility: [
      'Drag gestures have keyboard equivalent to dismiss when possible.',
      'Focus management matches dialog pattern when modal.',
      'Snap point changes should not disorient screen reader users—maintain context.',
    ],
    related: ['side-sheet', 'dialog'],
  },
  'side-sheet': {
    slug: 'side-sheet',
    title: 'Side Sheet',
    overview:
      'Side sheets present secondary content or filters from the trailing edge without blocking the entire screen.',
    imports: ['SideSheet'],
    usageCode: `import { SideSheet, Button } from '@m3ui/react';

<SideSheet trigger={<Button variant="text">Filters</Button>} headline="Filters">
  <FilterForm />
</SideSheet>`,
    variants: [
      { title: 'Header', description: 'Headline with close and optional action row.' },
      { title: 'Modal', description: 'Standard modal side sheet with scrim.' },
      { title: 'Width', description: 'Token-based sheet width for expanded layouts.' },
    ],
    accessibility: [
      'Close control is always keyboard reachable.',
      'Focus trap when modal; Escape dismisses.',
      'Headline provides accessible name for the sheet.',
    ],
    related: ['bottom-sheet', 'navigation-drawer', 'dialog'],
  },
  carousel: {
    slug: 'carousel',
    title: 'Carousel',
    overview:
      'Carousels display a horizontal set of items with scroll-linked Expressive resize effects.',
    imports: ['Carousel'],
    usageCode: `import { Carousel, Card } from '@m3ui/react';

<Carousel
  items={[
    { key: '1', content: <Card>One</Card> },
    { key: '2', content: <Card>Two</Card> },
  ]}
  layout="multi-browse"
/>`,
    variants: [
      { title: 'Layouts', description: 'multi-browse, hero, and uncontained layouts.' },
      { title: 'Scroll', description: 'Snap scrolling with visible adjacent items.' },
      { title: 'Controls', description: 'Optional prev/next controls for keyboard users.' },
    ],
    accessibility: [
      'Provide visible focus order for interactive items inside slides.',
      'Do not auto-advance without user control and pause mechanism.',
      'Announce slide changes via aria-live when using programmatic navigation.',
    ],
    related: ['card', 'tabs'],
  },
  scaffold: {
    slug: 'scaffold',
    title: 'Scaffold',
    overview:
      'Scaffold composes app chrome—top app bar, bottom bars, FAB, and navigation—while exposing CSS inset variables for content.',
    imports: ['Scaffold', 'FabAnchor'],
    usageCode: `import { Scaffold, TopAppBar, Fab, FabAnchor } from '@m3ui/react';

<Scaffold
  topAppBar={<TopAppBar title="Inbox" />}
  fab={<FabAnchor><Fab aria-label="Compose" icon="+" /></FabAnchor>}
>
  <main>{children}</main>
</Scaffold>`,
    variants: [
      { title: 'Chrome slots', description: 'topAppBar, bottomBar, navigationRail, drawer, and fab.' },
      { title: 'Insets', description: 'CSS variables (--m3-inset-*) pad content from chrome.' },
      { title: 'Nesting', description: 'Single scaffold per route is recommended.' },
    ],
    accessibility: [
      'Landmark regions (header, main, nav) should be provided by slot content.',
      'Skip link to main content is recommended above the scaffold.',
      'FAB anchor preserves logical tab order relative to content.',
    ],
    related: ['top-app-bar', 'navigation-bar', 'fab', 'pane-scaffold'],
  },
  'button-group': {
    slug: 'button-group',
    title: 'Button Group',
    overview:
      'Button groups cluster related actions with shared shape treatment and Expressive neighbor bump on press.',
    imports: ['ButtonGroup', 'ButtonGroupItem'],
    usageCode: `import { ButtonGroup, ButtonGroupItem } from '@m3ui/react';

<ButtonGroup>
  <ButtonGroupItem>Save</ButtonGroupItem>
  <ButtonGroupItem>Share</ButtonGroupItem>
</ButtonGroup>`,
    variants: [
      { title: 'Standard', description: 'Spaced buttons with group outline.' },
      { title: 'Connected', description: 'Segmented visual with shared container.' },
      { title: 'Selection', description: 'Toggle selection per item when configured.' },
    ],
    accessibility: [
      'Group related actions with role="group" and an accessible label when needed.',
      'Each item remains individually focusable.',
      'Selection state is exposed when items are toggleable.',
    ],
    related: ['button', 'segmented-button', 'split-button'],
  },
  'split-button': {
    slug: 'split-button',
    title: 'Split Button',
    overview:
      'Split buttons combine a primary action with a secondary menu of related options in one control.',
    imports: ['SplitButton', 'MenuItem'],
    usageCode: `import { SplitButton, MenuItem } from '@m3ui/react';

<SplitButton menuItems={<><MenuItem>Draft</MenuItem><MenuItem>Schedule</MenuItem></>}>
  Send
</SplitButton>`,
    variants: [
      { title: 'Primary action', description: 'Leading button executes the default action.' },
      { title: 'Menu', description: 'Trailing chevron opens related secondary actions.' },
      { title: 'Sizes', description: 'Matches standard button sizes.' },
    ],
    accessibility: [
      'Primary and menu triggers have distinct accessible names.',
      'Menu opens with keyboard; arrow keys navigate items.',
      'Do not hide the only action in the menu—primary must be the common case.',
    ],
    related: ['button', 'menu', 'button-group'],
  },
  'fab-menu': {
    slug: 'fab-menu',
    title: 'FAB Menu',
    overview:
      'FAB menus expand a floating action button into a list of labeled secondary actions.',
    imports: ['FabMenu'],
    usageCode: `import { FabMenu } from '@m3ui/react';

<FabMenu
  aria-label="Create"
  icon="+"
  actions={[
    { label: 'Task', icon: '✓', onClick: createTask },
    { label: 'Note', icon: '📝', onClick: createNote },
  ]}
/>`,
    variants: [
      { title: 'Actions', description: 'Labeled items with icons stack above the FAB.' },
      { title: 'Scrim', description: 'Optional dimmed backdrop while open.' },
      { title: 'Direction', description: 'Actions expand upward (default) or adapt to inset.' },
    ],
    accessibility: [
      'FAB requires aria-label; each action label is visible and announced.',
      'Escape closes the menu and returns focus to the FAB.',
      'Opened state exposed via aria-expanded on the trigger.',
    ],
    related: ['fab', 'menu'],
  },
  toolbar: {
    slug: 'toolbar',
    title: 'Toolbar',
    overview:
      'Toolbars group editing and formatting actions. Docked and floating variants support scroll hide/show.',
    imports: ['Toolbar', 'ToolbarButton'],
    usageCode: `import { Toolbar, ToolbarButton } from '@m3ui/react';

<Toolbar variant="floating">
  <ToolbarButton aria-label="Bold">B</ToolbarButton>
  <ToolbarButton aria-label="Italic">I</ToolbarButton>
</Toolbar>`,
    variants: [
      { title: 'Docked', description: 'Full-width bar attached to an edge.' },
      { title: 'Floating', description: 'Elevated pill-shaped toolbar over content.' },
      { title: 'Scroll', description: 'Auto-hide on scroll away, show on scroll toward.' },
    ],
    accessibility: [
      'role="toolbar" with arrow-key navigation between controls.',
      'Each control has aria-label or visible text.',
      'Toggle buttons expose aria-pressed when applicable.',
    ],
    related: ['icon-button', 'button-group', 'divider'],
  },
  'date-input': {
    slug: 'date-input',
    title: 'Date Input',
    overview:
      'Date inputs collect locale-aware date values with segmented fields and validation via @internationalized/date.',
    imports: ['DateInput'],
    usageCode: `import { DateInput } from '@m3ui/react';

<DateInput label="Birth date" defaultValue={today(getLocalTimeZone())} />`,
    variants: [
      { title: 'Locale', description: 'Field order and separators follow locale.' },
      { title: 'Validation', description: 'min, max, and invalid state with error text.' },
      { title: 'Variants', description: 'filled and outlined field styles.' },
    ],
    accessibility: [
      'Segment fields are labeled and navigable with arrow keys.',
      'Invalid dates set aria-invalid with descriptive error text.',
      'Calendar system (Gregorian, etc.) respects locale props.',
    ],
    related: ['date-picker', 'text-field', 'time-picker'],
  },
  'date-picker': {
    slug: 'date-picker',
    title: 'Date Picker',
    overview:
      'Date pickers combine an input with a calendar for choosing dates. Docked, modal, and range modes are supported.',
    imports: ['DatePicker'],
    usageCode: `import { DatePicker } from '@m3ui/react';

<DatePicker variant="docked" label="Start date" />`,
    variants: [
      { title: 'Variants', description: 'docked, modal, and input-only trigger.' },
      { title: 'Range', description: 'Select start and end dates in one flow.' },
      { title: 'Calendar', description: 'Built-in calendar engine with keyboard navigation.' },
    ],
    accessibility: [
      'Calendar grid uses roving tabindex and arrow-key date navigation.',
      'Selected and today dates have distinct aria labels.',
      'Modal picker traps focus until confirmed or dismissed.',
    ],
    related: ['date-input', 'time-picker'],
  },
  'time-picker': {
    slug: 'time-picker',
    title: 'Time Picker',
    overview:
      'Time pickers let users choose times via dial or segmented input, with 12-hour and 24-hour formats.',
    imports: ['TimePicker'],
    usageCode: `import { TimePicker } from '@m3ui/react';

<TimePicker variant="dial" label="Alarm" />`,
    variants: [
      { title: 'Dial', description: 'Circular clock face for touch-friendly selection.' },
      { title: 'Input', description: 'Segmented hour/minute/period fields.' },
      { title: 'Format', description: '12h with AM/PM or 24h.' },
    ],
    accessibility: [
      'Dial supports keyboard nudging of hour and minute.',
      'AM/PM toggle is labeled and does not rely on color alone.',
      'Invalid times surface error text linked to the input.',
    ],
    related: ['date-picker', 'date-input'],
  },
  'pane-scaffold': {
    slug: 'pane-scaffold',
    title: 'Pane Scaffold',
    overview:
      'Pane scaffolds implement list-detail and supporting-pane layouts that adapt across window size classes.',
    imports: ['PaneScaffold', 'PaneScaffoldRoot'],
    usageCode: `import { PaneScaffold, PaneScaffoldRoot, List, ListItem } from '@m3ui/react';

<PaneScaffoldRoot defaultSizeClass="expanded">
  <PaneScaffold
    list={<List><ListItem headline="Inbox" /></List>}
    detail={<DetailView />}
  />
</PaneScaffoldRoot>`,
    variants: [
      { title: 'List-detail', description: 'Master list beside detail pane on expanded widths.' },
      { title: 'Supporting pane', description: 'Secondary pane for tools or metadata.' },
      { title: 'Size class', description: 'Compact stacks; expanded shows multiple panes.' },
    ],
    accessibility: [
      'Each pane should have a landmark or heading for orientation.',
      'Focus moves logically between list selection and detail content.',
      'On compact, back navigation from detail must be keyboard accessible.',
    ],
    related: ['scaffold', 'navigation-rail', 'adaptive-navigation'],
  },
  'adaptive-navigation': {
    slug: 'adaptive-navigation',
    title: 'Adaptive Navigation',
    overview:
      'Adaptive navigation automatically switches between navigation bar, rail, and drawer based on window size class.',
    imports: ['AdaptiveNavigation', 'WindowSizeClassProvider'],
    usageCode: `import { AdaptiveNavigation, WindowSizeClassProvider } from '@m3ui/react';

<WindowSizeClassProvider>
  <AdaptiveNavigation
    destinations={destinations}
    mode="auto"
  />
</WindowSizeClassProvider>`,
    variants: [
      { title: 'Modes', description: 'bar, rail, drawer, or auto by breakpoint.' },
      { title: 'Destinations', description: 'Shared destination config across form factors.' },
      { title: 'Badges', description: 'Notification badges on any navigation form.' },
    ],
    accessibility: [
      'Navigation role and current page semantics persist across layout switches.',
      'Resizing the window should not lose focus context unexpectedly.',
      'Provide WindowSizeClassProvider for deterministic SSR size class.',
    ],
    related: ['navigation-bar', 'navigation-rail', 'navigation-drawer', 'pane-scaffold'],
  },
};

export const PUBLIC_COMPONENT_SLUGS = Object.keys(COMPONENT_DOCS);

export function getComponentContent(slug: string): ComponentDocContent | undefined {
  return COMPONENT_DOCS[slug];
}
