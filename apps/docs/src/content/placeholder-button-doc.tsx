'use client';

import Link from 'next/link';
import { M3Provider, PlaceholderButton } from '@m3ui/react';

export function PlaceholderButtonDocPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
      <p
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: 'var(--md-sys-color-error-container)',
          color: 'var(--md-sys-color-on-error-container)',
          marginBottom: 24,
        }}
      >
        <strong>Internal only.</strong> This registry entry exists for end-to-end install testing and is not part of
        the public component catalog.
      </p>
      <h1>Placeholder Button</h1>
      <p>
        A minimal stub component used to verify shadcn registry installs. Do not use in production UIs — prefer{' '}
        <Link href="/components/button" style={{ color: 'var(--md-sys-color-primary)' }}>
          Button
        </Link>
        .
      </p>
      <section style={{ marginTop: 32 }}>
        <h2>Demo</h2>
        <M3Provider>
          <PlaceholderButton>Example</PlaceholderButton>
        </M3Provider>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Install</h2>
        <pre
          style={{
            padding: 16,
            borderRadius: 8,
            background: 'var(--md-sys-color-surface-container)',
            overflow: 'auto',
          }}
        >
          {`npx shadcn@latest add https://m3ui.dev/r/placeholder-button.json`}
        </pre>
      </section>
    </main>
  );
}
