import { TextField } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function TextFieldVariantsExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <TextField label="Filled" variant="filled" supportingText="Supporting text" />
      <TextField label="Outlined" variant="outlined" />
    </div>
  );
}

export const textFieldExamples: ComponentExampleDefinition[] = [
  {
    id: 'text-field-variants',
    componentSlug: 'text-field',
    title: 'Variants',
    description: 'Filled and outlined text fields with supporting text.',
    source: `<div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
  <TextField label="Filled" variant="filled" supportingText="Supporting text" />
  <TextField label="Outlined" variant="outlined" />
</div>`,
    Component: TextFieldVariantsExample,
  },
];
