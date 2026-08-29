import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { ReactNode } from 'react';

export interface DocsContentProps {
  title: string;
  description?: string;
  children: ReactNode;
  full?: boolean;
}

export function DocsContent({ title, description, children, full }: DocsContentProps) {
  return (
    <DocsPage full={full} breadcrumb={{ enabled: true }}>
      <DocsTitle>{title}</DocsTitle>
      {description ? <DocsDescription>{description}</DocsDescription> : null}
      <DocsBody className="docs-prose">{children}</DocsBody>
    </DocsPage>
  );
}
