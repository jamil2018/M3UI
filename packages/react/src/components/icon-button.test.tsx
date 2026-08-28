import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { IconButton } from '../components/icon-button.js';

describe('IconButton', () => {
  it('renders with aria-label', () => {
    renderWithM3(<IconButton aria-label="Settings" icon="⚙" />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('handles click', () => {
    let clicked = false;
    renderWithM3(
      <IconButton aria-label="Add" icon="+" onClick={() => { clicked = true; }} />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });
});
