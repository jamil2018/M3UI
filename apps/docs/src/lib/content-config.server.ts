import type { ComponentDocContent } from '@/content/types';
import type { ComponentContentConfig } from '@/components/doc/types';
import { contentToConfig } from '@/lib/content-config';
import { extractPropsFromSource, mergePropDefinitions } from '@/lib/extract-props';

/** Server-only: enrich config with extracted props from component source */
export function buildDocPageConfig(slug: string, content: ComponentDocContent): ComponentContentConfig {
  const config = contentToConfig(content);
  const props = mergePropDefinitions(extractPropsFromSource(slug), config.props ?? []);
  return { ...config, props };
}
