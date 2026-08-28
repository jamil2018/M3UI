import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { Chip } from '../components/chip.js';

describe('Chip a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Chip type="assist" label="Accessible" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is keyboard focusable', () => {
    renderWithM3(<Chip type="assist" label="Focus" />);
    const chip = screen.getByRole('button');
    chip.focus();
    expect(document.activeElement).toBe(chip);
  });

  it('renders correctly in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <Chip type="assist" label="RTL" leadingIcon="★" />
      </M3Provider>,
    );
    expect(screen.getByRole('button', { name: /RTL/ })).toBeInTheDocument();
  });
});
