'use client';

import {
  Button,
  IconButton,
  Fab,
  ExtendedFab,
  ButtonGroup,
  ButtonGroupItem,
  SplitButton,
  FabMenu,
  Toolbar,
  ToolbarButton,
  MenuItem,
} from '@m3ui/react';
import { row } from '../shared';

export function ButtonDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={row}>
        {(['filled', 'elevated', 'filled-tonal', 'outlined', 'text'] as const).map((v) => (
          <Button key={v} variant={v} size="md">
            {v}
          </Button>
        ))}
      </div>
      <div style={row}>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Button key={s} size={s}>
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function IconButtonDemo() {
  return (
    <div style={row}>
      <IconButton aria-label="Star standard" icon="★" variant="standard" />
      <IconButton aria-label="Star filled" icon="★" variant="filled" />
      <IconButton aria-label="Star tonal" icon="★" variant="filled-tonal" />
      <IconButton aria-label="Star outlined toggle" icon="★" variant="outlined" toggle selected />
    </div>
  );
}

export function FabDemo() {
  return (
    <div style={{ ...row, gap: 16 }}>
      <Fab aria-label="Add small" icon="+" size="small" />
      <Fab aria-label="Add medium" icon="+" size="medium" />
      <ExtendedFab icon="+" label="Compose" />
    </div>
  );
}

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupItem>Save</ButtonGroupItem>
      <ButtonGroupItem>Share</ButtonGroupItem>
      <ButtonGroupItem>More</ButtonGroupItem>
    </ButtonGroup>
  );
}

export function SplitButtonDemo() {
  return (
    <SplitButton menuItems={<MenuItem>Schedule send</MenuItem>}>Send now</SplitButton>
  );
}

export function FabMenuDemo() {
  return (
    <FabMenu
      aria-label="Create"
      icon="+"
      actions={[
        { label: 'Task', icon: '✓', onClick: () => undefined },
        { label: 'Note', icon: '📝', onClick: () => undefined },
      ]}
    />
  );
}

export function ToolbarDemo() {
  return (
    <Toolbar variant="floating">
      <ToolbarButton aria-label="Copy">C</ToolbarButton>
      <ToolbarButton aria-label="Paste">P</ToolbarButton>
      <ToolbarButton aria-label="Cut">X</ToolbarButton>
    </Toolbar>
  );
}
