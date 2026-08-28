import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Fab } from '../components/fab.js';

describe('Fab a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Fab aria-label="Create document" icon="+" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is keyboard focusable', () => {
    renderWithM3(<Fab aria-label="Create" icon="+" />);
    const btn = screen.getByRole('button');
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });
});
