import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Radio, RadioGroup } from '../components/radio.js';

describe('Radio a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(
      <RadioGroup defaultValue="a" name="plan">
        <Radio value="a" label="Free" />
        <Radio value="b" label="Pro" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports arrow key navigation between radios', () => {
    renderWithM3(
      <RadioGroup defaultValue="a" name="size">
        <Radio value="a" label="Small" />
        <Radio value="b" label="Large" />
      </RadioGroup>,
    );
    const first = screen.getByRole('radio', { name: 'Small' });
    first.focus();
    expect(document.activeElement).toBe(first);
  });
});
