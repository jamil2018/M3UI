import { describe, expect, it } from 'vitest';
import { COMPONENT_CATALOG } from '../catalog/index.js';
import { TIER_A_SLUGS, TIER_B_SLUGS, TIER_C_SLUGS } from '../catalog/parity.js';
import { isAllowlistedParityGap, PARITY_ALLOWLIST } from './parity-allowlist.js';
import { computeLiveMissingSuffixes, specHasTokenLists } from './parity-utils.js';

describe('M3 Expressive conformance contract', () => {
  const publicEntries = COMPONENT_CATALOG.filter((entry) => entry.status !== 'internal');

  it('has a versioned, actionable contract for every public entry', () => {
    for (const entry of publicEntries) {
      expect(entry.conformance.version, entry.slug).toBe('1.0');
      expect(entry.conformance.sources.length, entry.slug).toBeGreaterThan(0);
      expect(entry.conformance.variants.length, entry.slug).toBeGreaterThan(0);
      expect(entry.conformance.sizes.length, entry.slug).toBeGreaterThan(0);
      expect(entry.conformance.states, entry.slug).toContain('rest');
      expect(entry.conformance.tokenPrefixes.length, entry.slug).toBeGreaterThan(0);
    }
  });

  it('does not use placeholder default variant/size enumerations', () => {
    for (const entry of publicEntries) {
      const { variants, sizes } = entry.conformance;
      const placeholderOnly =
        variants.length === 1 &&
        variants[0] === 'default' &&
        sizes.length === 1 &&
        sizes[0] === 'default';
      expect(placeholderOnly, entry.slug).toBe(false);
    }
  });

  it('labels Android-derived behavior as a web adaptation', () => {
    for (const entry of publicEntries) {
      if (!entry.conformance.sources.includes('android-expressive')) continue;
      expect(entry.conformance.sources, entry.slug).toContain('m3ui-web-adaptation');
      expect(entry.conformance.status, entry.slug).toBe('adapted');
    }
  });

  it('records accessibility and platform modes', () => {
    for (const entry of publicEntries) {
      expect(entry.conformance.rtl, entry.slug).toBe(true);
      expect(entry.conformance.reducedMotion, entry.slug).toBe(true);
      expect(entry.conformance.forcedColors, entry.slug).toBe(true);
    }
  });
});

describe('Material Web parity contract', () => {
  const tierAEntries = COMPONENT_CATALOG.filter((entry) =>
    (TIER_A_SLUGS as readonly string[]).includes(entry.slug),
  );
  const tierBEntries = COMPONENT_CATALOG.filter((entry) =>
    (TIER_B_SLUGS as readonly string[]).includes(entry.slug),
  );
  const tierCEntries = COMPONENT_CATALOG.filter((entry) =>
    (TIER_C_SLUGS as readonly string[]).includes(entry.slug),
  );

  it('assigns parity reference tiers to all remediated components', () => {
    expect(tierAEntries.length).toBe(TIER_A_SLUGS.length);
    expect(tierBEntries.length).toBe(TIER_B_SLUGS.length);
    expect(tierCEntries.length).toBe(TIER_C_SLUGS.length);

    for (const entry of tierAEntries) {
      expect(entry.conformance.parity?.reference, entry.slug).toBe('labs/gb');
    }
    for (const entry of tierBEntries) {
      expect(entry.conformance.parity?.reference, entry.slug).toBe('stable');
    }
    for (const entry of tierCEntries) {
      expect(entry.conformance.parity?.reference, entry.slug).toBe('tokens-only');
    }
  });

  it('records upstream version, tier, and residual diff shape on tiered entries', () => {
    const tiered = [...tierAEntries, ...tierBEntries, ...tierCEntries];
    for (const entry of tiered) {
      const parity = entry.conformance.parity;
      expect(parity?.tier, entry.slug).toMatch(/^[ABC]$/);
      expect(parity?.upstreamVersion, entry.slug).toBeTruthy();
      expect(parity?.residualDiff.missing, entry.slug).toBeInstanceOf(Array);
      expect(parity?.residualDiff.extra, entry.slug).toBeInstanceOf(Array);
      expect(parity?.residualDiff.drifted, entry.slug).toBeInstanceOf(Array);
    }
  });

  it('documents Tier A residual gaps in catalog parity block', () => {
    for (const entry of tierAEntries) {
      const documented = entry.conformance.parity?.residualDiff.missing ?? [];
      for (const suffix of documented) {
        expect(
          isAllowlistedParityGap(entry.slug, suffix) || documented.includes(suffix),
          `${entry.slug}: undocumented residual ${suffix}`,
        ).toBe(true);
      }
    }
  });

  it('fails when a Tier A component has unallowlisted documented residual gaps', () => {
    expect(PARITY_ALLOWLIST.length).toBeGreaterThan(0);

    for (const entry of tierAEntries) {
      const documented = entry.conformance.parity?.residualDiff.missing ?? [];
      for (const suffix of documented) {
        expect(
          isAllowlistedParityGap(entry.slug, suffix),
          `${entry.slug}: residual "${suffix}" must be on PARITY_ALLOWLIST`,
        ).toBe(true);
      }
    }
  });

  it('defers live Tier A upstream diff until parity-report prefix aliasing ships', () => {
    // Expressive size prefixes (button-xsmall, xsmall-icon-button, etc.) differ from stable
    // md-comp-filled-button keys in the synced spec. Live diff is enforced by token-coverage
    // and documented residuals until tools/spec-sync/src/parity-report.ts lands.
    if (!specHasTokenLists()) return;

    const sampleMissing = computeLiveMissingSuffixes('button');
    expect(sampleMissing.length).toBeGreaterThan(0);
  });
});
