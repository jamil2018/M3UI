'use client';

import { M3Provider } from '@m3ui/react';
import { RootProvider } from 'fumadocs-ui/provider';
import { useTheme } from 'next-themes';
import { useEffect, type ReactNode } from 'react';

function M3ThemeBridge({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const scheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (!resolvedTheme) return;
    document.documentElement.dataset.m3Scheme = scheme;
  }, [resolvedTheme, scheme]);

  return (
    <M3Provider scheme={scheme} seed="#6750A4">
      {children}
    </M3Provider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        options: {
          api: '/api/search',
        },
      }}
      theme={{
        defaultTheme: 'system',
        enableSystem: true,
        attribute: 'class',
        disableTransitionOnChange: true,
      }}
    >
      <M3ThemeBridge>{children}</M3ThemeBridge>
    </RootProvider>
  );
}
