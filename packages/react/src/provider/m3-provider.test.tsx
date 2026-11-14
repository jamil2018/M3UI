import { createPortal } from 'react-dom';
import { type CSSProperties } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createTheme } from '@m3ui/color';
import { M3Provider, M3PortalScope, useM3 } from './m3-provider.js';

function Probe({ label }: { label: string }) {
  const { seed, resolvedScheme } = useM3();
  return (
    <span data-testid={label}>
      {seed}:{resolvedScheme}
    </span>
  );
}

function PortalProbe() {
  return createPortal(
    <M3PortalScope>
      <span data-testid="portaled">Portal</span>
    </M3PortalScope>,
    document.body,
  );
}

describe('M3Provider theme boundaries', () => {
  it('carries nested theme, inherited custom tokens, direction and live overrides to body portals', async () => {
    const view = (token: string) => (
      <M3Provider scheme="light" style={{ '--custom-token': token } as CSSProperties}>
        <M3Provider seed="#006A6A" scheme="dark" direction="rtl">
          <PortalProbe />
        </M3Provider>
      </M3Provider>
    );
    const { rerender } = render(view('first'));
    const scope = screen.getByTestId('portaled').parentElement!;
    expect(scope.parentElement).toBe(document.body);
    expect(scope.style.display).toBe('contents');
    expect(scope.style.colorScheme).toBe('dark');
    expect(scope.dir).toBe('rtl');
    expect(scope.style.getPropertyValue('--m3-color-primary')).toBe(
      createTheme({ seed: '#006A6A', variant: 'expressive', isDark: true }).colors.primary,
    );
    expect(scope.style.getPropertyValue('--custom-token')).toBe('first');
    rerender(view('updated'));
    await waitFor(() => expect(scope.style.getPropertyValue('--custom-token')).toBe('updated'));
  });
  it('scopes variables and isolates nested themes', () => {
    const outerTheme = createTheme({ seed: '#6750A4', variant: 'expressive', isDark: false });
    const innerTheme = createTheme({ seed: '#006A6A', variant: 'expressive', isDark: true });

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
