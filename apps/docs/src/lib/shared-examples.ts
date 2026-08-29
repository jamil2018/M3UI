import { getExamplesForComponent } from '@m3ui/examples/metadata';
import type { DocExampleConfig } from '@/components/doc/types';

/** Load serializable shared examples for docs galleries and preview tabs */
export async function getSharedExamples(slug: string): Promise<DocExampleConfig[]> {
  return getExamplesForComponent(slug);
}

/** Sync variant for server components — metadata only, no live React components */
export function getSharedExamplesSync(slug: string): DocExampleConfig[] {
  return getExamplesForComponent(slug);
}
