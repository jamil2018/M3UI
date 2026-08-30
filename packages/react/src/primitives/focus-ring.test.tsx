import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FocusRing } from './focus-ring.js';

describe('FocusRing primitive', () => {
  afterEach(() => {
    document.getElementById('m3-focus-ring-styles')?.remove();
  });

  it('renders children inside the focus ring host', () => {
    render(
      <FocusRing>
        <button type="button">Focusable</button>
      </FocusRing>,
    );
    expect(screen.getByRole('button', { name: 'Focusable' })).toBeInTheDocument();
  });

  it('injects singleton focus ring styles with reduced-motion fallback', () => {
    render(
      <FocusRing>
        <button type="button">Focusable</button>
      </FocusRing>,
    );
    const style = document.getElementById('m3-focus-ring-styles');
    expect(style?.textContent).toContain('m3-focus-ring');
    expect(style?.textContent).toContain('prefers-reduced-motion: reduce');
    expect(style?.textContent).toContain('m3-focus-ring-outward-grow');
  });

  it('shows outward focus ring on focus-visible', () => {
    const matchesSpy = vi
      .spyOn(HTMLElement.prototype, 'matches')
      .mockImplementation(function (this: HTMLElement, selector: string) {
        if (selector === ':focus-visible') return true;
        return Element.prototype.matches.call(this, selector);
      });

    const { container } = render(
      <FocusRing>
        <button type="button">Focusable</button>
      </FocusRing>,
    );
    const button = screen.getByRole('button', { name: 'Focusable' });
    fireEvent.focusIn(button);
    const ring = container.querySelector('.m3-focus-ring');
    expect(ring?.getAttribute('data-visible')).toBe('true');
    expect(ring?.getAttribute('data-inward')).toBeNull();

    matchesSpy.mockRestore();
  });

  it('uses inward ring mode when inward prop is set', () => {
    const { container } = render(
      <FocusRing inward>
        <button type="button">Inward</button>
      </FocusRing>,
    );
    const ring = container.querySelector('.m3-focus-ring');
    expect(ring?.getAttribute('data-inward')).toBe('true');
  });

  it('hides ring on pointerdown', () => {
    const { container } = render(
      <FocusRing>
        <button type="button">Focusable</button>
      </FocusRing>,
    );
    const host = container.querySelector('.m3-focus-ring-host')!;
    fireEvent.pointerDown(host);
    const ring = container.querySelector('.m3-focus-ring');
    expect(ring?.getAttribute('data-visible')).not.toBe('true');
  });
});
