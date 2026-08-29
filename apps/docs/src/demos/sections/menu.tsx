'use client';

import {
  Menu,
  MenuItem,
  Button,
} from '@m3ui/react';
import { row } from '../shared';

export function MenuDemo() {
  return (
    <div style={row}>
      <Menu trigger={<Button variant="outlined">Actions</Button>}>
        <MenuItem>Edit</MenuItem>
        <MenuItem shortcut="⌘C">Copy</MenuItem>
        <MenuItem shortcut="⌘V">Paste</MenuItem>
        <MenuItem disabled>Archive</MenuItem>
      </Menu>
      <Menu trigger={<Button variant="text">More</Button>}>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move to trash</MenuItem>
      </Menu>
    </div>
  );
}
