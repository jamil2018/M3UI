import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');

function extractObjectBlocks(source) {
  const blocks = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') {
      if (depth === 0) start = i;
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        blocks.push(source.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return blocks;
}

function readField(block, field) {
  const stringMatch = block.match(new RegExp(`${field}:\\s*'([^']*)'`));
  if (stringMatch) return stringMatch[1];

  const templateMatch = block.match(new RegExp(`${field}:\\s*\`([\\s\\S]*?)\``));
  if (templateMatch) return templateMatch[1];

  return undefined;
}

function parseExamplesArray(arraySource) {
  return extractObjectBlocks(arraySource)
    .map((block) => ({
      id: readField(block, 'id'),
      componentSlug: readField(block, 'componentSlug'),
      title: readField(block, 'title'),
      description: readField(block, 'description'),
      source: readField(block, 'source'),
    }))
    .filter((entry) => entry.id && entry.componentSlug && entry.title && entry.source);
}

function parseExamplesFile(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const entries = [];
  const exportPattern = /export const \w+Examples[^=]*=\s*\[/g;

  for (const match of source.matchAll(exportPattern)) {
    const arrayStart = match.index + match[0].length - 1;
    let depth = 0;
    let arrayEnd = -1;

    for (let i = arrayStart; i < source.length; i += 1) {
      const char = source[i];
      if (char === '[') depth += 1;
      else if (char === ']') {
        depth -= 1;
        if (depth === 0) {
          arrayEnd = i;
          break;
        }
      }
    }

    if (arrayEnd < 0) continue;
    entries.push(...parseExamplesArray(source.slice(arrayStart + 1, arrayEnd)));
  }

  return entries;
}

const metadata = {};

for (const file of readdirSync(srcDir)) {
  if (!file.endsWith('.examples.tsx')) continue;
  for (const entry of parseExamplesFile(join(srcDir, file))) {
    if (!metadata[entry.componentSlug]) {
      metadata[entry.componentSlug] = [];
    }
    metadata[entry.componentSlug].push({
      id: entry.id,
      componentSlug: entry.componentSlug,
      title: entry.title,
      description: entry.description,
      source: entry.source,
    });
  }
}

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

writeFileSync(join(srcDir, 'metadata-map.ts'), body);
console.log(`Generated metadata-map.ts with ${Object.keys(metadata).length} slugs`);
