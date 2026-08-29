import type { ReactNode } from 'react';

export interface DocSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function DocSection({ id, title, description, children }: DocSectionProps) {
  return (
    <section id={id} className="doc-section">
      <div className="doc-section-header">
        <h2 className="doc-section-title">{title}</h2>
        {description ? <p className="doc-section-description">{description}</p> : null}
      </div>
      <div className="doc-section-body">{children}</div>
    </section>
  );
}
