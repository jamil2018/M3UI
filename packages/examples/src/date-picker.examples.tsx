import { DatePicker, Button, WindowSizeClassProvider } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function DatePickerVariantsExample() {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 400 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <DatePicker variant="docked" trigger={<Button variant="outlined">Docked</Button>} />
        <DatePicker variant="modal" trigger={<Button variant="filled-tonal">Modal</Button>} />
        <DatePicker variant="modal" mode="range" trigger={<Button variant="text">Range</Button>} />
      </div>
    </WindowSizeClassProvider>
  );
}

function DatePickerDockedExample() {
  return (
    <WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 200 }}>
      <DatePicker variant="docked" />
    </WindowSizeClassProvider>
  );
}

export const datePickerExamples: ComponentExampleDefinition[] = [
  {
    id: 'date-picker-variants',
    componentSlug: 'date-picker',
    title: 'Variants',
    description: 'Docked, modal, and range date pickers.',
    source: `<WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 400 }}>
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <DatePicker variant="docked" trigger={<Button variant="outlined">Docked</Button>} />
    <DatePicker variant="modal" trigger={<Button variant="filled-tonal">Modal</Button>} />
    <DatePicker variant="modal" mode="range" trigger={<Button variant="text">Range</Button>} />
  </div>
</WindowSizeClassProvider>`,
    Component: DatePickerVariantsExample,
  },
  {
    id: 'date-picker-docked',
    componentSlug: 'date-picker',
    title: 'Docked',
    description: 'Inline docked picker from the Storybook demo.',
    source: `<WindowSizeClassProvider defaultSizeClass="compact" style={{ minHeight: 200 }}>
  <DatePicker variant="docked" />
</WindowSizeClassProvider>`,
    Component: DatePickerDockedExample,
  },
];
