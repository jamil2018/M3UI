import { CodeBlock } from './code-block';
import { DocSection } from './doc-section';
import { LivePreview } from './live-preview';
import type { DocExample, DocExampleConfig } from './types';

export interface ExamplesGalleryProps {
  examples: DocExample[] | DocExampleConfig[];
  title?: string;
  description?: string;
}

function hasPreview(example: DocExample | DocExampleConfig): example is DocExample {
  return 'preview' in example && example.preview != null;
}

export function ExamplesGallery({
  examples,
  title = 'Examples',
  description = 'Common variants and states.',
}: ExamplesGalleryProps) {
  if (examples.length === 0) {
    return null;
  }

  return (
    <DocSection id="examples" title={title} description={description}>
      <div className="doc-examples-grid">
        {examples.map((example) => (
          <article key={example.id} className="doc-example-card">
            <header className="doc-example-header">
              <h3 className="doc-example-title">{example.title}</h3>
              {example.description ? (
                <p className="doc-example-description">{example.description}</p>
              ) : null}
            </header>
            {hasPreview(example) ? (
              <LivePreview minHeight={80}>{example.preview}</LivePreview>
            ) : null}
            <CodeBlock code={example.code} language="tsx" />
          </article>
        ))}
      </div>
    </DocSection>
  );
}
