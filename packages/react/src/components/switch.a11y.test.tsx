import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Switch } from '../components/switch.js';

describe('Switch a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Switch label="Notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is keyboard focusable', () => {
    renderWithM3(<Switch label="Bluetooth" />);
    const sw = screen.getByRole('switch');
    sw.focus();
    expect(document.activeElement).toBe(sw);
  });
});
