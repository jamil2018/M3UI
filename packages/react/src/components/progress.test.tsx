import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Progress, LinearProgress, CircularProgress } from '../components/progress.js';

vi.mock('@m3ui/motion', async () => {
  const actual = await vi.importActual<typeof import('@m3ui/motion')>('@m3ui/motion');
  return {
    ...actual,
    prefersReducedMotion: () => true,
  };
});

describe('Progress', () => {
  it('renders linear progress', () => {
    renderWithM3(<LinearProgress value={60} data-testid="linear" />);
    expect(screen.getByTestId('linear')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders wavy linear progress', () => {
    renderWithM3(<LinearProgress value={40} variant="wavy" data-testid="wavy" />);
    expect(screen.getByTestId('wavy')).toBeInTheDocument();
  });

  it('renders indeterminate linear progress', () => {
    renderWithM3(<LinearProgress indeterminate data-testid="indet" />);
    expect(screen.getByTestId('indet')).toBeInTheDocument();
  });

  it('renders circular progress', () => {
    renderWithM3(<CircularProgress value={75} data-testid="circular" />);
    expect(screen.getByTestId('circular')).toBeInTheDocument();
  });

  it('renders wavy circular progress', () => {
    renderWithM3(<CircularProgress value={50} variant="wavy" data-testid="wavy-c" />);
    expect(screen.getByTestId('wavy-c')).toBeInTheDocument();
  });

  it('Progress alias renders linear', () => {
    renderWithM3(<Progress value={30} data-testid="progress" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });
});
