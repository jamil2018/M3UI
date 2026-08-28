'use client';

import { Button, Menu, MenuItem } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'menu',
  'Menu',
  <Menu trigger={<Button variant="outlined">Open menu</Button>}>
    <MenuItem leadingIcon="✎">Edit</MenuItem>
    <MenuItem shortcut="⌘C">Copy</MenuItem>
    <MenuItem trailingIcon="🗑">Delete</MenuItem>
  </Menu>,
);
