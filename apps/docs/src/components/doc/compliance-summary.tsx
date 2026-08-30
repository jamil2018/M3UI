import type { ComponentConformance } from '@/lib/catalog';

const SOURCE_LABELS = {
  'material-tokens': 'Official Material tokens',
  'material-web': 'Material Web behavior',
  'android-expressive': 'Android Expressive reference',
  'm3ui-web-adaptation': 'M3UI browser adaptation',
} as const;

/** Catalog conformance block — status, sources, and measured token diff when present. */
export function ComplianceSummary({ conformance }: { conformance: ComponentConformance }) {
  const parity = conformance.parity;
  const residual = parity?.residualDiff;

  return (
    <section className="doc-compliance" aria-labelledby="compliance-title">
      <div>
        <p className="doc-compliance-label">Conformance contract {conformance.version}</p>
        <h2 id="compliance-title">Expressive implementation</h2>
        <p>
          Token-first implementation with measurable Material Web parity where an upstream reference
          exists. Browser interaction constraints are recorded as explicit adaptations.
        </p>
      </div>
      <dl className="doc-compliance-grid">
        <div>
          <dt>Status</dt>
          <dd>{conformance.status}</dd>
        </div>
        <div>
          <dt>Modes</dt>
          <dd>RTL · reduced motion · forced colors</dd>
        </div>
        {parity ? (
          <>
            <div>
              <dt>Upstream version</dt>
              <dd>{parity.upstreamVersion}</dd>
            </div>
            {residual ? (
              <div>
                <dt>Token diff</dt>
                <dd>
                  {residual.missing.length} missing · {residual.extra.length} extra ·{' '}
                  {residual.drifted.length} drifted
                </dd>
              </div>
            ) : null}
          </>
        ) : null}
        <div className="doc-compliance-wide">
          <dt>Sources</dt>
          <dd>{conformance.sources.map((source) => SOURCE_LABELS[source]).join(' · ')}</dd>
        </div>
        {conformance.adaptations.length > 0 ? (
          <div className="doc-compliance-wide">
            <dt>Adaptations</dt>
            <dd>{conformance.adaptations.join(' · ')}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
