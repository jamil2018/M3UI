import { Checkbox, CheckboxGroup } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function CheckboxBasicExample() {
  return (
    <CheckboxGroup defaultValue={[]}>
      <Checkbox label="Option A" value="a" />
      <Checkbox label="Option B" value="b" />
      <Checkbox label="Indeterminate" indeterminate />
    </CheckboxGroup>
  );
}

function CheckboxGroupExample() {
  return (
    <CheckboxGroup defaultValue={['a']}>
      <Checkbox label="Checkbox A" value="a" />
      <Checkbox label="Checkbox B" value="b" />
    </CheckboxGroup>
  );
}

export const checkboxExamples: ComponentExampleDefinition[] = [
  {
    id: 'checkbox-basic',
    componentSlug: 'checkbox',
    title: 'Basic',
    description: 'Standalone checkboxes with an indeterminate state.',
    source: `<CheckboxGroup defaultValue={[]}>
  <Checkbox label="Option A" value="a" />
  <Checkbox label="Option B" value="b" />
  <Checkbox label="Indeterminate" indeterminate />
</CheckboxGroup>`,
    Component: CheckboxBasicExample,
  },
  {
    id: 'checkbox-group',
    componentSlug: 'checkbox',
    title: 'Group',
    description: 'Checkbox group with a default selection.',
    source: `<CheckboxGroup defaultValue={['a']}>
  <Checkbox label="Checkbox A" value="a" />
  <Checkbox label="Checkbox B" value="b" />
</CheckboxGroup>`,
    Component: CheckboxGroupExample,
  },
];
