import Link from 'next/link';
import { DemoPreview } from '@/components/demo-preview';
import { TokenTable } from '@/components/token-table';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>M3UI</h1>
        <p style={{ fontSize: 18, opacity: 0.8 }}>
          Material Design 3 Expressive components for React — built on Base UI, Tailwind v4, and
          Motion.
        </p>
        <p
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 8,
            background: 'var(--md-sys-color-surface-container-high)',
            fontSize: 14,
          }}
        >
          <strong>Disclaimer:</strong> This is an unofficial open-source project. Not affiliated
          with or endorsed by Google. &quot;Material&quot; is a trademark of Google LLC.
        </p>
      </header>

      <nav style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <Link href="/">Home</Link>
        <Link href="/tokens">Tokens</Link>
        <Link href="/components/button">Components</Link>
        <Link href="/guides/rsc">RSC guide</Link>
        <Link href="/registry.json">Registry</Link>
      </nav>

      <section style={{ marginBottom: 48 }}>
        <h2>Live Preview</h2>
        <DemoPreview />
      </section>

      <section>
        <h2>Quick Start</h2>
        <pre
          style={{
            padding: 16,
            borderRadius: 8,
            background: 'var(--md-sys-color-surface-container)',
            overflow: 'auto',
          }}
        >
          {`pnpm add @m3ui/react @m3ui/tokens @m3ui/color
npx m3ui init --seed "#6750A4"
npx shadcn@latest add https://m3ui.dev/r/placeholder-button.json`}
        </pre>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2>State Layer Tokens</h2>
        <TokenTable />
      </section>
    </main>
  );
}
