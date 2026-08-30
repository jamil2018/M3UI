import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  TIER_A_SLUGS,
  TIER_B_SLUGS,
  TIER_C_SLUGS,
  parityForSlug,
} from '../catalog/parity.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_DIR = join(__dirname, '../../registry/r');
const REGISTRY_MANIFEST = join(__dirname, '../../registry/registry.json');

const REQUIRED_NPM_DEPS = ['@m3ui/react', '@m3ui/tokens'];

type ParityTier = 'A' | 'B' | 'C';

interface RegistryParityMeta {
  tier: ParityTier;
  reference: string;
  upstreamVersion: string;
}

interface RegistryItemJson {
  name: string;
  dependencies?: string[];
  meta?: { parity?: RegistryParityMeta };
  files?: Array<{ content?: string }>;
}

function expectedTier(slug: string): ParityTier | undefined {
  if ((TIER_A_SLUGS as readonly string[]).includes(slug)) return 'A';
  if ((TIER_B_SLUGS as readonly string[]).includes(slug)) return 'B';
  if ((TIER_C_SLUGS as readonly string[]).includes(slug)) return 'C';
  return undefined;
}

describe('registry E2E validation', () => {
  const files = readdirSync(REGISTRY_DIR).filter((f) => f.endsWith('.json'));

  it('contains registry JSON for every component', () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
  });

  it.each(files)('%s has no workspace paths', (file) => {
    const content = readFileSync(join(REGISTRY_DIR, file), 'utf-8');
    expect(content).not.toContain('workspace:');
    expect(content).not.toContain('../../');
    expect(content).not.toContain('../primitives');
  });

  it.each(files)('%s declares npm dependencies and @m3ui/react imports', (file) => {
    const json = JSON.parse(readFileSync(join(REGISTRY_DIR, file), 'utf-8')) as RegistryItemJson;

    expect(json.dependencies).toBeDefined();
    for (const dep of REQUIRED_NPM_DEPS) {
      expect(json.dependencies).toContain(dep);
    }

    const combined = (json.files ?? []).map((f) => f.content ?? '').join('\n');
    expect(combined).toContain('@m3ui/react');
    expect(combined).not.toMatch(/from ['"]@\/|from ['"]\.\./);
  });

  it.each(files.filter((f) => f !== 'placeholder-button.json'))(
    '%s includes parity tier metadata when catalog assigns a tier',
    (file) => {
      const slug = file.replace(/\.json$/, '');
      const expected = expectedTier(slug);
      if (!expected) return;

      const json = JSON.parse(readFileSync(join(REGISTRY_DIR, file), 'utf-8')) as RegistryItemJson;
      const catalogParity = parityForSlug(slug);
      expect(json.meta?.parity, slug).toBeDefined();
      expect(json.meta?.parity?.tier, slug).toBe(expected);
      expect(json.meta?.parity?.reference, slug).toBe(catalogParity?.reference);
      expect(json.meta?.parity?.upstreamVersion, slug).toBeTruthy();
    },
  );

  it('registry.json manifest carries parity metadata for tiered components', () => {
    const manifest = JSON.parse(readFileSync(REGISTRY_MANIFEST, 'utf-8')) as {
      items: Array<{ name: string; meta?: { parity?: RegistryParityMeta } }>;
    };
    const byName = new Map(manifest.items.map((item) => [item.name, item]));

    for (const slug of [...TIER_A_SLUGS, ...TIER_B_SLUGS, ...TIER_C_SLUGS]) {
      const item = byName.get(slug);
      expect(item?.meta?.parity?.tier, slug).toBe(expectedTier(slug));
    }
  });

  it('placeholder-button uses published npm specifiers (smoke)', () => {
    const content = readFileSync(join(REGISTRY_DIR, 'placeholder-button.json'), 'utf-8');
    expect(content).toContain('@m3ui/react');
    expect(content).toContain('@m3ui/tokens');
  });
});
