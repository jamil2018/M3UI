import { describe, it, expect } from 'vitest';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Divider } from '../components/divider.js';

describe('Divider', () => {
  it('renders horizontal divider', () => {
    const { container } = renderWithM3(<Divider data-testid="div" />);
    expect(container.querySelector('[data-testid="div"]')).toBeInTheDocument();
  });

  it('renders vertical divider', () => {
    const { container } = renderWithM3(<Divider vertical data-testid="vdiv" />);
    expect(container.querySelector('[data-testid="vdiv"]')).toBeInTheDocument();
  });
});
