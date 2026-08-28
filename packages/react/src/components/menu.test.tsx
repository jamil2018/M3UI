import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Button } from '../components/button.js';
import { Menu, MenuItem, ContextMenu, ContextMenuItem, Menubar, MenubarMenu } from '../components/menu.js';

describe('Menu', () => {
  it('opens menu on trigger click', async () => {
    renderWithM3(
      <Menu trigger={<Button variant="outlined">Open</Button>}>
        <MenuItem>Item 1</MenuItem>
        <MenuItem shortcut="⌘C">Copy</MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('menuitem', { name: 'Item 1' })).toBeInTheDocument();
  });

  it('renders context menu', () => {
    renderWithM3(
      <ContextMenu trigger={<div data-testid="ctx-trigger">Right click</div>}>
        <ContextMenuItem>Edit</ContextMenuItem>
      </ContextMenu>,
    );
    expect(screen.getByTestId('ctx-trigger')).toBeInTheDocument();
  });

  it('renders menubar', () => {
    renderWithM3(
      <Menubar data-testid="menubar">
        <MenubarMenu label="File">
          <MenuItem>New</MenuItem>
        </MenubarMenu>
      </Menubar>,
    );
    expect(screen.getByTestId('menubar')).toBeInTheDocument();
    expect(screen.getByText('File')).toBeInTheDocument();
  });
});
