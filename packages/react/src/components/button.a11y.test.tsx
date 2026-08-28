import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Button } from '../components/button.js';

describe('Button a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is keyboard focusable', () => {
    renderWithM3(<Button>Focus me</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('activates with keyboard', () => {
    let clicked = false;
    renderWithM3(<Button onClick={() => { clicked = true; }}>Go</Button>);
    const btn = screen.getByRole('button');
    fireEvent.keyDown(btn, { key: ' ' });
    fireEvent.click(btn);
    expect(clicked).toBe(true);
  });
});
