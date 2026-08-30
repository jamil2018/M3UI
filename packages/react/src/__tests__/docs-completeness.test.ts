import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  COMPONENT_CATALOG,
  getRegistryUiEntries,
  getCatalogEntry,
  type ComponentCatalogEntry,
} from '../catalog/index.js';
import {
  MATERIAL_WEB_UPSTREAM_VERSION,
  TIER_A_SLUGS,
  TIER_B_SLUGS,
  TIER_C_SLUGS,
  parityForSlug,
} from '../catalog/parity.js';
import {
  readDocsCatalogManifest,
  readRegistryManifest,
  getRegistryItemSlugs,
  getSharedExampleSlugs,
  getDocsContentSlugs,
  getDocsContentTitles,
  getDocsDemoSlugs,
  getGeneratedStorySlugs,
  getPublicExportNames,
  formatMissing,
  PATHS,
} from './docs-completeness-utils.js';

const PHASE1_EXAMPLE_SLUGS = [
  'button',
  'checkbox',
  'dialog',
  'tabs',
  'date-picker',
  'adaptive-navigation',
] as const;

function publicRoutedUiEntries(): ComponentCatalogEntry[] {
  return COMPONENT_CATALOG.filter(
    (entry) =>
      entry.registryType === 'registry:ui' &&
      entry.status !== 'internal' &&
      entry.docs.route,
  );
}

function slugToExampleName(slug: string): string {
  return `${slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}Example`;
}

function getStorybookExampleExports(): Set<string> {
  const source = readFileSync(PATHS.storybookExamples, 'utf-8');
  const names = new Set<string>();
  const re = /export function (\w+Example)\(/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    names.add(match[1]!);
  }
  return names;
}

