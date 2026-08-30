import type { ReactNode } from 'react';
import { DocsContent } from './docs-content';

interface FoundationSection {
  title: string;
  body: ReactNode;
}

export function FoundationPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: FoundationSection[];
}) {
  return (
    <DocsContent title={title} description={description}>
      <div className="foundation-page">
        {sections.map((section) => (
          <section key={section.title} className="foundation-section">
            <h2>{section.title}</h2>
            <div>{section.body}</div>
          </section>
        ))}
      </div>
    </DocsContent>
  );
}
