import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Chip, ChipSet, FilterChipGroup } from '../components/chip.js';

describe('Chip', () => {
  it.each(['assist', 'filter', 'input', 'suggestion'] as const)('renders %s chip', (type) => {
    renderWithM3(<Chip type={type} label={type} />);
    expect(screen.getByRole('button', { name: type })).toBeInTheDocument();
  });

  it('renders elevated assist chip', () => {
    renderWithM3(<Chip type="assist" label="Elevated" elevated />);
    expect(screen.getByRole('button', { name: 'Elevated' })).toBeInTheDocument();
  });

  it('calls onRemove for input chip', () => {
    let removed = false;
    renderWithM3(<Chip type="input" label="Tag" onRemove={() => { removed = true; }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(removed).toBe(true);
  });

  it('toggles filter chip selection', () => {
    renderWithM3(<Chip type="filter" label="Filter" defaultSelected />);
    const chip = screen.getByRole('button', { name: 'Filter' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('wraps chips in ChipSet', () => {
    renderWithM3(
      <ChipSet data-testid="chip-set">
        <Chip label="A" />
        <Chip label="B" />
      </ChipSet>,
    );
    expect(screen.getByTestId('chip-set')).toBeInTheDocument();
  });

  it('renders FilterChipGroup', () => {
    renderWithM3(
      <FilterChipGroup defaultValue={['a']} multiple data-testid="filter-group">
        <Chip type="filter" label="A" value="a" />
        <Chip type="filter" label="B" value="b" />
      </FilterChipGroup>,
    );
    expect(screen.getByTestId('filter-group')).toBeInTheDocument();
  });
});
