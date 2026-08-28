import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_MANIFEST = join(__dirname, '../../registry/registry.json');
const DOCS_COMPONENTS_DIR = join(__dirname, '../../../../apps/docs/src/app/components');

/** Registry component names that must have a docs page */
function getRegistryComponentNames(): string[] {
  const manifest = JSON.parse(readFileSync(REGISTRY_MANIFEST, 'utf-8')) as {
    items: Array<{ name: string }>;
  };
  return manifest.items.map((i) => i.name).sort();
}

function getDocsPages(): Set<string> {
  if (!existsSync(DOCS_COMPONENTS_DIR)) return new Set();
  return new Set(
    readdirSync(DOCS_COMPONENTS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name),
  );
}

describe('docs completeness gate', () => {
  it('every registry component has a docs page', () => {
    const registry = getRegistryComponentNames();
    const docs = getDocsPages();
    const missing = registry.filter((name) => !docs.has(name));

    expect(missing, `Missing docs pages for: ${missing.join(', ')}`).toEqual([]);
  });

  it('shapes docs page exists for ShapeCrop export', () => {
    const docs = getDocsPages();
    expect(docs.has('shapes')).toBe(true);
  });
});
