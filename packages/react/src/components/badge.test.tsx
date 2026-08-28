import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Badge } from '../components/badge.js';

describe('Badge', () => {
  it('renders dot badge', () => {
    const { container } = renderWithM3(<Badge variant="dot" data-testid="dot" />);
    expect(container.querySelector('[data-testid="dot"]')).toBeInTheDocument();
  });

  it('renders numbered badge', () => {
    renderWithM3(<Badge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('caps overflow count', () => {
    renderWithM3(<Badge count={150} max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('hides when count is zero', () => {
    const { container } = renderWithM3(<Badge count={0} />);
    expect(container.textContent).toBe('');
  });
});
