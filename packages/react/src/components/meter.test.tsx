import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Meter } from '../components/meter.js';

describe('Meter', () => {
  it('renders meter with value', () => {
    renderWithM3(<Meter value={65} label="Storage" data-testid="meter" />);
    expect(screen.getByTestId('meter')).toBeInTheDocument();
    expect(screen.getByRole('meter')).toBeInTheDocument();
  });
});

it('hides the trailing track at maximum without adding layout width', () => {
  const view = renderWithM3(<Meter value={100} />);
  const stop = view.container.querySelector('span')!;
  expect(stop.parentElement!.style.display).toBe('none');
  expect(stop.parentElement!.style.position).toBe('absolute');
});

it('normalizes invalid ranges and values before exposing meter semantics', () => {
  renderWithM3(<Meter value={NaN} min={Number.MAX_VALUE} max={-1} />);
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuemin', '0');
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuemax', '100');
});
