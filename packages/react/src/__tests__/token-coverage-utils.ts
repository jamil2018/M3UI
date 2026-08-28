import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMP_TOKEN_VARS } from '@m3ui/tokens';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REACT_SRC = join(__dirname, '..');
const VALID_TOKENS = new Set<string>(COMP_TOKEN_VARS);

/** Must stay in sync with token-utils.ts */
const BUTTON_SIZE_PREFIX = {
  xs: 'button-xsmall',
  sm: 'button-small',
  md: 'button-medium',
  lg: 'button-large',
  xl: 'button-xlarge',
} as const;

const ICON_BUTTON_SIZE_PREFIX = {
  xs: 'xsmall-icon-button',
  sm: 'small-icon-button',
  md: 'medium-icon-button',
  lg: 'large-icon-button',
  xl: 'xlarge-icon-button',
} as const;

const SPLIT_BUTTON_SIZE_PREFIX = {
  xs: 'split-button-xsmall',
  sm: 'split-button-small',
  md: 'split-button-medium',
  lg: 'split-button-large',
  xl: 'split-button-xlarge',
} as const;

const FAB_SIZE_PREFIX = { sm: 'fab-small', md: 'fab-medium', lg: 'fab-large' } as const;
const EXTENDED_FAB_SIZE_PREFIX = {
  sm: 'extended-fab-small',
  md: 'extended-fab-medium',
  lg: 'extended-fab-large',
} as const;
const CHIP_PREFIXES = ['assist-chip', 'filter-chip', 'input-chip', 'suggestion-chip'] as const;

const BUTTON_SIZE_PROPS = [
  'container-height',
  'container-shape-round',
  'container-shape-square',
  'pressed-container-shape',
  'leading-space',
  'trailing-space',
  'icon-label-space',
  'icon-size',
  'outlined-outline-width',
  'selected-container-shape-round',
  'selected-container-shape-square',
] as const;

const ICON_PAD_PROPS: Record<keyof typeof ICON_BUTTON_SIZE_PREFIX, readonly string[]> = {
  xs: ['default-leading-space', 'default-trailing-space', 'narrow-leading-space', 'narrow-trailing-space', 'wide-leading-space', 'wide-trailing-space'],
  sm: ['default-leading-space', 'default-trailing-space', 'narrow-leading-space', 'narrow-trailing-space', 'wide-leading-space', 'wide-trailing-space'],
  md: ['default-leading-space', 'default-trailing-space', 'narrow-leading-space', 'narrow-trailing-space', 'wide-leading-space', 'wide-trailing-space'],
  lg: ['narrow-leading-space', 'narrow-trailing-space', 'wide-leading-space', 'wide-trailing-space', 'uniform-leading-space', 'uniform-trailing-space'],
  xl: ['default-leading-space', 'default-trailing-space', 'narrow-leading-space', 'narrow-trailing-space', 'wide-leading-space', 'wide-trailing-space'],
};

const ICON_BASE_PROPS = [
  'container-height',
  'container-shape-round',
  'container-shape-square',
  'pressed-container-shape',
  'icon-size',
  'outlined-outline-width',
  'selected-container-shape-round',
  'selected-container-shape-square',
] as const;

export function collectSourceFiles(dir = REACT_SRC): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry === '__tests__' || entry === 'node_modules') continue;
      files.push(...collectSourceFiles(path));
    } else if (/\.(tsx?|css)$/.test(entry) && !entry.includes('.test.') && !entry.includes('.a11y.')) {
      files.push(path);
    }
  }
  return files;
}

function toToken(prefix: string, property: string): string {
  return `--md-comp-${prefix}-${property}`;
}

function addToken(set: Set<string>, prefix: string, property: string): void {
  const token = toToken(prefix, property);
  if (VALID_TOKENS.has(token)) set.add(token);
}

