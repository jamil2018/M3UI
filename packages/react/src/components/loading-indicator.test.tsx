import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { LoadingIndicator } from '../components/loading-indicator.js';

describe('LoadingIndicator', () => {
  it('renders uncontained loader', () => {
    renderWithM3(<LoadingIndicator data-testid="loader" />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('renders contained loader', () => {
    renderWithM3(<LoadingIndicator contained data-testid="contained" />);
    expect(screen.getByTestId('contained')).toBeInTheDocument();
  });
});
