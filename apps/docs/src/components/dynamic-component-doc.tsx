'use client';

import { ComponentDocView } from '@/components/component-doc-view';
import type { ComponentContentConfig } from '@/components/doc/types';

interface DynamicComponentDocProps {
  slug: string;
  config: ComponentContentConfig;
}

export function DynamicComponentDoc({ slug, config }: DynamicComponentDocProps) {
  return <ComponentDocView slug={slug} config={config} />;
}
