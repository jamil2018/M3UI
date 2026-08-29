import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DemoPreview } from '@/components/demo-preview';
import { baseOptions } from '@/lib/layout.shared';

const START_LINKS = [
  {
    href: '/',
    title: 'Getting Started',
    description: 'Install M3UI, initialize tokens, and add your first registry component.',
  },
  {
    href: '/components',
    title: 'Components',
    description: 'Browse the full Material 3 Expressive component catalog.',
  },
  {
    href: '/tokens',
    title: 'Tokens',
    description: 'Color roles, typography, shape, elevation, and state layers.',
  },
  {
    href: '/guides/rsc',
    title: 'Guides',
    description: 'React Server Components, client boundaries, and hydration notes.',
  },
] as const;

export default function HomePage() {
  return (
    <HomeLayout {...baseOptions()} id="nd-home-layout">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12 md:px-8 md:py-16">
        <header className="docs-landing-hero">
          <h1>M3UI</h1>
          <p>
            Material Design 3 Expressive components for React — built on Base UI, Tailwind v4, and
            Motion.
          </p>
          <div className="docs-disclaimer">
            <strong>Disclaimer:</strong> This is an unofficial open-source project. Not affiliated
            with or endorsed by Google. &quot;Material&quot; is a trademark of Google LLC.
          </div>
        </header>

        <section className="docs-section">
          <h2>Explore</h2>
          <div className="docs-landing-grid">
            {START_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="docs-card">
                <div className="docs-card-title">{link.title}</div>
                <p className="docs-card-description">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="docs-section">
          <h2>Live Preview</h2>
          <DemoPreview />
        </section>

        <section className="docs-section">
          <h2>Quick Start</h2>
          <pre className="docs-code-block">
            {`pnpm add @m3ui/react @m3ui/tokens @m3ui/color
npx m3ui init --seed "#6750A4"
npx shadcn@latest add https://m3ui.dev/r/button.json`}
          </pre>
        </section>
      </main>
    </HomeLayout>
  );
}
