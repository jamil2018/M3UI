import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Autocomplete } from '../components/autocomplete.js';

describe('Autocomplete a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(
      <Autocomplete options={[{ value: 'a', label: 'A' }]} label="Search" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is keyboard focusable', () => {
    renderWithM3(<Autocomplete options={[{ value: 'a', label: 'A' }]} />);
    const input = screen.getByRole('combobox');
    input.focus();
    expect(document.activeElement).toBe(input);
  });
});
