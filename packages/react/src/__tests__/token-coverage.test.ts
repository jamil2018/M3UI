import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMP_TOKEN_VARS } from '@m3ui/tokens';
import { collectReferencedTokens } from '../lib/token-coverage-utils.js';
import {
  allowlistTierCounts,
  isAllowlistedToken,
  TOKEN_ALLOWLIST,
  TOKEN_ALLOWLIST_TIERS,
} from './token-coverage-allowlist.js';
import { COMPONENT_CATALOG } from '../catalog/index.js';
import {
  COMPONENT_UPSTREAM_KEYS,
  TIER_A_SLUGS,
  TIER_B_SLUGS,
  TIER_C_SLUGS,
} from '../catalog/parity.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_DIR = join(__dirname, '../../../tokens/src/spec');

describe('token coverage gate', () => {
  it('spec JSON exists and is parseable', () => {
    const manifestPath = join(SPEC_DIR, 'manifest.json');
    if (!existsSync(manifestPath)) {
      throw new Error(
        'Token spec missing — run `pnpm spec:sync` to fetch androidx/material-web tokens',
      );
    }
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as {
      version: string;
      androidx: { fileCount: number };
    };
    expect(manifest.version).toBeTruthy();
    expect(manifest.androidx.fileCount).toBeGreaterThan(0);
  });

  it('exports sys and comp token CSS vars', () => {
    expect(COMP_TOKEN_VARS.length).toBeGreaterThan(100);
  });

  it('every md-comp token is referenced or on the reviewed allowlist', () => {
    const referenced = collectReferencedTokens();
    const uncovered: string[] = [];

    for (const token of COMP_TOKEN_VARS) {
      if (referenced.has(token)) continue;
      if (isAllowlistedToken(token)) continue;
      uncovered.push(token);
    }

    if (uncovered.length > 0) {
      const sample = uncovered.slice(0, 25).join('\n  ');
      throw new Error(
        `TOKEN COVERAGE GATE FAILED: ${uncovered.length} md-comp token(s) are neither referenced in component source nor on the reviewed allowlist.\n` +
          `Add a reference or document the gap in token-coverage-allowlist.ts.\n` +
          `Sample:\n  ${sample}`,
      );
    }

    expect(TOKEN_ALLOWLIST.length).toBeGreaterThan(0);
    expect(referenced.size).toBeGreaterThan(200);
  });

  it('referenced tokens exist in generated spec', () => {
    const allTokens = new Set<string>(COMP_TOKEN_VARS);
    const referenced = collectReferencedTokens();

    const invalid: string[] = [];
    for (const token of referenced) {
      if (!token.startsWith('--md-comp-')) continue;
      if (!allTokens.has(token)) invalid.push(token);
    }

    expect(invalid).toEqual([]);
  });

  it('public component sources do not contain token fallbacks or raw visual colors', () => {
    const violations: string[] = [];
    for (const entry of COMPONENT_CATALOG) {
      if (entry.status === 'internal' || !entry.sourceFile) continue;
      const source = readFileSync(join(__dirname, '../components', entry.sourceFile), 'utf-8');
      if (/var\(--md-(?:sys|comp)-[^)]+,/.test(source)) violations.push(`${entry.slug}: token fallback`);
      if (/#[\da-f]{3,8}\b|rgba?\(|cubic-bezier\(|\b\d+ms\b/i.test(source)) {
        violations.push(`${entry.slug}: raw visual constant`);
      }
    }
    expect(violations).toEqual([]);
  });
});

describe('token coverage parity scaffold', () => {
  it('documents Tier A/B/C/global allowlist bands', () => {
    expect(Object.keys(TOKEN_ALLOWLIST_TIERS).sort()).toEqual(['A', 'B', 'C', 'global']);
    for (const description of Object.values(TOKEN_ALLOWLIST_TIERS)) {
      expect(description.length).toBeGreaterThan(10);
    }
  });

  it('annotates reviewed allowlist entries with tier metadata', () => {
    const counts = allowlistTierCounts();
    expect(counts.global).toBeGreaterThan(0);
    expect(counts.A).toBeGreaterThan(0);
    expect(counts.B).toBeGreaterThan(0);
    expect(TOKEN_ALLOWLIST.every((e) => e.reason.length > 10)).toBe(true);
  });

  it('maps upstream keys for Tier A and Tier B measurement slugs', () => {
    for (const slug of TIER_A_SLUGS) {
      expect(COMPONENT_UPSTREAM_KEYS[slug]?.length, slug).toBeGreaterThan(0);
    }
    for (const slug of TIER_B_SLUGS) {
      expect(COMPONENT_UPSTREAM_KEYS[slug]?.length, slug).toBeGreaterThan(0);
    }
  });

  it('keeps parity tiers disjoint and covering all remediated public components', () => {
    const tiered = new Set([...TIER_A_SLUGS, ...TIER_B_SLUGS, ...TIER_C_SLUGS]);
    expect(tiered.size).toBe(TIER_A_SLUGS.length + TIER_B_SLUGS.length + TIER_C_SLUGS.length);

    const overlap = TIER_A_SLUGS.filter(
      (slug) =>
        (TIER_B_SLUGS as readonly string[]).includes(slug) ||
        (TIER_C_SLUGS as readonly string[]).includes(slug),
    );
    expect(overlap).toEqual([]);

    for (const slug of tiered) {
      const entry = COMPONENT_CATALOG.find((e) => e.slug === slug);
      expect(entry, slug).toBeDefined();
      expect(entry?.conformance.parity?.reference, slug).toBeTruthy();
    }
  });

  it('Tier A documented residuals are allowlisted for token coverage', () => {
    const buttonResiduals = [
      'focus-state-layer-color',
      'focus-state-layer-opacity',
      'label-text-tracking',
      'label-text-type',
    ];
    for (const suffix of buttonResiduals) {
      const token = `--md-comp-filled-button-${suffix}`;
      if (COMP_TOKEN_VARS.includes(token)) {
        expect(isAllowlistedToken(token), token).toBeTruthy();
      }
    }
  });
});
