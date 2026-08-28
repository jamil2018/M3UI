'use client';

import { M3Provider } from '@m3ui/react';
import { useEffect, useState, type ReactNode } from 'react';

const COMPONENTS = [
  'button',
  'icon-button',
  'fab',
  'checkbox',
  'radio',
  'switch',
  'text-field',
  'card',
  'list',
  'divider',
  'badge',
  'tooltip',
  'chip',
  'segmented-button',
  'slider',
  'menu',
  'select',
  'autocomplete',
  'progress',
  'loading-indicator',
  'snackbar',
  'meter',
  'top-app-bar',
  'bottom-app-bar',
  'navigation-bar',
  'navigation-rail',
  'navigation-drawer',
  'tabs',
  'search',
  'dialog',
  'bottom-sheet',
  'side-sheet',
  'carousel',
  'scaffold',
  'button-group',
  'split-button',
  'fab-menu',
  'toolbar',
  'date-input',
  'date-picker',
  'time-picker',
  'pane-scaffold',
  'adaptive-navigation',
  'shapes',
] as const;

export function componentPage(name: (typeof COMPONENTS)[number], title: string, demo: ReactNode) {
  return function ComponentPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <h1>{title}</h1>
        <p>M3 Expressive {title} — token-driven, built on Base UI primitives.</p>
        <section style={{ marginTop: 32 }}>
          <h2>Demo</h2>
          <M3Provider>{mounted ? demo : <div style={{ minHeight: 48 }} />}</M3Provider>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2>Accessibility</h2>
          <ul>
            <li>Keyboard navigable where applicable</li>
            <li>Uses semantic HTML via Base UI primitives</li>
            <li>State communicated to assistive technology</li>
          </ul>
        </section>
        <section style={{ marginTop: 32 }}>
          <h2>Install</h2>
          <pre style={{ padding: 16, borderRadius: 8, background: 'var(--md-sys-color-surface-container)', overflow: 'auto' }}>
            {`npx shadcn@latest add https://m3ui.dev/r/${name}.json`}
          </pre>
        </section>
      </main>
    );
  };
}

export { COMPONENTS };
