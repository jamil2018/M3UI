import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { M3Provider, useM3 } from './m3-provider.js';

function Probe({ label }: { label: string }) {
  const { seed, resolvedScheme } = useM3();
  return <span data-testid={label}>{seed}:{resolvedScheme}</span>;
}

describe('M3Provider theme boundaries', () => {
  it('scopes variables and isolates nested themes', () => {
    const { container } = render(
      <M3Provider seed="#6750A4" scheme="light">
        <Probe label="outer" />
        <M3Provider seed="#006A6A" scheme="dark"><Probe label="inner" /></M3Provider>
      </M3Provider>,
    );
    const roots = container.querySelectorAll('[data-m3-root]');
    expect(roots).toHaveLength(2);
    expect((roots[0] as HTMLElement).style.getPropertyValue('--md-sys-color-primary')).not.toBe('');
    expect((roots[1] as HTMLElement).style.getPropertyValue('--md-sys-color-primary')).not.toBe(
      (roots[0] as HTMLElement).style.getPropertyValue('--md-sys-color-primary'),
    );
    expect(document.documentElement.style.getPropertyValue('--md-sys-color-primary')).toBe('');
  });

  it('synchronizes controlled theme props', async () => {
    const { rerender } = render(<M3Provider seed="#6750A4" scheme="light"><Probe label="theme" /></M3Provider>);
    rerender(<M3Provider seed="#006A6A" scheme="dark"><Probe label="theme" /></M3Provider>);
    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('#006A6A:dark'));
  });
});
