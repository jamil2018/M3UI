import Link from 'next/link';
import { RscClientDemo } from './rsc-client-demo';

/**
 * Server Component page — demonstrates RSC-safe patterns for @m3ui/react.
 * Types and static metadata can be imported on the server; interactive components
 * must live in a Client Component boundary.
 */
export default function RscGuidePage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
      <nav style={{ marginBottom: 24 }}>
        <Link href="/">← Home</Link>
      </nav>

      <h1 style={{ fontSize: 32, marginBottom: 16 }}>React Server Components</h1>

      <section style={{ marginBottom: 32 }}>
        <h2>Client boundary</h2>
        <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
          Every <code>@m3ui/react</code> runtime export ships with a{' '}
          <code>&quot;use client&quot;</code> banner. Import components only from Client
          Components (or lazy client boundaries). Server Components may import{' '}
          <strong>types</strong> via <code>import type</code>.
        </p>
        <pre
          style={{
            padding: 16,
            borderRadius: 8,
            background: 'var(--md-sys-color-surface-container)',
            overflow: 'auto',
            fontSize: 13,
          }}
        >
          {`// app/page.tsx — Server Component
import type { ButtonProps } from '@m3ui/react';
import { M3ClientShell } from './m3-client-shell';

export default function Page() {
  const props: ButtonProps = { children: 'Save' };
  return <M3ClientShell button={props} />;
}

// app/m3-client-shell.tsx — Client Component
'use client';
import { M3Provider, Button } from '@m3ui/react';
import type { ButtonProps } from '@m3ui/react';

export function M3ClientShell({ button }: { button: ButtonProps }) {
  return (
    <M3Provider seed="#6750A4">
      <Button {...button} />
    </M3Provider>
  );
}`}
        </pre>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>Subpath exports</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <code>@m3ui/react/provider</code> — M3Provider + theme hooks (client)
          </li>
          <li>
            <code>@m3ui/react/primitives</code> — StateLayer, Ripple, Surface (client)
          </li>
          <li>
            <code>@m3ui/tokens</code> — CSS only, safe to import in Server Components
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>Hydration notes</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            Wrap adaptive layout (<code>WindowSizeClassProvider</code>,{' '}
            <code>AdaptiveNavigation</code>) in Client Components — they read{' '}
            <code>window</code> after mount.
          </li>
          <li>
            Prefer <code>scheme=&quot;system&quot;</code> on <code>M3Provider</code>; color
            scheme resolves client-side to avoid light/dark flash.
          </li>
          <li>
            Date/time pickers portal overlays client-side only — do not render picker modals in
            RSC trees without a client wrapper.
          </li>
        </ul>
      </section>

      <section>
        <h2>Live demo (client boundary)</h2>
        <RscClientDemo />
      </section>
    </main>
  );
}
