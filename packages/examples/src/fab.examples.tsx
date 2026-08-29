import { ExtendedFab, Fab } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function FabSizesExample() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Fab aria-label="Add" icon="+" size="small" />
      <Fab aria-label="Add" icon="+" size="medium" />
      <Fab aria-label="Add" icon="+" size="large" />
      <ExtendedFab icon="+" label="Compose" />
    </div>
  );
}

export const fabExamples: ComponentExampleDefinition[] = [
  {
    id: 'fab-sizes',
    componentSlug: 'fab',
    title: 'Sizes',
    description: 'Small, medium, large FABs and extended FAB with label.',
    source: `<div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
  <Fab aria-label="Add" icon="+" size="small" />
  <Fab aria-label="Add" icon="+" size="medium" />
  <Fab aria-label="Add" icon="+" size="large" />
  <ExtendedFab icon="+" label="Compose" />
</div>`,
    Component: FabSizesExample,
  },
];
