import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Token = { type?: string; value?: unknown };
type TokenTree = Record<string, unknown>;

const sourcePath = process.argv[2];
if (!sourcePath) {
  throw new Error('Usage: pnpm import:figma <design-tokens.tokens.json>');
}

const raw = readFileSync(resolve(sourcePath), 'utf8');
const source = JSON.parse(raw) as TokenTree;
const outputPath = resolve('packages/tokens/src/spec/figma-design-tokens.json');

function objectAt(...parts: string[]): TokenTree {
  let current: unknown = source;
  for (const part of parts) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) return {};
    current = (current as TokenTree)[part];
  }
  return current && typeof current === 'object' && !Array.isArray(current)
    ? (current as TokenTree)
    : {};
}

function tokenValue(value: unknown): unknown {
  if (value && typeof value === 'object' && 'value' in value) {
    return (value as Token).value;
  }
  return value;
}

function values(tree: TokenTree): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(tree)
      .filter(([key]) => !['description', 'extensions'].includes(key))
      .map(([key, value]) => [key, tokenValue(value)]),
  );
}

const schemeNames = [
  'light',
  'dark',
  'light-medium-contrast',
  'dark-medium-contrast',
  'light-high-contrast',
  'dark-high-contrast',
] as const;

const schemes = Object.fromEntries(
  schemeNames.map((name) => [name, values(objectAt('color', 'm3', 'sys', name))]),
);

const typeScale = Object.fromEntries(
  Object.entries(objectAt('typescale', 'static')).map(([role, roleTree]) => [
    role,
    values(roleTree as TokenTree),
  ]),
);

const elevations = Object.fromEntries(
  ['elevation light', 'elevation dark'].map((mode) => [
    mode.replace('elevation ', ''),
    Object.fromEntries(
      Object.entries(objectAt('effect', 'm3', mode)).map(([level, shadows]) => [
        level,
        Object.values(shadows as TokenTree)
          .map(tokenValue)
          .filter((shadow) => shadow && typeof shadow === 'object' && 'shadowType' in shadow),
      ]),
    ),
  ]),
);

const normalized = {
  source: {
    format: 'Figma Design Tokens',
    sha256: createHash('sha256').update(raw).digest('hex'),
    notes: [
      'User-provided Material 3 Design Kit export.',
      'Font family and weight values are intentionally excluded because the export contains placeholder fonts.',
    ],
  },
  schemes,
  shape: values(objectAt('shape', 'corner')),
  typeScale,
  elevations,
};

writeFileSync(outputPath, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Imported reviewed Figma token subset to ${outputPath}`);
