import { ExtendedFab, Fab, Icon } from '@m3ui/react';
import { demoCaption, demoColumn, demoRow } from './demo-chrome';
import type { ComponentExampleDefinition } from './types';

function FabSizesExample() {
  return (
    <div style={demoColumn}>
      <p style={demoCaption}>Standard, medium, and large FABs use container-elevation tokens.</p>
      <div style={{ ...demoRow, gap: 16 }}>
        <Fab aria-label="Add" icon={<Icon name="add" />} size="standard" />
        <Fab aria-label="Add" icon={<Icon name="add" />} size="medium" />
        <Fab aria-label="Add" icon={<Icon name="add" />} size="large" />
        <ExtendedFab icon={<Icon name="edit" />} label="Compose" size="small" />
      </div>
    </div>
  );
}

function FabColorsExample() {
  return (
    <div style={demoRow}>
      <Fab aria-label="Edit primary" icon={<Icon name="edit" />} variant="primary" />
      <Fab aria-label="Edit secondary" icon={<Icon name="edit" />} variant="secondary" />
      <Fab aria-label="Edit tertiary" icon={<Icon name="edit" />} variant="tertiary-container" />
    </div>
  );
}

export const fabExamples: ComponentExampleDefinition[] = [
  {
    id: 'fab-sizes',
    componentSlug: 'fab',
    title: 'Sizes',
    description: 'Standard, medium, and large FABs plus the small extended FAB.',
    source: `<div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
  <Fab aria-label="Add" icon={<Icon name="add" />} size="standard" />
  <Fab aria-label="Add" icon={<Icon name="add" />} size="medium" />
  <Fab aria-label="Add" icon={<Icon name="add" />} size="large" />
  <ExtendedFab icon={<Icon name="edit" />} label="Compose" size="small" />
</div>`,
    Component: FabSizesExample,
  },
  {
    id: 'fab-colors',
    componentSlug: 'fab',
    title: 'Color variants',
    description: 'Expressive tone and container color families.',
    source: `<Fab aria-label="Edit" icon={<Icon name="edit" />} variant="primary" />
<Fab aria-label="Edit" icon={<Icon name="edit" />} variant="secondary" />
<Fab aria-label="Edit" icon={<Icon name="edit" />} variant="tertiary-container" />`,
    Component: FabColorsExample,
  },
];
