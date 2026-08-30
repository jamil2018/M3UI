/**
 * Material Web parity report — diffs upstream $supported-tokens against our source references.
 * Outputs docs/PARITY.md and docs/parity-report.json.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { collectReferencedTokens } from '../../../packages/react/src/__tests__/token-coverage-utils.js';
import type { ParsedScssTokenFile } from './parse-scss.js';
import { REPO_ROOT, readJsonFile, writeJsonFile } from './utils.js';

const SPEC_PATH = join(REPO_ROOT, 'packages/tokens/src/spec/material-web-tokens.json');
const TOKENS_CSS_PATH = join(REPO_ROOT, 'packages/tokens/src/generated/tokens.css');
const MD_OUTPUT = join(REPO_ROOT, 'docs/PARITY.md');
const JSON_OUTPUT = join(REPO_ROOT, 'docs/parity-report.json');

interface DriftedToken {
  token: string;
  upstreamAlias: string;
  upstreamDefault: string;
  ours: string;
}

interface ComponentParity {
  specKey: string;
  upstreamVarPrefix: string;
  ourVarPrefix: string;
  supportedCount: number;
  unsupportedCount: number;
  missing: string[];
  extra: string[];
  drifted: DriftedToken[];
}

interface ParityReport {
  generatedAt: string;
  summary: {
    components: number;
    totalMissing: number;
    totalExtra: number;
    totalDrifted: number;
  };
  components: Record<
    string,
    {
      upstreamVarPrefix: string;
      ourVarPrefix: string;
      supportedCount: number;
      unsupportedCount: number;
      missing: string[];
      extra: string[];
      drifted: DriftedToken[];
    }
  >;
}

/** Map our `--md-comp-*` custom property to upstream `--md-*` (no `comp` segment). */
export function ourTokenToUpstreamAlias(token: string): string {
  return token.replace(/^--md-comp-/, '--md-');
}

/** Build our `--md-comp-{prefix}-{name}` from an upstream spec key and bare token name. */
export function toOurToken(specKey: string, tokenName: string): string {
  const prefix = specKey.replace(/^md-comp-/, '');
  return `--md-comp-${prefix}-${tokenName}`;
}

function specPrefix(specKey: string): string {
  return specKey.replace(/^md-comp-/, '');
}