describe('docs completeness gate', () => {
  describe('catalog ↔ registry', () => {
    it('dynamic docs component route exists', () => {
      expect(existsSync(PATHS.docsDynamicRoute)).toBe(true);
    });

    it('generated docs-catalog.json exists and matches source catalog slugs', () => {
      expect(
        existsSync(PATHS.docsCatalog),
        'Run pnpm registry:build to generate docs-catalog.json',
      ).toBe(true);
      const generated = readDocsCatalogManifest();
      expect(generated.entries.map((e) => e.slug).sort()).toEqual(
        COMPONENT_CATALOG.map((e) => e.slug).sort(),
      );
    });

    it('docs-catalog.json title/description matches source catalog (drift detection)', () => {
      const generated = readDocsCatalogManifest();
      const bySlug = new Map(generated.entries.map((e) => [e.slug, e]));
      const drifts: string[] = [];
      for (const entry of COMPONENT_CATALOG) {
        const item = bySlug.get(entry.slug);
        if (!item) continue;
        if (item.title !== entry.title || item.description !== entry.description) {
          drifts.push(`${entry.slug}: docs-catalog drift`);
        }
      }
      expect(drifts, drifts.join('\n')).toEqual([]);
    });

    it('every registry:ui catalog entry has a source file and registry artifact', () => {
      const registrySlugs = getRegistryItemSlugs();
      for (const entry of getRegistryUiEntries()) {
        expect(entry.sourceFile, `${entry.slug} missing sourceFile`).toBeTruthy();
        expect(
          existsSync(join(PATHS.componentsDir, entry.sourceFile!)),
          `${entry.slug} missing implementation`,
        ).toBe(true);
        expect(registrySlugs.has(entry.slug), `${entry.slug} missing registry/r/*.json`).toBe(
          true,
        );
      }
    });

    it('registry.json manifest matches registry:ui catalog slugs', () => {
      const manifestSlugs = new Set(readRegistryManifest().items.map((item) => item.name));
      const missing = getRegistryUiEntries()
        .map((e) => e.slug)
        .filter((slug) => !manifestSlugs.has(slug));
      expect(missing, formatMissing('missing manifest entries', missing)).toEqual([]);
    });

    it('registry title/description matches catalog (drift detection)', () => {
      const drifts: string[] = [];
      for (const entry of getRegistryUiEntries()) {
        const raw = readFileSync(join(PATHS.registryItemsDir, `${entry.slug}.json`), 'utf-8');
        const item = JSON.parse(raw) as { title: string; description: string };
        if (item.title !== entry.title) {
          drifts.push(`${entry.slug}: title drift`);
        }
        if (item.description !== entry.description) {
          drifts.push(`${entry.slug}: description drift`);
        }
      }
      expect(drifts, drifts.join('\n')).toEqual([]);
    });

    it('every catalog export is published from @m3ui/react', () => {
      const exports = getPublicExportNames();
      const missing: string[] = [];
      for (const entry of getRegistryUiEntries()) {
        for (const name of entry.exports) {
          if (!exports.has(name)) missing.push(`${entry.slug}:${name}`);
        }
      }
      expect(missing, formatMissing('missing @m3ui/react exports', missing)).toEqual([]);
    });

    it('tiered catalog entries expose parity metadata in generated registry artifacts', () => {
      const tiered = [...TIER_A_SLUGS, ...TIER_B_SLUGS, ...TIER_C_SLUGS];
      const drifts: string[] = [];

      for (const slug of tiered) {
        const catalogParity = parityForSlug(slug);
        const raw = readFileSync(join(PATHS.registryItemsDir, `${slug}.json`), 'utf-8');
        const item = JSON.parse(raw) as {
          meta?: {
            parity?: { tier: string; reference: string; upstreamVersion: string };
          };
        };

        if (!item.meta?.parity) {
          drifts.push(`${slug}: missing registry meta.parity (run pnpm registry:build)`);
          continue;
        }

        const expectedTier = (TIER_A_SLUGS as readonly string[]).includes(slug)
          ? 'A'
          : (TIER_B_SLUGS as readonly string[]).includes(slug)
            ? 'B'
            : 'C';

        if (item.meta.parity.tier !== expectedTier) {
          drifts.push(`${slug}: tier ${item.meta.parity.tier} !== ${expectedTier}`);
        }
        if (item.meta.parity.reference !== catalogParity?.reference) {
          drifts.push(`${slug}: reference drift`);
        }
        if (item.meta.parity.upstreamVersion !== MATERIAL_WEB_UPSTREAM_VERSION) {
          drifts.push(`${slug}: upstreamVersion drift`);
        }
      }

      expect(drifts, drifts.join('\n')).toEqual([]);
    });
  });

  describe('catalog ↔ docs', () => {
    it('every public routed UI component has prose content', () => {
      const contentSlugs = getDocsContentSlugs();
      const missing = publicRoutedUiEntries()
        .map((e) => e.slug)
        .filter((slug) => !contentSlugs.has(slug));
      expect(missing, formatMissing('missing COMPONENT_DOCS', missing)).toEqual([]);
    });

    it('docs content titles match catalog (drift detection)', () => {
      const titles = getDocsContentTitles();
      const drifts: string[] = [];
      for (const entry of publicRoutedUiEntries()) {
        const title = titles.get(entry.slug);
        if (title && title !== entry.title) {
          drifts.push(`${entry.slug}: "${title}" !== "${entry.title}"`);
        }
      }
      expect(drifts, drifts.join('\n')).toEqual([]);
    });

    it('every public routed UI component has a docs demo', () => {
      const demoSlugs = getDocsDemoSlugs();
      const missing = publicRoutedUiEntries()
        .map((e) => e.slug)
        .filter((slug) => !demoSlugs.has(slug));
      expect(missing, formatMissing('missing DEMO_MAP demos', missing)).toEqual([]);
    });

    it('placeholder-button is internal and excluded from public index', () => {
      const placeholder = getCatalogEntry('placeholder-button');
      expect(placeholder?.status).toBe('internal');
      expect(placeholder?.docs.publicIndex).toBe(false);
    });

    it('shapes is a foundations entry with dedicated docs', () => {
      const shapes = getCatalogEntry('shapes');
      expect(shapes?.registryType).toBe('foundations');
      expect(shapes?.category).toBe('foundations');
      expect(shapes?.docs.publicIndex).toBe(true);
      expect(existsSync(PATHS.shapesDoc)).toBe(true);
    });

    it('tiered public components carry conformance parity blocks for docs compliance UI', () => {
      const missing: string[] = [];
      for (const slug of [...TIER_A_SLUGS, ...TIER_B_SLUGS, ...TIER_C_SLUGS]) {
        const entry = getCatalogEntry(slug);
        if (!entry?.conformance.parity?.reference) {
          missing.push(slug);
        }
      }
      expect(missing, formatMissing('missing conformance.parity', missing)).toEqual([]);
    });
  });

  describe('catalog ↔ shared examples', () => {
    it('Phase 1 representative slugs have shared examples', () => {
      const exampleSlugs = getSharedExampleSlugs();
      const missing = PHASE1_EXAMPLE_SLUGS.filter((slug) => !exampleSlugs.has(slug));
      expect(missing, formatMissing('missing shared examples', missing)).toEqual([]);
    });

    it('shared examples only reference known catalog slugs', () => {
      const catalogSlugs = new Set(COMPONENT_CATALOG.map((e) => e.slug));
      const unknown = [...getSharedExampleSlugs()].filter((slug) => !catalogSlugs.has(slug));
      expect(unknown, formatMissing('unknown EXAMPLES_BY_SLUG keys', unknown)).toEqual([]);
    });
  });

  describe('catalog ↔ storybook', () => {
    it('generated story files exist for every public routed UI component', () => {
      const generated = getGeneratedStorySlugs();
      const missing = publicRoutedUiEntries()
        .map((e) => e.slug)
        .filter((slug) => !generated.has(slug));
      expect(
        missing,
        `${formatMissing('missing generated stories (run stories:generate)', missing)}`,
      ).toEqual([]);
    });

    it('legacy storybook example exports exist for non-shared catalog slugs', () => {
      const shared = getSharedExampleSlugs();
      const exports = getStorybookExampleExports();
      const missing = publicRoutedUiEntries()
        .filter((entry) => !shared.has(entry.slug))
        .map((entry) => slugToExampleName(entry.slug))
        .filter((name) => !exports.has(name));
      expect(missing, formatMissing('missing story example components', missing)).toEqual([]);
    });
  });
});
