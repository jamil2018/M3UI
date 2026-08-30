import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { STATE_LAYER_OPACITIES } from '@m3ui/tokens';
import { Ripple } from './ripple.js';

describe('Ripple primitive', () => {
  afterEach(() => {
    document.getElementById('m3-ripple-styles')?.remove();
  });

  it('renders children inside the ripple host', () => {
    render(
      <Ripple>
        <button type="button">Press</button>
      </Ripple>,
    );
    expect(screen.getByRole('button', { name: 'Press' })).toBeInTheDocument();
  });

  it('injects singleton ripple styles using state-layer opacities', () => {
    render(
      <Ripple>
        <span>Target</span>
      </Ripple>,
    );
    const style = document.getElementById('m3-ripple-styles');
    expect(style?.textContent).toContain('m3-ripple-host');
    expect(style?.textContent).toContain(String(STATE_LAYER_OPACITIES.hover));
    expect(style?.textContent).toContain(String(STATE_LAYER_OPACITIES.pressed));
    expect(style?.textContent).toContain('forced-colors: active');
  });

  it('omits ripple surface when disabled', () => {
    const { container } = render(
      <Ripple disabled>
        <span>Disabled</span>
      </Ripple>,
    );
    expect(container.querySelector('.m3-ripple-surface')).toBeNull();
    expect(container.querySelector('[data-disabled="true"]')).not.toBeNull();
  });

  it('sets ripple color CSS variables from the color prop', () => {
    const { container } = render(
      <Ripple color="var(--md-sys-color-primary)">
        <span>Colored</span>
      </Ripple>,
    );
    const surface = container.querySelector('.m3-ripple-surface') as HTMLElement | null;
    expect(surface?.style.getPropertyValue('--m3-ripple-hover-color')).toBe(
      'var(--md-sys-color-primary)',
    );
  });
});
