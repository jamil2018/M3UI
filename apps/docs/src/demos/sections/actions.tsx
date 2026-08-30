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
  Icon,
} from '@m3ui/react';
import { caption, column, row } from '../shared';

const BUTTON_VARIANTS = ['filled', 'elevated', 'filled-tonal', 'outlined', 'text'] as const;
const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export function ButtonDemo() {
  return (
    <div style={column}>
      <p style={caption}>Hover, focus, or press to preview state layers and ripple.</p>
      <div style={row}>
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} size="md">
            {variant}
          </Button>
        ))}
      </div>
      <p style={caption}>Expressive size scale (xs–xl)</p>
      <div style={row}>
        {BUTTON_SIZES.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <p style={caption}>Disabled state tokens</p>
      <div style={row}>
        <Button variant="filled" disabled>
          Disabled
        </Button>
        <Button variant="elevated" disabled>
          Disabled
        </Button>
        <Button variant="outlined" disabled>
          Disabled
        </Button>
      </div>
      <div style={row}>
        <Button startIcon={<Icon name="add" />}>Create</Button>
        <Button variant="outlined" endIcon={<Icon name="open_in_new" />}>
          Open
        </Button>
      </div>
    </div>
  );
}

export function IconButtonDemo() {
  return (
    <div style={column}>
      <p style={caption}>Variants with interactive state layers</p>
      <div style={row}>
        <IconButton aria-label="Favorite standard" icon={<Icon name="favorite" />} variant="standard" />
        <IconButton aria-label="Favorite filled" icon={<Icon name="favorite" fill={1} />} variant="filled" />
        <IconButton aria-label="Favorite tonal" icon={<Icon name="favorite" />} variant="filled-tonal" />
        <IconButton
          aria-label="Favorite outlined toggle"
          icon={<Icon name="favorite" fill={1} />}
          variant="outlined"
          toggle
          selected
        />
      </div>
      <p style={caption}>Expressive sizes (xs–xl)</p>
      <div style={row}>
        {BUTTON_SIZES.map((size) => (
          <IconButton
            key={size}
            aria-label={`Favorite ${size}`}
            icon={<Icon name="favorite" />}
            variant="filled-tonal"
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

export function FabDemo() {
  return (
    <div style={{ ...row, gap: 16 }}>
      <Fab aria-label="Add" icon={<Icon name="add" />} size="standard" />
      <Fab aria-label="Add medium" icon={<Icon name="add" />} size="medium" />
      <Fab aria-label="Add large" icon={<Icon name="add" />} size="large" />
      <ExtendedFab icon={<Icon name="edit" />} label="Compose" size="small" />
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
    <div style={{ minHeight: 220, display: 'flex', alignItems: 'flex-end' }}>
      <FabMenu
        aria-label="Create"
        icon={<Icon name="add" />}
        actions={[
          { label: 'Task', icon: <Icon name="check" />, onClick: () => undefined },
          { label: 'Note', icon: <Icon name="note_add" />, onClick: () => undefined },
        ]}
      />
    </div>
  );
}

export function ToolbarDemo() {
  return (
    <Toolbar variant="floating">
      <ToolbarButton aria-label="Bold" selected>
        <Icon name="format_bold" />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Icon name="format_italic" />
      </ToolbarButton>
      <ToolbarButton aria-label="Insert link">
        <Icon name="link" />
      </ToolbarButton>
    </Toolbar>
  );
}
