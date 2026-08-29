import {
  Badge,
  Tooltip,
  Button,
  Chip,
  ChipSet,
  RichTooltip,
} from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function BadgeExample() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Badge variant="dot" />
      <Badge count={5} />
      <Badge count={120} />
    </div>
  );
}

function TooltipExample() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Tooltip trigger={<Button variant="outlined">Help</Button>} content="Save your draft" />
      <RichTooltip
        trigger={<Button variant="filled-tonal">Rich</Button>}
        title="Shortcut"
        description="Press Ctrl+S to save."
      />
    </div>
  );
}

function ChipExample() {
  return (
    <ChipSet>
      <Chip type="assist" label="Add contact" />
      <Chip type="filter" label="Photos" defaultSelected />
      <Chip type="input" label="Design" onRemove={() => undefined} />
    </ChipSet>
  );
}

export const badgeExamples: ComponentExampleDefinition[] = [
  {
    id: 'badge-types',
    componentSlug: 'badge',
    title: 'Dot and count',
    description: 'Presence dot and numeric notification badges.',
    source: `<Badge variant="dot" />\n<Badge count={5} />`,
    Component: BadgeExample,
  },
];

export const tooltipExamples: ComponentExampleDefinition[] = [
  {
    id: 'tooltip-plain-rich',
    componentSlug: 'tooltip',
    title: 'Plain and rich',
    description: 'Single-line and rich tooltips with title and body.',
    source: `<Tooltip trigger={<Button>Help</Button>} content="Hint" />`,
    Component: TooltipExample,
  },
];

export const chipExamples: ComponentExampleDefinition[] = [
  {
    id: 'chip-types',
    componentSlug: 'chip',
    title: 'Chip types',
    description: 'Assist, filter, and input chips.',
    source: `<ChipSet>\n  <Chip type="filter" label="Photos" />\n</ChipSet>`,
    Component: ChipExample,
  },
];
