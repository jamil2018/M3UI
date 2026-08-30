import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DemoPreview } from '@/components/demo-preview';
import { baseOptions } from '@/lib/layout.shared';

const START_LINKS = [
  {
    href: '/components',
    title: 'Browse components',
    description: 'Inspect variants, states, accessibility, source mapping, and live behavior.',
  },
  {
    href: '/tokens',
    title: 'Understand the foundations',
    description: 'Use the same color, typography, shape, elevation, and motion language.',
  },
  {
    href: '/guides/rsc',
    title: 'Ship with React',
    description: 'Follow server component, client boundary, theming, and registry guidance.',
  },
] as const;

export default function HomePage() {
  return (
    <HomeLayout {...baseOptions()} id="nd-home-layout">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-8 md:py-14">
        <header className="docs-landing-hero">
          <div className="docs-landing-hero-copy">
            <p className="docs-landing-kicker">Material 3 Expressive for React</p>
            <h1>Build interfaces with feeling.</h1>
            <p>
              Token-driven React components with expressive shape, purposeful motion, dynamic
              color, and accessible interaction built in.
            </p>
            <div className="docs-landing-actions">
              <Link href="/components" className="docs-landing-primary-action">Explore components</Link>
              <Link href="/tokens" className="docs-landing-secondary-action">View foundations</Link>
            </div>
          </div>
          <div className="docs-landing-facts" aria-label="Library facts">
            <div><strong>44</strong><span>registry components</span></div>
            <div><strong>4</strong><span>contrast modes</span></div>
            <div><strong>1.0</strong><span>conformance contract</span></div>
          </div>
        </header>

        <section className="docs-section docs-landing-paths">
          <h2>Find your path</h2>
          <div className="docs-landing-path-list">
            {START_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="docs-landing-path">
                <span className="docs-landing-path-title">{link.title}</span>
                <span className="docs-landing-path-description">{link.description}</span>
                <span aria-hidden className="docs-landing-path-arrow">Go</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="docs-section">
          <h2>Feel the system</h2>
          <p className="docs-section-intro">Change seed, scheme, and contrast. The preview is scoped, so documentation chrome stays stable.</p>
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

        <p className="docs-disclaimer">
          M3UI is an unofficial open-source project. It is not affiliated with or endorsed by
          Google. Material is a trademark of Google LLC.
        </p>
      </main>
    </HomeLayout>
  );
}
