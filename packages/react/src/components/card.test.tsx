import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Card } from '../components/card.js';

describe('Card', () => {
  it('renders children', () => {
    renderWithM3(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it.each(['elevated', 'filled', 'outlined'] as const)('renders %s variant', (variant) => {
    renderWithM3(<Card variant={variant}>{variant}</Card>);
    expect(screen.getByText(variant)).toBeInTheDocument();
  });

  it('handles interactive click', () => {
    let clicked = false;
    renderWithM3(
      <Card interactive onClick={() => { clicked = true; }}>
        Tap
      </Card>,
    );
    fireEvent.click(screen.getByText('Tap'));
    expect(clicked).toBe(true);
  });
});
