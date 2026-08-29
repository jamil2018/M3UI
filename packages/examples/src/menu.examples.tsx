import { Menu, MenuItem, Button } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function MenuBasicExample() {
  return (
    <Menu trigger={<Button variant="outlined">Open menu</Button>}>
      <MenuItem leadingIcon="✎">Edit</MenuItem>
      <MenuItem shortcut="⌘C">Copy</MenuItem>
      <MenuItem trailingIcon="🗑">Delete</MenuItem>
    </Menu>
  );
}

export const menuExamples: ComponentExampleDefinition[] = [
  {
    id: 'menu-basic',
    componentSlug: 'menu',
    title: 'Basic',
    description: 'Dropdown menu with icons and keyboard shortcuts.',
    source: `<Menu trigger={<Button variant="outlined">Open menu</Button>}>
  <MenuItem leadingIcon="✎">Edit</MenuItem>
  <MenuItem shortcut="⌘C">Copy</MenuItem>
  <MenuItem trailingIcon="🗑">Delete</MenuItem>
</Menu>`,
    Component: MenuBasicExample,
  },
];
