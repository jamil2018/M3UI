import { Radio, RadioGroup } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function RadioGroupExample() {
  return (
    <RadioGroup defaultValue="pro" name="plan">
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Team" />
    </RadioGroup>
  );
}

export const radioExamples: ComponentExampleDefinition[] = [
  {
    id: 'radio-group',
    componentSlug: 'radio',
    title: 'Group',
    description: 'Mutually exclusive radio options in a group.',
    source: `<RadioGroup defaultValue="pro" name="plan">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
  <Radio value="team" label="Team" />
</RadioGroup>`,
    Component: RadioGroupExample,
  },
];
