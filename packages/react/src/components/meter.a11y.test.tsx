import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Meter } from '../components/meter.js';

describe('Meter a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Meter value={40} label="Battery" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes meter role', () => {
    renderWithM3(<Meter value={80} min={0} max={100} />);
    expect(screen.getByRole('meter')).toBeInTheDocument();
  });
});