function extractPrefixMaps(content: string): Map<string, string[]> {
  const maps = new Map<string, string[]>();
  for (const block of content.match(/(\w+_PREFIX)\s*[^=]*=\s*\{[\s\S]*?\}\s*(?:as const)?;/g) ?? []) {
    const nameMatch = block.match(/^(\w+_PREFIX)/);
    if (!nameMatch) continue;
    const values: string[] = [];
    for (const m of block.matchAll(/:\s*['"]([a-z0-9-]+)['"]/g)) {
      values.push(m[1]!);
    }
    if (values.length > 0) maps.set(nameMatch[1]!, values);
  }
  return maps;
}

function resolveVarPrefixes(varName: string, content: string, maps: Map<string, string[]>): string[] {
  const specials: Record<string, string[]> = {
    sizePrefix: [...Object.values(FAB_SIZE_PREFIX), ...Object.values(EXTENDED_FAB_SIZE_PREFIX)],
    containerPrefix: ['fab-primary-container', 'extended-fab-primary'],
    sizeP: Object.values(SPLIT_BUTTON_SIZE_PREFIX),
    btnP: Object.values(BUTTON_SIZE_PREFIX),
    tokenPrefix: ['filled-text-field', 'outlined-text-field'],
  };
  if (specials[varName]) return specials[varName]!;

  if (varName === 'p' && content.includes('function chipPrefix')) return [...CHIP_PREFIXES];
  if (varName === 'p' && content.includes("const p = 'switch'")) return ['switch'];

  const fromMap = content.match(new RegExp(`const\\s+${varName}\\s*=\\s*(\\w+_PREFIX)`));
  if (fromMap && maps.has(fromMap[1]!)) return maps.get(fromMap[1]!)!;

  const fromFn = content.match(new RegExp(`const\\s+${varName}\\s*=\\s*(\\w+)\\(`));
  if (fromFn?.[1] === 'chipPrefix') return [...CHIP_PREFIXES];

  const direct = content.match(new RegExp(`const\\s+${varName}\\s*=\\s*['"]([a-z0-9-]+)['"]`));
  if (direct) return [direct[1]!];

  const ternary = content.match(
    new RegExp(`const\\s+${varName}[^=]*=\\s*[^?]+\\?\\s*['"]([a-z0-9-]+)['"]\\s*:\\s*['"]([a-z0-9-]+)['"]`),
  );
  if (ternary) return [ternary[1]!, ternary[2]!];

  return [];
}

function expandKnownHelpers(): Set<string> {
  const tokens = new Set<string>();
  for (const prefix of Object.values(BUTTON_SIZE_PREFIX)) {
    for (const prop of BUTTON_SIZE_PROPS) addToken(tokens, prefix, prop);
  }
  for (const [size, prefix] of Object.entries(ICON_BUTTON_SIZE_PREFIX) as Array<
    [keyof typeof ICON_BUTTON_SIZE_PREFIX, string]
  >) {
    for (const prop of ICON_BASE_PROPS) addToken(tokens, prefix, prop);
    for (const prop of ICON_PAD_PROPS[size]) addToken(tokens, prefix, prop);
  }
  for (const prefix of Object.values(SPLIT_BUTTON_SIZE_PREFIX)) {
    for (const prop of [
      'between-space',
      'container-height',
      'container-shape',
      'leading-button-leading-space',
      'leading-button-trailing-space',
      'trailing-button-leading-space',
      'trailing-button-trailing-space',
      'trailing-icon-size',
    ]) {
      addToken(tokens, prefix, prop);
    }
  }
  for (const prefix of CHIP_PREFIXES) {
    for (const prop of ['container-height', 'container-shape', 'icon-size', 'leading-icon-size']) {
      addToken(tokens, prefix, prop);
    }
  }
  return tokens;
}

/** Scan source for static and inferred md-comp token references. */
export function collectReferencedTokens(): Set<string> {
  const files = collectSourceFiles();
  const referenced = new Set<string>();

  for (const t of expandKnownHelpers()) referenced.add(t);

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const maps = extractPrefixMaps(content);

    for (const m of content.matchAll(/--md-comp-[a-z0-9-]+/g)) {
      const token = m[0]!;
      if (VALID_TOKENS.has(token)) referenced.add(token);
    }

    for (const m of content.matchAll(/compVar\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g)) {
      addToken(referenced, m[1]!, m[2]!);
    }

    for (const m of content.matchAll(/compVar\(\s*(\w+)\s*,\s*['"]([^'"]+)['"]\s*\)/g)) {
      const prefixes = resolveVarPrefixes(m[1]!, content, maps);
      for (const prefix of prefixes) addToken(referenced, prefix, m[2]!);
    }
  }

  return referenced;
}
