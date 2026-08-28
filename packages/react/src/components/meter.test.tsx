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
