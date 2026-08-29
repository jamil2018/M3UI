import {
  Autocomplete,
  SearchBar,
  SegmentedButton,
  SegmentedButtonItem,
  DateInput,
  TimePicker,
  WindowSizeClassProvider,
} from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
];

function AutocompleteExample() {
  return <Autocomplete label="Framework" options={OPTIONS} />;
}

function SearchExample() {
  return <SearchBar placeholder="Search photos" />;
}

function SegmentedButtonExample() {
  return (
    <SegmentedButton defaultValue={['day']}>
      <SegmentedButtonItem value="day" label="Day" />
      <SegmentedButtonItem value="week" label="Week" />
    </SegmentedButton>
  );
}

function DateInputExample() {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact">
      <DateInput label="Date" />
    </WindowSizeClassProvider>
  );
}

function TimePickerExample() {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact">
      <TimePicker variant="dial" />
    </WindowSizeClassProvider>
  );
}

export const autocompleteExamples: ComponentExampleDefinition[] = [
  {
    id: 'autocomplete-basic',
    componentSlug: 'autocomplete',
    title: 'Filtered options',
    source: `<Autocomplete label="Framework" options={options} />`,
    Component: AutocompleteExample,
  },
];

export const searchExamples: ComponentExampleDefinition[] = [
  {
    id: 'search-bar',
    componentSlug: 'search',
    title: 'Search bar',
    source: `<SearchBar placeholder="Search" />`,
    Component: SearchExample,
  },
];

export const segmentedButtonExamples: ComponentExampleDefinition[] = [
  {
    id: 'segmented-day-week',
    componentSlug: 'segmented-button',
    title: 'View switcher',
    source: `<SegmentedButton defaultValue={['day']}>...</SegmentedButton>`,
    Component: SegmentedButtonExample,
  },
];

export const dateInputExamples: ComponentExampleDefinition[] = [
  {
    id: 'date-input-locale',
    componentSlug: 'date-input',
    title: 'Locale-aware input',
    source: `<DateInput label="Date" />`,
    Component: DateInputExample,
  },
];

export const timePickerExamples: ComponentExampleDefinition[] = [
  {
    id: 'time-picker-dial',
    componentSlug: 'time-picker',
    title: 'Dial picker',
    source: `<TimePicker variant="dial" />`,
    Component: TimePickerExample,
  },
];
