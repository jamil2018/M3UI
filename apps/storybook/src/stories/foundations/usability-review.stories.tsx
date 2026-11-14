import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  CalendarDate,
  ButtonGroup,
  ButtonGroupItem,
  SearchBar,
  Button,
  DatePicker,
  TimePicker,
  SearchView,
  NavigationDrawer,
  NavigationRail,
  Dialog,
  BottomSheet,
  SideSheet,
  Slider,
  Icon,
} from '@m3ui/react';

function UsabilityReview() {
  const [drawer, setDrawer] = useState(false);
  const [rail, setRail] = useState(false);
  const destinations = ['Home', 'Search', 'Library'].map((label) => ({
    value: label,
    label,
    icon: <Icon name="home" />,
  }));
  return (
    <main style={{ padding: 24, display: 'grid', gap: 24 }}>
      <h1>Interaction review</h1>
      <Slider label="Volume" defaultValue={40} data-testid="review-slider" />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <DatePicker
          variant="modal"
          defaultValue={new CalendarDate(2026, 11, 14)}
          trigger={<Button>Date calendar</Button>}
        />
        <DatePicker
          variant="modal-input"
          defaultValue={new CalendarDate(2026, 11, 14)}
          trigger={<Button>Date input</Button>}
        />
        <DatePicker
          variant="modal"
          mode="range"
          defaultValue={{
            start: new CalendarDate(2026, 11, 14),
            end: new CalendarDate(2026, 11, 19),
          }}
          trigger={<Button>Date range</Button>}
        />
        <TimePicker trigger={<Button>Time 12 hour</Button>} />
        <TimePicker
          format="24h"
          defaultValue={{ hour: 0, minute: 30 }}
          trigger={<Button>Time 24 hour</Button>}
        />
        <TimePicker variant="input" trigger={<Button>Time input</Button>} />
        <SearchView
          trigger={<Button>Open search</Button>}
          suggestions={[
            { value: 'reports', label: 'Reports' },
            { value: 'settings', label: 'Settings' },
          ]}
        />
        <Button onClick={() => setDrawer(true)}>Open drawer</Button>
        <Button onClick={() => setRail(true)}>Open rail</Button>
        <Dialog
          trigger={<Button>Open dialog</Button>}
          headline="Save changes?"
          body="Your changes will be saved to this workspace."
        />
        <BottomSheet trigger={<Button>Open bottom sheet</Button>}>Choose a destination</BottomSheet>
        <SideSheet trigger={<Button>Open side sheet</Button>} headline="Filters">
          Choose filters
        </SideSheet>
      </div>
      {drawer && (
        <NavigationDrawer
          variant="modal"
          open
          onOpenChange={setDrawer}
          sections={[{ items: destinations }]}
        />
      )}
      {rail && (
        <NavigationRail mode="modal" open onOpenChange={setRail} destinations={destinations} />
      )}
    </main>
  );
}
export default { title: 'Foundations/Usability review', component: UsabilityReview } satisfies Meta<
  typeof UsabilityReview
>;
export const Controls: StoryObj<typeof UsabilityReview> = {};

