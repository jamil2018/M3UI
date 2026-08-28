import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Button } from '../components/button.js';
import { Tooltip } from '../components/tooltip.js';

describe('Tooltip a11y', () => {
  it('has no accessibility violations on trigger', async () => {
    const { container } = renderWithM3(
      <Tooltip trigger={<Button>Info</Button>} content="More information" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('trigger is keyboard focusable', () => {
    renderWithM3(
      <Tooltip trigger={<Button>Help</Button>} content="Tooltip" />,
    );
    const btn = screen.getByRole('button');
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });
});
