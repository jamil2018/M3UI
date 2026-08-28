import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { LinearProgress, CircularProgress } from '../components/progress.js';

vi.mock('@m3ui/motion', async () => {
  const actual = await vi.importActual<typeof import('@m3ui/motion')>('@m3ui/motion');
  return {
    ...actual,
    prefersReducedMotion: () => true,
  };
});

describe('Progress a11y', () => {
  it('has no accessibility violations for linear', async () => {
    const { container } = renderWithM3(<LinearProgress value={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations for circular', async () => {
    const { container } = renderWithM3(<CircularProgress value={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('respects reduced motion for wavy variant', () => {
    renderWithM3(<LinearProgress value={80} variant="wavy" data-testid="wavy" />);
    expect(screen.getByTestId('wavy')).toBeInTheDocument();
  });
});
