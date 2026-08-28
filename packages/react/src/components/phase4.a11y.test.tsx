import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { ButtonGroup, ButtonGroupItem } from './button-group.js';
import { SplitButton } from './split-button.js';
import { FabMenu } from './fab-menu.js';
import { Toolbar, ToolbarButton } from './toolbar.js';
import { MenuItem } from './menu.js';

describe('Phase 4 a11y', () => {
  it('ButtonGroup has no axe violations', async () => {
    const { container } = renderWithM3(
      <ButtonGroup>
        <ButtonGroupItem>Save</ButtonGroupItem>
        <ButtonGroupItem>Share</ButtonGroupItem>
      </ButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('SplitButton has no axe violations', async () => {
    const { container } = renderWithM3(
      <SplitButton menuItems={<MenuItem>More</MenuItem>}>Send</SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('FabMenu has no axe violations', async () => {
    const { container } = renderWithM3(
      <FabMenu aria-label="Add" icon="+" actions={[{ label: 'Task' }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Toolbar has no axe violations', async () => {
    const { container } = renderWithM3(
      <Toolbar>
        <ToolbarButton aria-label="Undo">↩</ToolbarButton>
      </Toolbar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
