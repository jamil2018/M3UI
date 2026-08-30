/**
 * Ingest material-web spec JSON (post spec-sync Phase 0) into codegen inputs.
 *
 * Expected material-web-tokens.json shape after spec-sync upgrade:
 * {
 *   "md-comp-filled-button": {
 *     "fileName": "_md-comp-filled-button.scss",
 *     "variables": { ... scalar $vars from _md-sys-* / values files },
 *     "tokenLists": {
 *       "supported": ["container-color", ...],
 *       "unsupported": ["focus-state-layer-color", ...],
 *       "renamed": { "old-name": "new-name" }
 *     }
 *   },
 *   "sass-md-comp-button-medium": { ... resolved defaults from tokens/versions/latest/sass }
 * }
 *
 * Run `pnpm spec:sync` then `pnpm tokens:codegen` once spec-sync workers land the new JSON.
 */

export interface MaterialWebTokenLists {
  supported?: string[];
  unsupported?: string[];
  renamed?: Record<string, string>;
}

export interface MaterialWebTokenFile {
  fileName: string;
  variables: Record<string, string>;
  tokenLists?: MaterialWebTokenLists;
}

export type MaterialWebSpec = Record<string, MaterialWebTokenFile>;

/** Upstream emits --md-filled-button-*; M3UI uses --md-comp-filled-button-* via compVar(). */
const COMP_ALIAS_PREFIXES: Record<string, string> = {
  'md-comp-filled-button': 'md-filled-button',
  'md-comp-outlined-button': 'md-outlined-button',
  'md-comp-elevated-button': 'md-elevated-button',
  'md-comp-filled-tonal-button': 'md-filled-tonal-button',
  'md-comp-text-button': 'md-text-button',
  'md-comp-filled-icon-button': 'md-filled-icon-button',
  'md-comp-outlined-icon-button': 'md-outlined-icon-button',
  'md-comp-filled-tonal-icon-button': 'md-filled-tonal-icon-button',
  'md-comp-icon-button': 'md-icon-button',
  'md-comp-fab': 'md-fab',
  'md-comp-checkbox': 'md-checkbox',
  'md-comp-radio': 'md-radio',
  'md-comp-switch': 'md-switch',
  'md-comp-divider': 'md-divider',
  'md-comp-list': 'md-list',
  'md-comp-menu': 'md-menu',
  'md-comp-badge': 'md-badge',
  'md-comp-chip': 'md-chip',
  'md-comp-assist-chip': 'md-assist-chip',
  'md-comp-filter-chip': 'md-filter-chip',
  'md-comp-input-chip': 'md-input-chip',
  'md-comp-suggestion-chip': 'md-suggestion-chip',
  'md-comp-elevated-card': 'md-elevated-card',
  'md-comp-filled-card': 'md-filled-card',
  'md-comp-outlined-card': 'md-outlined-card',
  'md-comp-dialog': 'md-dialog',
  'md-comp-slider': 'md-slider',
  'md-comp-filled-text-field': 'md-filled-text-field',
  'md-comp-outlined-text-field': 'md-outlined-text-field',
  'md-comp-filled-select': 'md-filled-select',
  'md-comp-outlined-select': 'md-outlined-select',
  'md-comp-primary-tab': 'md-primary-tab',
  'md-comp-secondary-tab': 'md-secondary-tab',
  'md-comp-linear-progress': 'md-linear-progress',
  'md-comp-circular-progress': 'md-circular-progress',
};

export function hasMaterialWebContract(spec: MaterialWebSpec): boolean {
  const filled = spec['md-comp-filled-button'];
  return Boolean(filled?.tokenLists?.supported && filled.tokenLists.supported.length > 0);
}

export function upstreamCssVarName(compKey: string, tokenSuffix: string): string {
  const alias = COMP_ALIAS_PREFIXES[compKey];
  const prefix = alias ?? compKey.replace(/^md-comp-/, 'md-');
  return `--${prefix}-${tokenSuffix}`;
}

export function m3uiCompVarName(compKey: string, tokenSuffix: string): string {
  return `--md-comp-${compKey.replace(/^md-comp-/, '')}-${tokenSuffix}`;
}

export interface ResolvedCompToken {
  compKey: string;
  suffix: string;
  cssVar: string;
  upstreamVar: string;
  value?: string;
  supported: boolean;
}

/** Collect supported token contracts from all md-comp-* wrapper files. */
export function collectSupportedContracts(spec: MaterialWebSpec): Map<string, MaterialWebTokenLists> {
  const contracts = new Map<string, MaterialWebTokenLists>();
  for (const [key, file] of Object.entries(spec)) {
    if (!key.startsWith('md-comp-') || !file.tokenLists?.supported?.length) continue;
    contracts.set(key, file.tokenLists);
  }
  return contracts;
}

