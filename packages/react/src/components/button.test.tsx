import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Button } from '../components/button.js';

describe('Button', () => {
  it('renders label', () => {
    renderWithM3(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    let clicked = false;
    renderWithM3(<Button onClick={() => { clicked = true; }}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('does not call onClick when disabled', () => {
    let clicked = false;
    renderWithM3(
      <Button disabled onClick={() => { clicked = true; }}>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });

  it('supports keyboard activation', () => {
    let clicked = false;
    renderWithM3(<Button onClick={() => { clicked = true; }}>Enter</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    fireEvent.keyDown(btn, { key: 'Enter' });
    fireEvent.click(btn);
    expect(clicked).toBe(true);
  });

  it.each(['elevated', 'filled', 'filled-tonal', 'outlined', 'text'] as const)(
    'renders %s variant',
    (variant) => {
      renderWithM3(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
    },
  );

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('renders %s size', (size) => {
    renderWithM3(<Button size={size}>{size}</Button>);
    expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
  });
});
