import { IconButton } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function IconButtonVariantsExample() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton aria-label="Standard" icon="★" variant="standard" />
      <IconButton aria-label="Filled" icon="★" variant="filled" />
      <IconButton aria-label="Tonal" icon="★" variant="filled-tonal" />
      <IconButton aria-label="Outlined" icon="★" variant="outlined" />
    </div>
  );
}

export const iconButtonExamples: ComponentExampleDefinition[] = [
  {
    id: 'icon-button-variants',
    componentSlug: 'icon-button',
    title: 'Variants',
    description: 'Standard, filled, tonal, and outlined icon buttons.',
    source: `<div style={{ display: 'flex', gap: 12 }}>
  <IconButton aria-label="Standard" icon="★" variant="standard" />
  <IconButton aria-label="Filled" icon="★" variant="filled" />
  <IconButton aria-label="Tonal" icon="★" variant="filled-tonal" />
  <IconButton aria-label="Outlined" icon="★" variant="outlined" />
</div>`,
    Component: IconButtonVariantsExample,
  },
];
