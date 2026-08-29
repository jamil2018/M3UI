'use client';

import { Badge, Tooltip, Button, Chip, ChipSet, RichTooltip } from '@m3ui/react';
import { row } from '../shared';

export function BadgeDemo() {
  return (
    <div style={row}>
      <Badge variant="dot" />
      <Badge count={5} />
      <Badge count={120} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button variant="outlined">Inbox</Button>
        <Badge count={3} />
      </div>
    </div>
  );
}

export function TooltipDemo() {
  return (
    <div style={row}>
      <Tooltip trigger={<Button variant="outlined">Plain</Button>} content="Save your draft" />
      <RichTooltip
        trigger={<Button variant="filled-tonal">Rich</Button>}
        title="Keyboard shortcut"
        description="Press Ctrl+S to save without leaving the editor."
      />
    </div>
  );
}

export function ChipDemo() {
  return (
    <ChipSet>
      <Chip type="assist" label="Add contact" />
      <Chip type="filter" label="Photos" defaultSelected />
      <Chip type="input" label="Design" onRemove={() => undefined} />
      <Chip type="suggestion" label="Weekend" elevated />
    </ChipSet>
  );
}
