import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsPageTree } from '@/lib/nav-tree';

export default function DocsGroupLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={getDocsPageTree()}
      sidebar={{
        defaultOpenLevel: 1,
        collapsible: true,
        enabled: true,
      }}
    >
      {children}
    </DocsLayout>
  );
}
