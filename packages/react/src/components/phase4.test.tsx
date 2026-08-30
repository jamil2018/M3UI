import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { ButtonGroup, ButtonGroupItem } from './button-group.js';
import { SplitButton } from './split-button.js';
import { FabMenu } from './fab-menu.js';
import { Toolbar, ToolbarButton } from './toolbar.js';
import { MenuItem } from './menu.js';
import { IconButton } from './icon-button.js';
import { ShapeCrop } from '../lib/shape-crop.js';

describe('ButtonGroup', () => {
  it('renders items in a group', () => {
    renderWithM3(
      <ButtonGroup data-testid="btn-group">
        <ButtonGroupItem>One</ButtonGroupItem>
        <ButtonGroupItem>Two</ButtonGroupItem>
      </ButtonGroup>,
    );
    expect(screen.getByTestId('btn-group')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('supports connected variant', () => {
    renderWithM3(
      <ButtonGroup variant="connected" data-testid="connected-group">
        <ButtonGroupItem>A</ButtonGroupItem>
        <ButtonGroupItem>B</ButtonGroupItem>
      </ButtonGroup>,
    );
    expect(screen.getByTestId('connected-group')).toBeInTheDocument();
  });
});

describe('SplitButton', () => {
  it('renders leading action and menu trigger', () => {
    renderWithM3(
      <SplitButton menuItems={<MenuItem>Option</MenuItem>} data-testid="split">
        Save
      </SplitButton>,
    );
    expect(screen.getByTestId('split')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show menu' })).toBeInTheDocument();
  });

  it('calls leading onClick', () => {
    const onClick = vi.fn();
    renderWithM3(
      <SplitButton onClick={onClick} menuItems={<MenuItem>Opt</MenuItem>}>
        Action
      </SplitButton>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('FabMenu', () => {
  it('expands to show actions', async () => {
    const onEdit = vi.fn();
    renderWithM3(
      <FabMenu
        aria-label="Create"
        icon="+"
        actions={[{ label: 'Edit', onClick: onEdit }]}
        data-testid="fab-menu"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalled();
  });
});

describe('Toolbar', () => {
  it('renders docked toolbar', () => {
    renderWithM3(
      <Toolbar data-testid="toolbar">
        <ToolbarButton aria-label="Bold">B</ToolbarButton>
      </Toolbar>,
    );
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
  });

  it('renders floating variant', () => {
    renderWithM3(
      <Toolbar variant="floating" data-testid="floating-toolbar">
        <ToolbarButton aria-label="Copy">C</ToolbarButton>
      </Toolbar>,
    );
    expect(screen.getByTestId('floating-toolbar')).toBeInTheDocument();
  });
});

describe('ShapeCrop', () => {
  it('crops content to expressive shape', () => {
    renderWithM3(
      <ShapeCrop shape="heart" data-testid="crop">
        <span>Avatar</span>
      </ShapeCrop>,
    );
    const crop = screen.getByTestId('crop');
    expect(crop.style.clipPath).toContain('polygon(');
    expect(screen.getByText('Avatar')).toBeInTheDocument();
  });
});

describe('IconButton toggle morph', () => {
  it('renders toggle icon button with selection', () => {
    renderWithM3(
      <IconButton aria-label="Favorite" icon="★" toggle selected onSelectedChange={() => undefined} data-testid="fav-toggle" />,
    );
    expect(screen.getByTestId('fav-toggle')).toBeInTheDocument();
  });
});
