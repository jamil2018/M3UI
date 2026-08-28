import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Autocomplete, Combobox } from '../components/autocomplete.js';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
];

describe('Autocomplete', () => {
  it('renders autocomplete input', () => {
    renderWithM3(<Autocomplete options={options} label="Fruit" data-testid="ac" />);
    expect(screen.getByTestId('ac')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders combobox', () => {
    renderWithM3(<Combobox options={options} label="Combo" data-testid="cb" />);
    expect(screen.getByTestId('cb')).toBeInTheDocument();
  });
});
