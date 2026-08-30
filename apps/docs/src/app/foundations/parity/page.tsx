import { existsSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { FoundationPage } from '@/components/foundation-page';
import { PARITY_TIER_EXPLANATIONS, PARITY_TIER_SUMMARY } from '@/lib/parity-tiers';

const REPO_ROOT = path.join(process.cwd(), '../..');
const PARITY_MD_PATH = path.join(REPO_ROOT, 'docs/PARITY.md');
const PARITY_JSON_PATH = path.join(REPO_ROOT, 'docs/parity.json');
const GITHUB_PARITY_MD = 'https://github.com/m3ui/m3ui/blob/main/docs/PARITY.md';

export default function ParityPage() {
  const parityReportAvailable = existsSync(PARITY_MD_PATH);
  const parityJsonAvailable = existsSync(PARITY_JSON_PATH);

  return (
    <FoundationPage
      title="Material Web parity"
      description="How M3UI measures equivalence with upstream Material Web — honestly scoped by reference tier."
      sections={[
        {
          title: 'Three reference tiers',
          body: (
            <ul>
              <li>
                <strong>{PARITY_TIER_EXPLANATIONS.A.title}</strong> ({PARITY_TIER_SUMMARY.A.count}{' '}
                components) — {PARITY_TIER_EXPLANATIONS.A.summary}
              </li>
              <li>
                <strong>{PARITY_TIER_EXPLANATIONS.B.title}</strong> ({PARITY_TIER_SUMMARY.B.count}{' '}
                components) — {PARITY_TIER_EXPLANATIONS.B.summary}
              </li>
              <li>
                <strong>{PARITY_TIER_EXPLANATIONS.C.title}</strong> —{' '}
                {PARITY_TIER_EXPLANATIONS.C.summary}
              </li>
            </ul>
          ),
        },
        {
          title: 'What parity measures',
          body: (
            <p>
              Parity is enforced on tokens, resolved default values, visuals, motion, and accessibility —
              not on mirroring custom-elements.json APIs. React-idiomatic props and composition stay ours.
            </p>
          ),
        },
        {
          title: 'Generated report',
          body: (
            <>
              <p>
                Run <code>pnpm spec:parity</code> after spec sync to produce{' '}
                <code>docs/PARITY.md</code> and <code>docs/parity.json</code>. CI fails Tier A
                components with missing upstream tokens not on an explicit reviewed allowlist.
              </p>
              {parityReportAvailable ? (
                <p>
                  <a href={GITHUB_PARITY_MD} rel="noopener noreferrer" target="_blank">
                    View PARITY.md
                  </a>
                  {parityJsonAvailable ? (
                    <>
                      {' · '}
                      <Link href="/migration/expressive-v1">Migration notes</Link>
                    </>
                  ) : null}
                </p>
              ) : (
                <p>
                  <em>PARITY.md is not generated in this checkout yet.</em> Run{' '}
                  <code>pnpm spec:parity</code> locally, or follow the{' '}
                  <a href={GITHUB_PARITY_MD} rel="noopener noreferrer" target="_blank">
                    repo template
                  </a>{' '}
                  once the report lands on main.
                </p>
              )}
            </>
          ),
        },
        {
          title: 'Tier A components',
          body: <p>{PARITY_TIER_SUMMARY.A.components.join(', ')}</p>,
        },
        {
          title: 'Tier B components',
          body: <p>{PARITY_TIER_SUMMARY.B.components.join(', ')}</p>,
        },
        {
          title: 'Merge coordination',
          body: (
            <p>
              Parallel workers land spec sync, primitives, motion, and per-tier remediation independently.
              See <code>docs/PARITY-SYNC.md</code> in the repository for merge order and conflict hotspots.
            </p>
          ),
        },
      ]}
    />
  );
}
