import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { TextField } from '../components/text-field.js';

describe('TextField a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<TextField label="Username" supportingText="Required" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('input is keyboard focusable', () => {
    renderWithM3(<TextField label="Email" />);
    const input = screen.getByRole('textbox');
    input.focus();
    expect(document.activeElement).toBe(input);
  });
});