function parseTokensCss(path: string): Map<string, string> {
  const values = new Map<string, string>();
  if (!existsSync(path)) return values;

  const content = readFileSync(path, 'utf-8');
  for (const match of content.matchAll(/(--md-comp-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    values.set(match[1]!, match[2]!.trim());
  }
  return values;
}

/** Normalize upstream Sass defaults and our CSS values for comparison. */
function normalizeValue(raw: string): string {
  let value = raw.trim();

  // map.get($deps, 'md-sys-color', 'primary') → var(--md-sys-color-primary)
  const mapGet = value.match(
    /map\.get\(\$deps,\s*['"]md-sys-([\w-]+)['"],\s*['"]([\w-]+)['"]\)/,
  );
  if (mapGet) {
    return `var(--md-sys-${mapGet[1]}-${mapGet[2]})`;
  }

  // if($exclude-hardcoded-values, null, 24px) → 24px
  const hardcoded = value.match(/if\(\$exclude-hardcoded-values,\s*null,\s*(.+?)\)/);
  if (hardcoded) value = hardcoded[1]!.trim();

  // var(--md-filled-button-foo, #{$value}) → strip wrapper
  const varFallback = value.match(/^var\(--md-[^,]+,\s*(.+)\)$/);
  if (varFallback) value = varFallback[1]!.trim();

  return value.replace(/\s+/g, ' ');
}

function findVersionDefaults(
  specKey: string,
  allSpecs: Record<string, ParsedScssTokenFile>,
): Record<string, string> | undefined {
  const baseName = specKey.replace(/^md-comp-/, '');
  const candidates = [
    `versions-v0_192-md-comp-${baseName}`,
    `versions-latest-md-comp-${baseName}`,
    `latest-sass-md-comp-${baseName}`,
  ];

  for (const key of candidates) {
    const entry = allSpecs[key];
    if (entry?.defaultValues && Object.keys(entry.defaultValues).length > 0) {
      return entry.defaultValues;
    }
  }
  return undefined;
}

function tokensForPrefix(referenced: Set<string>, prefix: string): Set<string> {
  const needle = `--md-comp-${prefix}-`;
  const result = new Set<string>();
  for (const token of referenced) {
    if (token.startsWith(needle)) result.add(token);
  }
  return result;
}

function buildComponentParity(
  specKey: string,
  spec: ParsedScssTokenFile,
  referenced: Set<string>,
  ourCssValues: Map<string, string>,
  allSpecs: Record<string, ParsedScssTokenFile>,
): ComponentParity | null {
  if (!specKey.startsWith('md-comp-') || !spec.tokenLists.supported?.length) {
    return null;
  }

  const prefix = specPrefix(specKey);
  const ourPrefix = `--md-comp-${prefix}`;
  const upstreamPrefix = `--md-${prefix}`;
  const supported = new Set(spec.tokenLists.supported);
  const renamed = spec.tokenLists.renamed ?? {};

  // Apply upstream renames to the supported set for matching
  const effectiveSupported = new Set(supported);
  for (const [oldName, newName] of Object.entries(renamed)) {
    if (supported.has(oldName)) {
      effectiveSupported.delete(oldName);
      effectiveSupported.add(newName);
    }
  }

  const ourTokens = tokensForPrefix(referenced, prefix);
  const missing: string[] = [];
  const extra: string[] = [];
  const drifted: DriftedToken[] = [];

  for (const tokenName of effectiveSupported) {
    const ourToken = toOurToken(specKey, tokenName);
    if (!referenced.has(ourToken)) missing.push(ourToken);
  }

  for (const ourToken of ourTokens) {
    const bare = ourToken.slice(ourPrefix.length + 1);
    if (!effectiveSupported.has(bare)) extra.push(ourToken);
  }

  const versionDefaults = findVersionDefaults(specKey, allSpecs);
  if (versionDefaults) {
    for (const tokenName of effectiveSupported) {
      const upstreamRaw = versionDefaults[tokenName];
      const ourToken = toOurToken(specKey, tokenName);
      const ours = ourCssValues.get(ourToken);
      if (!upstreamRaw || !ours) continue;

      const upstreamNorm = normalizeValue(upstreamRaw);
      const oursNorm = normalizeValue(ours);
      if (upstreamNorm !== oursNorm) {
        drifted.push({
          token: ourToken,
          upstreamAlias: `${upstreamPrefix}-${tokenName}`,
          upstreamDefault: upstreamNorm,
          ours: oursNorm,
        });
      }
    }
  }

  missing.sort();
  extra.sort();
  drifted.sort((a, b) => a.token.localeCompare(b.token));

  return {
    specKey,
    upstreamVarPrefix: upstreamPrefix,
    ourVarPrefix: ourPrefix,
    supportedCount: spec.tokenLists.supported.length,
    unsupportedCount: spec.tokenLists.unsupported?.length ?? 0,
    missing,
    extra,
    drifted,
  };
}

function renderMarkdown(report: ParityReport, orderedKeys: string[]): string {
  const lines: string[] = [
    '# Material Web Parity Report',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    'Compares upstream material-web `$supported-tokens` contracts against tokens referenced in `@m3ui/react` source.',
    'Upstream emits `--md-{component}-*` custom properties; we use `--md-comp-{component}-*` via `compVar()`.',
    '',
    '## Summary',
    '',
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Components with contracts | ${report.summary.components} |`,
    `| Missing upstream tokens | ${report.summary.totalMissing} |`,
    `| Extra tokens (no upstream counterpart) | ${report.summary.totalExtra} |`,
    `| Value drift | ${report.summary.totalDrifted} |`,
    '',
    '## Per-component',
    '',
  ];

  for (const specKey of orderedKeys) {
    const comp = report.components[specKey]!;
    lines.push(`### \`${specKey}\``);
    lines.push('');
    lines.push(
      `- Upstream prefix: \`${comp.upstreamVarPrefix}-*\` · Our prefix: \`${comp.ourVarPrefix}-*\``,
    );
    lines.push(
      `- Contract: ${comp.supportedCount} supported, ${comp.unsupportedCount} unsupported`,
    );

    if (comp.missing.length === 0 && comp.extra.length === 0 && comp.drifted.length === 0) {
      lines.push('- **Status: parity OK**');
    } else {
      if (comp.missing.length > 0) {
        lines.push(`- **Missing (${comp.missing.length})** — upstream supported, not referenced in source:`);
        for (const t of comp.missing) lines.push(`  - \`${t}\` → upstream \`${ourTokenToUpstreamAlias(t)}\``);
      }
      if (comp.extra.length > 0) {
        lines.push(`- **Extra (${comp.extra.length})** — referenced in source, not upstream supported:`);
        for (const t of comp.extra) lines.push(`  - \`${t}\``);
      }
      if (comp.drifted.length > 0) {
        lines.push(`- **Drifted (${comp.drifted.length})** — different resolved defaults:`);
        for (const d of comp.drifted) {
          lines.push(`  - \`${d.token}\`: upstream \`${d.upstreamDefault}\` vs ours \`${d.ours}\``);
        }
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main(): Promise<void> {
  if (!existsSync(SPEC_PATH)) {
    throw new Error(`Missing ${SPEC_PATH} — run pnpm spec:sync first`);
  }

  const allSpecs = await readJsonFile<Record<string, ParsedScssTokenFile>>(SPEC_PATH);
  const referenced = collectReferencedTokens();
  const ourCssValues = parseTokensCss(TOKENS_CSS_PATH);

  const componentMap: ParityReport['components'] = {};
  const orderedKeys: string[] = [];

  for (const [specKey, spec] of Object.entries(allSpecs)) {
    const parity = buildComponentParity(specKey, spec, referenced, ourCssValues, allSpecs);
    if (!parity) continue;
    orderedKeys.push(specKey);
    componentMap[specKey] = {
      upstreamVarPrefix: parity.upstreamVarPrefix,
      ourVarPrefix: parity.ourVarPrefix,
      supportedCount: parity.supportedCount,
      unsupportedCount: parity.unsupportedCount,
      missing: parity.missing,
      extra: parity.extra,
      drifted: parity.drifted,
    };
  }

  orderedKeys.sort((a, b) => a.localeCompare(b));

  const entries = Object.values(componentMap);
  const report: ParityReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      components: entries.length,
      totalMissing: entries.reduce((n, c) => n + c.missing.length, 0),
      totalExtra: entries.reduce((n, c) => n + c.extra.length, 0),
      totalDrifted: entries.reduce((n, c) => n + c.drifted.length, 0),
    },
    components: componentMap,
  };

  await writeJsonFile(JSON_OUTPUT, report);

  const { writeFile, mkdir } = await import('node:fs/promises');
  await mkdir(join(REPO_ROOT, 'docs'), { recursive: true });
  await writeFile(MD_OUTPUT, renderMarkdown(report, orderedKeys), 'utf-8');

  console.log('Parity report generated:');
  console.log(`  ${MD_OUTPUT}`);
  console.log(`  ${JSON_OUTPUT}`);
  console.log(
    `  ${report.summary.components} components · ${report.summary.totalMissing} missing · ${report.summary.totalExtra} extra · ${report.summary.totalDrifted} drifted`,
  );
}

main().catch((err: unknown) => {
  console.error('Parity report failed:', err);
  process.exit(1);
});
