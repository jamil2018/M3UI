import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXAMPLES_BY_SLUG } from '../src/examples-map.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const metadata = Object.fromEntries(
  Object.entries(EXAMPLES_BY_SLUG).map(([slug, examples]) => [
    slug,
    examples.map(({ id, componentSlug, title, description, source }) => ({
      id,
      componentSlug,
      title,
      description,
      source,
    })),
  ]),
);

const body = `import type { ExampleMetadataBySlug } from './types-metadata';

/** Serializable example metadata — safe for server components and docs SSR */
export const METADATA_BY_SLUG: ExampleMetadataBySlug = ${JSON.stringify(metadata, null, 2)};

export function getExampleMetadataForSlug(slug: string) {
  return METADATA_BY_SLUG[slug] ?? [];
}

export function getAllExampleMetadataSlugs(): string[] {
  return Object.keys(METADATA_BY_SLUG).sort();
}
`;

writeFileSync(join(root, 'src/metadata-map.ts'), body);
console.log(`Generated metadata-map.ts with ${Object.keys(metadata).length} slugs`);
