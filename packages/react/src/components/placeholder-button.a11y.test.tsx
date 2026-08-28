import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { M3Provider } from '../provider/m3-provider.js';
import { PlaceholderButton } from '../components/placeholder-button.js';

describe('PlaceholderButton a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <M3Provider>
        <PlaceholderButton>Click me</PlaceholderButton>
      </M3Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders button text', () => {
    render(
      <M3Provider>
        <PlaceholderButton>Click me</PlaceholderButton>
      </M3Provider>,
    );
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