import {
  Autocomplete,
  Combobox,
  Select,
  Menu,
  MenuItem,
  IconButton,
  Fab,
  ExtendedFab,
  FabMenu,
  Card,
  List,
  ListItem,
  Chip,
  TextField,
  Tooltip,
} from '@m3ui/react';
function CompositionReview() {
  const [action, setAction] = useState('None');
  const options = [
    { value: 'framework-123', label: 'React' },
    { value: 'framework-456', label: 'Vue' },
    { value: 'disabled', label: 'Disabled', disabled: true },
  ];
  return (
    <main style={{ padding: 24, display: 'grid', gap: 20 }}>
      <output aria-label="Last action">{action}</output>
      <FabMenu
        icon={<Icon name="add" />}
        aria-label="Create"
        actions={[
          { label: 'New document', onClick: () => setAction('Created') },
          { label: 'Unavailable', disabled: true },
        ]}
      />
      <Card interactive onClick={() => setAction('Card')}>
        <div style={{ padding: 20 }}>
          Open card <Button onClick={() => setAction('Secondary')}>Secondary action</Button>
        </div>
      </Card>
      <List>
        <ListItem
          interactive
          headline="Open item"
          onClick={() => setAction('List')}
          trailing={
            <IconButton
              icon={<Icon name="more_vert" />}
              aria-label="Item details"
              onClick={() => setAction('Details')}
            />
          }
        />
      </List>
      <Chip
        type="input"
        label="Alex"
        onClick={() => setAction('Alex')}
        onRemove={() => setAction('Removed Alex')}
      />
      <ExtendedFab expanded={false} label="Compose" icon={<Icon name="edit" />} />
      <Tooltip
        content="Icon help"
        trigger={<IconButton aria-label="Help" icon={<Icon name="help" />} />}
      />
      <Menu trigger={<IconButton aria-label="Icon actions" icon={<Icon name="more_vert" />} />}>
        <MenuItem onClick={() => setAction('Menu')}>Menu action</MenuItem>
      </Menu>
      <Menu trigger={<Fab aria-label="Fab actions" icon={<Icon name="add" />} />}>
        <MenuItem>Fab action</MenuItem>
      </Menu>
      <Autocomplete label="Framework" options={options} />
      <Combobox label="Library" options={options} />
      <Select
        defaultValue="framework-123"
        label="Invalid choice"
        options={options}
        error
        errorText="Choose a valid framework"
      />
      <TextField multiline label="Notes" error errorText="Notes are required" />
      <Dialog
        trigger={<Button>Nested controls</Button>}
        headline="Nested controls"
        body={
          <div style={{ display: 'grid', gap: 20 }}>
            <Select label="Nested select" options={options} />
            <Autocomplete label="Nested autocomplete" options={options} />
            <Menu trigger={<Button>Nested menu</Button>}>
              <MenuItem onClick={() => setAction('Nested menu')}>Nested action</MenuItem>
            </Menu>
            <Dialog
              trigger={<Button>Nested dialog</Button>}
              headline="Second dialog"
              body="Second layer"
            />
          </div>
        }
      />
      <SearchView
        trigger={<Button>Long search</Button>}
        suggestions={Array.from({ length: 40 }, (_, i) => ({
          value: `result-${i + 1}`,
          label: `Result ${i + 1}`,
        }))}
      />
    </main>
  );
}
export const Compositions: StoryObj = { render: () => <CompositionReview /> };

import { DateInput, SplitButton, TopAppBar, type TopAppBarSize } from '@m3ui/react';
import { useRef } from 'react';
export const OutlinedFields: StoryObj = {
  render: () => (
    <main style={{ padding: 24, display: 'grid', gap: 24 }}>
      <TextField variant="outlined" label="Text entry" defaultValue="Example" />
      <DateInput
        variant="outlined"
        label="Date entry"
        defaultValue={new CalendarDate(2026, 11, 14)}
      />
      <Autocomplete label="Autocomplete entry" defaultValue="Example" options={[]} />
      <Combobox
        label="Combobox entry"
        defaultValue="1"
        options={[{ value: '1', label: 'Example' }]}
      />
      <Select label="Select entry" defaultValue="1" options={[{ value: '1', label: 'Example' }]} />
      <SplitButton menuItems={<MenuItem>Schedule</MenuItem>}>Send</SplitButton>
    </main>
  ),
};
function AppBarFrame({ size }: { size: TopAppBarSize }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      data-testid={`bar-frame-${size}`}
      style={{ height: 240, overflow: 'auto', position: 'relative', border: '1px solid gray' }}
    >
      <TopAppBar
        size={size}
        title="Page title"
        subtitle="Page subtitle"
        onBack={() => {}}
        trailing={<IconButton aria-label="Page actions" icon={<Icon name="more_vert" />} />}
        scrollTarget={ref}
      />
      <div style={{ height: 600, padding: 16 }}>Page content</div>
    </div>
  );
}
export const AppBars: StoryObj = {
  render: () => (
    <main style={{ padding: 16, display: 'grid', gap: 24 }}>
      {(['small', 'medium', 'large', 'medium-flexible', 'large-flexible'] as const).map((size) => (
        <AppBarFrame key={size} size={size} />
      ))}
    </main>
  ),
};

export const ShippingCompositions: StoryObj = {
  render: () => (
    <main style={{ padding: 24 }}>
      <ButtonGroup variant="connected">
        <ButtonGroupItem>First action</ButtonGroupItem>
        <ButtonGroupItem>Last action</ButtonGroupItem>
      </ButtonGroup>
      {(['start', 'end'] as const).map((side) => (
        <SideSheet key={side} side={side} headline={side} trigger={<Button>Sheet {side}</Button>}>
          Sheet content
        </SideSheet>
      ))}
      <Dialog
        trigger={<Button>Search dialog</Button>}
        headline="Search dialog"
        body={
          <SearchBar
            placeholder="Nested search"
            suggestions={[{ value: 'reports', label: 'Reports' }]}
          />
        }
      />
    </main>
  ),
};
