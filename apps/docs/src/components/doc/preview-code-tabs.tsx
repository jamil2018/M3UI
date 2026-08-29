'use client';

import type { ReactNode } from 'react';
import { CodeBlock } from './code-block';
import { LivePreview } from './live-preview';
import { TabGroup } from './tab-group';

export interface PreviewCodeTabsProps {
  preview: ReactNode;
  code: string;
  language?: string;
}

export function PreviewCodeTabs({ preview, code, language = 'tsx' }: PreviewCodeTabsProps) {
  return (
    <TabGroup
      label="Preview and code"
      defaultTabId="preview"
      items={[
        {
          id: 'preview',
          label: 'Preview',
          content: <LivePreview>{preview}</LivePreview>,
        },
        {
          id: 'code',
          label: 'Code',
          content: <CodeBlock code={code} language={language} />,
        },
      ]}
    />
  );
}