export function resolveScssTokenValue(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('map.get') || trimmed.startsWith('if(')) return undefined;
  if (/^[\d.]+px$/.test(trimmed) || /^[\d.]+$/.test(trimmed)) return trimmed;
  if (trimmed.startsWith('var(') || trimmed === 'none' || trimmed.startsWith('#')) return trimmed;

  const refMatch = /^md-sys-(.+)\.\$(.+)$/.exec(trimmed);
  if (refMatch) {
    const [, category, token] = refMatch;
    return `var(--md-sys-${category}-${token})`;
  }

  return undefined;
}

/** Find resolved default values from tokens/versions/latest/sass entries (prefixed keys in spec). */
export function findResolvedValues(
  spec: MaterialWebSpec,
  compKey: string,
  tokenSuffix: string,
): string | undefined {
  const needle = compKey.replace(/^md-comp-/, '');
  const orderedKeys = [
    ...Object.keys(spec).filter((k) => k.startsWith('latest-sass-')),
    ...Object.keys(spec).filter(
      (k) => (k.includes('sass') || k.includes('v0_192')) && !k.startsWith('latest-sass-'),
    ),
  ];

  for (const key of orderedKeys) {
    if (!key.includes(needle)) continue;
    const raw = spec[key]?.variables[tokenSuffix];
    if (!raw) continue;
    const resolved = resolveScssTokenValue(raw);
    if (resolved) return resolved;
  }
  return undefined;
}

export function expandContractToCssVars(spec: MaterialWebSpec, compKey: string): ResolvedCompToken[] {
  const lists = spec[compKey]?.tokenLists;
  if (!lists?.supported?.length) return [];

  return lists.supported
    .map((suffix) => {
      const raw = findResolvedValues(spec, compKey, suffix) ?? spec[compKey]?.variables[suffix];
      const value = raw ? resolveScssTokenValue(raw) : undefined;
      return {
        compKey,
        suffix,
        cssVar: m3uiCompVarName(compKey, suffix),
        upstreamVar: upstreamCssVarName(compKey, suffix),
        value,
        supported: true,
      };
    })
    .filter((token) => token.value !== undefined);
}

/** Motion custom properties from labs/gb/styles/motion SCSS entries in spec. */
export function extractMotionTokensFromSpec(spec: MaterialWebSpec): Record<string, string> {
  const motion: Record<string, string> = {};

  const isUsableMotionValue = (value: string): boolean =>
    Boolean(value) &&
    !value.includes('#{') &&
    !value.includes('tokens.$') &&
    !value.includes('null') &&
    !value.includes('not supported');

  for (const [key, file] of Object.entries(spec)) {
    if (!key.includes('styles-motion')) continue;
    for (const [varName, raw] of Object.entries(file.variables)) {
      if (!varName.startsWith('--md-sys-motion-')) continue;
      const resolved = resolveScssTokenValue(raw) ?? raw;
      if (isUsableMotionValue(resolved)) motion[varName] = resolved;
    }
  }

  const sassMotion = spec['latest-sass-md-sys-motion'] ?? spec['latest-sass-_md-sys-motion'];
  const sassVars = sassMotion?.variables ?? {};

  const resolveSassMotion = (raw: string, depth = 0): string | undefined => {
    if (depth > 4) return undefined;
    const trimmed = raw.trim();
    const sassRef = trimmed.match(/^\$([\w-]+)$/);
    if (sassRef?.[1]) {
      const next = sassVars[sassRef[1]];
      return next ? resolveSassMotion(next, depth + 1) : undefined;
    }
    return isUsableMotionValue(trimmed) ? trimmed : undefined;
  };

  for (const [varName, raw] of Object.entries(sassVars)) {
    if (!varName.startsWith('duration-') && !varName.startsWith('easing-')) continue;
    const cssName = `--md-sys-motion-${varName}`;
    if (motion[cssName]) continue;
    const resolved = resolveSassMotion(raw);
    if (resolved) motion[cssName] = resolved;
  }

  return motion;
}

export interface MaterialWebIngestSummary {
  contractFiles: number;
  resolvedVarCount: number;
  motionVarCount: number;
  filledButtonSupported?: number;
  filledButtonUnsupported?: number;
}

export function summarizeMaterialWebIngest(spec: MaterialWebSpec): MaterialWebIngestSummary {
  const contracts = collectSupportedContracts(spec);
  let resolvedVarCount = 0;
  for (const compKey of contracts.keys()) {
    resolvedVarCount += expandContractToCssVars(spec, compKey).filter((t) => t.value).length;
  }
  const filled = spec['md-comp-filled-button']?.tokenLists;
  return {
    contractFiles: contracts.size,
    resolvedVarCount,
    motionVarCount: Object.keys(extractMotionTokensFromSpec(spec)).length,
    filledButtonSupported: filled?.supported?.length,
    filledButtonUnsupported: filled?.unsupported?.length,
  };
}
