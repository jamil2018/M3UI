import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Badge } from '../components/badge.js';

describe('Badge a11y', () => {
  it('has no accessibility violations for numbered badge', async () => {
    const { container } = renderWithM3(<Badge count={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('numbered badge has aria-label', () => {
    renderWithM3(<Badge count={7} />);
    expect(screen.getByLabelText('7 notifications')).toBeInTheDocument();
  });
});
