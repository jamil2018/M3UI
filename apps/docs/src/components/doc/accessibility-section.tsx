import { DocSection } from './doc-section';
import type { AccessibilityConfig } from './types';

export interface AccessibilitySectionProps {
  accessibility: AccessibilityConfig;
}

export function AccessibilitySection({ accessibility }: AccessibilitySectionProps) {
  const { summary, items, metadata } = accessibility;

  return (
    <DocSection
      id="accessibility"
      title="Accessibility"
      description={summary ?? 'Built on semantic HTML and Base UI primitives.'}
    >
      <ul className="doc-a11y-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {metadata && Object.keys(metadata).length > 0 ? (
        <dl className="doc-a11y-metadata">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="doc-a11y-metadata-row">
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </DocSection>
  );
}
