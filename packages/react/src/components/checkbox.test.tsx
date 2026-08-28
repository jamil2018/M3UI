import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Checkbox, CheckboxGroup } from '../components/checkbox.js';

describe('Checkbox', () => {
  it('renders with label', () => {
    renderWithM3(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('toggles on click', () => {
    renderWithM3(<Checkbox label="Option" defaultChecked={false} />);
    fireEvent.click(screen.getByText('Option'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders checkbox group', () => {
    renderWithM3(
      <CheckboxGroup defaultValue={[]}>
        <Checkbox label="A" value="a" />
        <Checkbox label="B" value="b" />
      </CheckboxGroup>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
