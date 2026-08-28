import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Checkbox } from '../components/checkbox.js';

describe('Checkbox a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Checkbox label="Subscribe" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('checkbox is keyboard focusable', () => {
    renderWithM3(<Checkbox label="Notify" />);
    const cb = screen.getByRole('checkbox');
    cb.focus();
    expect(document.activeElement).toBe(cb);
  });
});
