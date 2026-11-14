import { describe, it, expect, vi } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Progress, LinearProgress, CircularProgress } from '../components/progress.js';

const preference = vi.hoisted(() => ({ reduced: true }));

vi.mock('@m3ui/motion', async () => {
  const actual = await vi.importActual<typeof import('@m3ui/motion')>('@m3ui/motion');
  return {
    ...actual,
    prefersReducedMotion: () => preference.reduced,
  };
});

describe('Progress', () => {
  it('renders linear progress', () => {
    renderWithM3(<LinearProgress value={60} data-testid="linear" />);
    expect(screen.getByTestId('linear')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders wavy linear progress', () => {
    renderWithM3(<LinearProgress value={40} variant="wavy" data-testid="wavy" />);
    expect(screen.getByTestId('wavy')).toBeInTheDocument();
  });

  it('renders indeterminate linear progress', () => {
    renderWithM3(<LinearProgress indeterminate data-testid="indet" />);
    expect(screen.getByTestId('indet')).toBeInTheDocument();
  });

  it('renders circular progress', () => {
    renderWithM3(<CircularProgress value={75} data-testid="circular" />);
    expect(screen.getByTestId('circular')).toBeInTheDocument();
  });

  it('renders wavy circular progress', () => {
    renderWithM3(<CircularProgress value={50} variant="wavy" data-testid="wavy-c" />);
    expect(screen.getByTestId('wavy-c')).toBeInTheDocument();
  });

  it('Progress alias renders linear', () => {
    renderWithM3(<Progress value={30} data-testid="progress" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });
});

describe('Progress geometry', () => {
  it('uses the entire measured active segment and observes resizing', () => {
    const original = HTMLElement.prototype.getBoundingClientRect;
    let width = 100;
    HTMLElement.prototype.getBoundingClientRect = () => ({ width } as DOMRect);
    let resize: ResizeObserverCallback | undefined;
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe() {}
      disconnect = disconnect;
    });
    const view = renderWithM3(<LinearProgress variant="wavy" value={50} />);
    const svg = view.container.querySelector('svg')!;
    expect(svg.querySelector('path')!.getAttribute('d')).toContain('L 96.00 ');
    expect(svg.getAttribute('height')).toBe('10');
    width = 160;
    // ResizeObserver delivery is synchronous here, wrapped in React's update boundary.
    act(() => resize?.([], {} as ResizeObserver));
    expect(svg.querySelector('path')!.getAttribute('d')).toContain('L 156.00 ');
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
    HTMLElement.prototype.getBoundingClientRect = original;
    vi.unstubAllGlobals();
  });

  it('renders omitted values as visible indeterminate indicators', () => {
    const view = renderWithM3(<><LinearProgress /><CircularProgress /></>);
    for (const bar of screen.getAllByRole('progressbar')) {
      expect(bar).not.toHaveAttribute('aria-valuenow');
    }
    expect(view.container.querySelector('circle')!.getAttribute('stroke-dashoffset')).not.toBe('0');
  });

  it('keeps complete tracks inside their bounds and clamps invalid inputs', () => {
    const view = renderWithM3(<LinearProgress value={Infinity} max={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    view.rerender(<LinearProgress value={200} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(view.container.querySelector('span')!.parentElement!.style.display).toBe('none');
  });

  it('gives differently sized circular indicators their own rotation origins', () => {
    const view = renderWithM3(<><CircularProgress size={24} indeterminate /><CircularProgress size={80} indeterminate /></>);
    const circles = view.container.querySelectorAll('svg > circle:last-of-type');
    expect((circles[0] as SVGElement).style.transformOrigin).toBe('12px 12px');
    expect((circles[1] as SVGElement).style.transformOrigin).toBe('40px 40px');
    for (const style of view.container.querySelectorAll('style')) expect(style.textContent).not.toContain('transform-origin');
  });
});

it('preserves the circular size token while scaling its SVG geometry', () => {
  const view = renderWithM3(<CircularProgress value={40} />);
  expect((screen.getByRole('progressbar') as HTMLElement).style.width).toContain('--md-comp-circular-progress-indicator-size');
  expect(view.container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 40 40');
  expect(view.container.querySelector('svg')).toHaveAttribute('width', '100%');
});


it('responds to preference changes while circular indeterminate progress is mounted', () => {
  const listeners = new Set<() => void>();
  const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: preference.reduced,
    media: query,
    addEventListener: (_type: string, listener: () => void) => { if (query.includes('reduced-motion')) listeners.add(listener); },
    removeEventListener: (_type: string, listener: () => void) => { if (query.includes('reduced-motion')) listeners.delete(listener); },
  } as unknown as MediaQueryList));
  preference.reduced = false;
  const view = renderWithM3(<CircularProgress indeterminate />);
  const circle = view.container.querySelector('svg > circle:last-of-type') as SVGElement;
  expect(circle.style.animation).toContain('m3-progress-spin');
  act(() => { preference.reduced = true; listeners.forEach((listener) => listener()); });
  expect(circle.style.animation).toBe('');
  view.unmount();
  expect(listeners.size).toBe(0);
  matchMedia.mockRestore();
});
