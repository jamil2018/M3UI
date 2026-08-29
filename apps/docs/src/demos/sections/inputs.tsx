'use client';

import {
  TextField,
  Select,
  Autocomplete,
  SearchBar,
  DateInput,
  DatePicker,
  TimePicker,
  WindowSizeClassProvider,
} from '@m3ui/react';
import { column, narrow } from '../shared';

const FRAMEWORK_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

const COUNTRY_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
];

export function TextFieldDemo() {
  return (
    <div style={{ ...column, ...narrow }}>
      <TextField label="Email" variant="filled" supportingText="We'll never share your email" />
      <TextField label="Password" variant="outlined" type="password" />
    </div>
  );
}

export function SelectDemo() {
  return (
    <div style={narrow}>
      <Select label="Country" options={COUNTRY_OPTIONS} defaultValue="us" />
    </div>
  );
}

export function AutocompleteDemo() {
  return (
    <div style={narrow}>
      <Autocomplete label="Framework" options={FRAMEWORK_OPTIONS} placeholder="Search frameworks" />
    </div>
  );
}

export function SearchDemo() {
  return (
    <div style={narrow}>
      <SearchBar placeholder="Search photos" />
    </div>
  );
}

export function DateInputDemo() {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 80 }}>
      <DateInput label="Event date" />
    </WindowSizeClassProvider>
  );
}

export function DatePickerDemo() {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 80 }}>
      <DatePicker variant="docked" label="Start date" />
    </WindowSizeClassProvider>
  );
}

export function TimePickerDemo() {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 80 }}>
      <TimePicker variant="dial" />
    </WindowSizeClassProvider>
  );
}
