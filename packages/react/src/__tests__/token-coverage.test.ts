import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMP_TOKEN_VARS } from '@m3ui/tokens';
import { collectReferencedTokens } from './token-coverage-utils.js';
import { isAllowlistedToken, TOKEN_ALLOWLIST } from './token-coverage-allowlist.js';

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
});
