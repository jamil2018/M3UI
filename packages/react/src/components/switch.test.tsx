import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Switch } from '../components/switch.js';

describe('Switch', () => {
  it('renders with label', () => {
    renderWithM3(<Switch label="Wi-Fi" />);
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
  });

  it('toggles on click', () => {
    renderWithM3(<Switch label="Dark mode" defaultChecked={false} />);
    fireEvent.click(screen.getByText('Dark mode'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
