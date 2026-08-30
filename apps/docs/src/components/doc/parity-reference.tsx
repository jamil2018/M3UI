import Link from 'next/link';
import { getComponentParityNote } from '@/content/components';
import {
  getParityTier,
  REFERENCE_LABELS,
  type ParityTier,
} from '@/lib/parity-tiers';
import { DocSection } from './doc-section';

const GITHUB_PARITY_MD = 'https://github.com/m3ui/m3ui/blob/main/docs/PARITY.md';

/** Per-component upstream reference tier — complementary to the catalog conformance block. */
export function ParityReference({ slug }: { slug: string }) {
  const tierInfo = getParityTier(slug);
  const note = getComponentParityNote(slug);

  return (
    <DocSection
      id="parity"
      title="Material Web parity"
      description="How this component is measured against upstream Material Web — scoped by reference tier."
    >
      <dl className="doc-compliance-grid">
        <div>
          <dt>Parity tier</dt>
          <dd>
            <ParityTierBadge tier={tierInfo.tier} label={tierInfo.title} />
          </dd>
        </div>
        <div>
          <dt>Upstream reference</dt>
          <dd>{REFERENCE_LABELS[tierInfo.reference]}</dd>
        </div>
        <div className="doc-compliance-wide">
          <dt>What this tier means</dt>
          <dd>{tierInfo.summary}</dd>
        </div>
        {note ? (
          <div className="doc-compliance-wide">
            <dt>Component note</dt>
            <dd>{note}</dd>
          </div>
        ) : null}
        <div className="doc-compliance-wide">
          <dt>Learn more</dt>
          <dd>
            <Link href="/foundations/parity">Parity tiers and gates</Link>
            {' · '}
            <a href={GITHUB_PARITY_MD} rel="noopener noreferrer" target="_blank">
              PARITY.md report
            </a>
          </dd>
        </div>
      </dl>
    </DocSection>
  );
}

function ParityTierBadge({ tier, label }: { tier: ParityTier; label: string }) {
  return (
    <strong className="doc-parity-tier" data-tier={tier}>
      {label}
    </strong>
  );
}
