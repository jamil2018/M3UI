import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Fab, ExtendedFab } from '../components/fab.js';

describe('Fab', () => {
  it('renders fab with aria-label', () => {
    renderWithM3(<Fab aria-label="Create" icon="+" />);
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders extended fab with label', () => {
    renderWithM3(<ExtendedFab icon="+" label="Compose" />);
    expect(screen.getByRole('button', { name: /Compose/ })).toBeInTheDocument();
  });

  it('handles click', () => {
    let clicked = false;
    renderWithM3(<Fab aria-label="Add" icon="+" onClick={() => { clicked = true; }} />);
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });
});
