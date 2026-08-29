import { Select } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function SelectBasicExample() {
  return (
    <Select
      label="Framework"
      options={[
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
        { value: 'svelte', label: 'Svelte' },
      ]}
      defaultValue="react"
    />
  );
}

export const selectExamples: ComponentExampleDefinition[] = [
  {
    id: 'select-basic',
    componentSlug: 'select',
    title: 'Basic',
    description: 'Dropdown select styled as an M3 text field.',
    source: `<Select
  label="Framework"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
  ]}
  defaultValue="react"
/>`,
    Component: SelectBasicExample,
  },
];
