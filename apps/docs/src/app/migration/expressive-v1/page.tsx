import Link from 'next/link';
import { FoundationPage } from '@/components/foundation-page';
import { PARITY_TIER_EXPLANATIONS, PARITY_TIER_SUMMARY } from '@/lib/parity-tiers';

export default function MigrationPage() {
  return (
    <FoundationPage
      title="Expressive major release"
      description="Breaking changes that replace inaccurate defaults with a measurable Material 3 Expressive contract."
      sections={[
        {
          title: 'Provider scoping',
          body: (
            <p>
              Theme variables now apply to the M3Provider boundary. Nested themes no longer modify the
              document root.
            </p>
          ),
        },
        {
          title: 'Theme roles',
          body: (
            <p>
              Modern fixed, fixed-dim, on-fixed, and surface-tint roles are exported by the color package.
            </p>
          ),
        },
        {
          title: 'Material Web parity',
          body: (
            <>
              <p>
                Every public component is classified into a reference tier so parity claims stay measurable
                instead of blanket. See{' '}
                <Link href="/foundations/parity">Material Web parity</Link> for the full model and generated
                report workflow.
              </p>
              <ul>
                <li>
                  <strong>{PARITY_TIER_EXPLANATIONS.A.title}</strong> —{' '}
                  {PARITY_TIER_EXPLANATIONS.A.summary}
                </li>
                <li>
                  <strong>{PARITY_TIER_EXPLANATIONS.B.title}</strong> —{' '}
                  {PARITY_TIER_EXPLANATIONS.B.summary}
                </li>
                <li>
                  <strong>{PARITY_TIER_EXPLANATIONS.C.title}</strong> —{' '}
                  {PARITY_TIER_EXPLANATIONS.C.summary}
                </li>
              </ul>
              <p>
                Tier A ({PARITY_TIER_SUMMARY.A.count}) and Tier B ({PARITY_TIER_SUMMARY.B.count}) slugs are
                listed on the parity foundations page. Component doc pages show each slug&apos;s tier and
                upstream reference inline.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
