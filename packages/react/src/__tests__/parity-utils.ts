import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENT_UPSTREAM_KEYS } from '../catalog/parity.js';
import { collectReferencedTokens } from '../lib/token-coverage-utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_PATH = join(__dirname, '../../../tokens/src/spec/material-web-tokens.json');

interface MaterialWebTokenFile {
  fileName?: string;
  tokenLists?: {
    supported?: string[];
    unsupported?: string[];
  };
}

function upstreamKeyToTokenPrefix(key: string): string {
  return `--md-comp-${key.replace(/^md-comp-/, '')}-`;
}

function loadMaterialWebSpec(): Record<string, MaterialWebTokenFile> | null {
  if (!existsSync(SPEC_PATH)) return null;
  return JSON.parse(readFileSync(SPEC_PATH, 'utf-8')) as Record<string, MaterialWebTokenFile>;
}

/** Upstream supported token suffixes for a catalog slug (empty when spec lacks tokenLists). */
export function upstreamSupportedSuffixes(slug: string): string[] {
  const spec = loadMaterialWebSpec();
  if (!spec) return [];

  const keys = COMPONENT_UPSTREAM_KEYS[slug] ?? [];
  const supported = new Set<string>();

  for (const key of keys) {
    const entry = spec[key];
    for (const suffix of entry?.tokenLists?.supported ?? []) {
      supported.add(suffix);
    }
  }

  return [...supported].sort();
}

/** Referenced token suffixes for a slug, using the same expansion as the token-coverage gate. */
export function referencedSuffixesForSlug(slug: string): Set<string> {
  const keys = COMPONENT_UPSTREAM_KEYS[slug] ?? [];
  const prefixes = keys.map((key) => upstreamKeyToTokenPrefix(key));
  const referenced = collectReferencedTokens();
  const suffixes = new Set<string>();

  for (const token of referenced) {
    for (const prefix of prefixes) {
      if (token.startsWith(prefix)) {
        suffixes.add(token.slice(prefix.length));
      }
    }
  }

  return suffixes;
}

/** Live missing upstream token suffixes for a component (requires synced spec with tokenLists). */
export function computeLiveMissingSuffixes(slug: string): string[] {
  const upstream = upstreamSupportedSuffixes(slug);
  if (upstream.length === 0) return [];

  const referenced = referencedSuffixesForSlug(slug);
  return upstream.filter((suffix) => !referenced.has(suffix));
}

export function specHasTokenLists(): boolean {
  const spec = loadMaterialWebSpec();
  if (!spec) return false;
  const sample = spec['md-comp-filled-button'];
  return (sample?.tokenLists?.supported?.length ?? 0) > 0;
}
