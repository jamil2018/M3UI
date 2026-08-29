import { CodeBlock } from './code-block';
import { DocSection } from './doc-section';
import type { UsageConfig } from './types';

export interface UsageBlockProps {
  usage: UsageConfig;
}

export function UsageBlock({ usage }: UsageBlockProps) {
  return (
    <DocSection
      id="usage"
      title="Usage"
      description={usage.description ?? 'Import the component and wrap your app with M3Provider.'}
    >
      <CodeBlock code={usage.code} language="tsx" />
    </DocSection>
  );
}
