import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { LoadingIndicator } from '../components/loading-indicator.js';

vi.mock('@m3ui/motion', async () => {
  const actual = await vi.importActual<typeof import('@m3ui/motion')>('@m3ui/motion');
  return {
    ...actual,
    prefersReducedMotion: () => true,
  };
});

describe('LoadingIndicator a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<LoadingIndicator />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has status role', () => {
    renderWithM3(<LoadingIndicator />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });
});
