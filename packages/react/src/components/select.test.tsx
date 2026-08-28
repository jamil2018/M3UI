import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Select, ExposedDropdownMenu } from '../components/select.js';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('renders select trigger', () => {
    renderWithM3(<Select options={options} label="Choose" data-testid="select" />);
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('opens options on click', async () => {
    renderWithM3(<Select options={options} defaultValue="a" />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('option', { name: 'Option B' })).toBeInTheDocument();
  });

  it('ExposedDropdownMenu is an alias', () => {
    renderWithM3(<ExposedDropdownMenu options={options} data-testid="edm" />);
    expect(screen.getByTestId('edm')).toBeInTheDocument();
  });
});
