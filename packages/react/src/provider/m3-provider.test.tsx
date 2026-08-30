import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createTheme } from '@m3ui/color';
import { M3Provider, useM3 } from './m3-provider.js';

function Probe({ label }: { label: string }) {
  const { seed, resolvedScheme } = useM3();
  return <span data-testid={label}>{seed}:{resolvedScheme}</span>;
}

describe('M3Provider theme boundaries', () => {
  it('scopes variables and isolates nested themes', () => {
    const outerTheme = createTheme({ seed: '#6750A4', isDark: false });
    const innerTheme = createTheme({ seed: '#006A6A', isDark: true });

    const { container } = render(
      <M3Provider seed="#6750A4" scheme="light">
        <Probe label="outer" />
        <M3Provider seed="#006A6A" scheme="dark">
          <Probe label="inner" />
        </M3Provider>
      </M3Provider>,
    );

    const roots = container.querySelectorAll('[data-m3-root]');
    expect(roots).toHaveLength(2);

    const outerPrimary = outerTheme.m3ColorVars['--m3-color-primary'];
    const innerPrimary = innerTheme.m3ColorVars['--m3-color-primary'];
    expect(outerPrimary).not.toBe(innerPrimary);

    expect((roots[0] as HTMLElement).style.cssText).toContain(outerPrimary);
    expect((roots[1] as HTMLElement).style.cssText).toContain(innerPrimary);
    expect(document.documentElement.style.getPropertyValue('--md-sys-color-primary')).toBe('');

    expect(screen.getByTestId('outer')).toHaveTextContent('#6750A4:light');
    expect(screen.getByTestId('inner')).toHaveTextContent('#006A6A:dark');
  });

  it('synchronizes controlled theme props', async () => {
    const { rerender } = render(
      <M3Provider seed="#6750A4" scheme="light">
        <Probe label="theme" />
      </M3Provider>,
    );
    rerender(
      <M3Provider seed="#006A6A" scheme="dark">
        <Probe label="theme" />
      </M3Provider>,
    );
    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('#006A6A:dark'));
  });
});