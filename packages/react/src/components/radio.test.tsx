import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Radio, RadioGroup } from '../components/radio.js';

describe('Radio', () => {
  it('renders radio group', () => {
    renderWithM3(
      <RadioGroup defaultValue="a" name="test">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('selects radio on click', () => {
    renderWithM3(
      <RadioGroup defaultValue="a" name="pick">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
  });
});
