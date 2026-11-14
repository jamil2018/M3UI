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
const FIELD_PREFIXES = ['filled-text-field', 'outlined-text-field'] as const;
const BUTTON_VARIANT_PREFIXES = [
  'elevated-button',
  'filled-button',
  'filled-tonal-button',
  'outlined-button',
  'text-button',
] as const;
const ICON_BUTTON_VARIANT_PREFIXES = [
  'icon-button',
  'filled-icon-button',
  'filled-tonal-icon-button',
  'outlined-icon-button',
] as const;

const FIELD_STATE_PREFIXES = [
  '',
  'disabled-',
  'error-',
  'error-focus-',
  'error-hover-',
  'focus-',
  'hover-',
] as const;

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

/** Properties referenced via Slider component. */
const SLIDER_HELPER_PROPS = [
  'active-handle-leading-space',
  'active-handle-padding',
  'active-track-color',
  'active-track-height',
  'active-track-shape',
  'disabled-active-track-color',
  'disabled-handle-color',
  'disabled-handle-width',
  'disabled-inactive-track-color',
  'disabled-stop-color',
  'focus-handle-width',
  'handle-color',
  'handle-height',
  'handle-shape',
  'handle-width',
  'inactive-track-color',
  'inactive-track-height',
  'inactive-track-shape',
  'label-text-color',
  'pressed-handle-color',
  'pressed-handle-width',
  'stop-indicator-color',
  'stop-indicator-color-selected',
  'stop-indicator-shape',
  'stop-indicator-size',
  'stop-indicator-trailing-space',
  'value-indicator-active-bottom-space',
  'value-indicator-container-color',
  'value-indicator-label-text-color',
] as const;
const CHECKBOX_HELPER_PROPS = [
  'container-size',
  'container-shape',
  'icon-size',
  'state-layer-size',
  'state-layer-shape',
  'selected-container-color',
  'selected-disabled-container-color',
  'selected-disabled-icon-color',
  'selected-icon-color',
  'selected-hover-container-color',
  'selected-hover-icon-color',
  'selected-pressed-container-color',
  'selected-pressed-icon-color',
  'selected-outline-width',
  'selected-hover-state-layer-color',
  'selected-hover-state-layer-opacity',
  'selected-pressed-state-layer-color',
  'selected-pressed-state-layer-opacity',
  'selected-error-container-color',
  'selected-error-hover-container-color',
  'selected-error-hover-icon-color',
  'selected-error-pressed-container-color',
  'selected-error-pressed-icon-color',
  'selected-error-icon-color',
  'unselected-outline-color',
  'unselected-outline-width',
  'unselected-disabled-outline-color',
  'unselected-hover-outline-color',
  'unselected-hover-outline-width',
  'unselected-pressed-outline-color',
  'unselected-pressed-outline-width',
  'unselected-hover-icon-color',
  'unselected-pressed-icon-color',
  'unselected-error-outline-color',
  'unselected-error-hover-outline-color',
  'unselected-error-pressed-outline-color',
  'unselected-hover-state-layer-color',
  'unselected-hover-state-layer-opacity',
  'unselected-pressed-state-layer-color',
  'unselected-pressed-state-layer-opacity',
  'error-hover-state-layer-color',
  'error-hover-state-layer-opacity',
  'error-pressed-state-layer-color',
  'error-pressed-state-layer-opacity',
] as const;

/** Dynamic getChipStyles / chip shell keys expanded across chip prefixes. */
const CHIP_HELPER_PROPS = [
  'container-height',
  'container-shape',
  'icon-size',
  'leading-icon-size',
  'disabled-icon-color',
  'disabled-leading-icon-color',
  'selected-leading-icon-color',
  'unselected-leading-icon-color',
  'leading-icon-color',
  'label-text-color',
  'disabled-label-text-color',
  'hover-label-text-color',
  'focus-label-text-color',
  'pressed-label-text-color',
  'hover-state-layer-color',
  'hover-state-layer-opacity',
  'pressed-state-layer-color',
  'pressed-state-layer-opacity',
  'flat-outline-width',
  'flat-outline-color',
  'flat-disabled-outline-color',
  'flat-disabled-selected-container-color',
  'flat-container-elevation',
  'elevated-container-color',
  'elevated-disabled-container-color',
  'elevated-container-elevation',
  'elevated-hover-container-elevation',
  'elevated-focus-container-elevation',
  'elevated-pressed-container-elevation',
  'selected-label-text-color',
  'unselected-label-text-color',
  'selected-hover-label-text-color',
  'unselected-hover-label-text-color',
  'selected-focus-label-text-color',
  'unselected-focus-label-text-color',
  'selected-pressed-label-text-color',
  'unselected-pressed-label-text-color',
  'selected-hover-state-layer-color',
  'unselected-hover-state-layer-color',
  'selected-hover-state-layer-opacity',
  'unselected-hover-state-layer-opacity',
  'selected-pressed-state-layer-color',
  'unselected-pressed-state-layer-color',
  'selected-pressed-state-layer-opacity',
  'unselected-pressed-state-layer-opacity',
  'selected-container-color',
  'selected-outline-width',
  'unselected-outline-width',
  'unselected-outline-color',
  'disabled-unselected-outline-color',
  'disabled-selected-container-color',
  'container-elevation',
  'flat-selected-container-color',
  'flat-selected-outline-width',
  'flat-unselected-outline-width',
  'flat-unselected-outline-color',
  'flat-disabled-unselected-outline-color',
  'elevated-selected-container-color',
  'elevated-unselected-container-color',
] as const;

/** Properties referenced via getVariantStyles / elevationFor / labelColor / outlineColor. */
const BUTTON_VARIANT_HELPER_PROPS = [
  'container-color',
  'disabled-container-color',
  'container-elevation',
  'disabled-container-elevation',
  'hover-container-elevation',
  'focus-container-elevation',
  'pressed-container-elevation',
  'label-text-color',
  'label-color',
  'disabled-label-text-color',
  'disabled-label-color',
  'hover-label-text-color',
  'focus-label-text-color',
  'pressed-label-text-color',
  'outline-color',
  'disabled-outline-color',
  'hovered-outline-color',
  'focused-outline-color',
  'pressed-outline-color',
  'icon-color',
  'disabled-icon-color',
  'hover-icon-color',
  'focus-icon-color',
  'pressed-icon-color',
  'container-height',
  'container-shape',
  'icon-size',
  'label-text-font',
  'label-text-size',
  'label-text-line-height',
  'label-text-weight',
] as const;

const FIELD_HELPER_BASES = [
  'container-color',
  'active-indicator-color',
  'outline-color',
  'label-color',
  'input-color',
  'caret-color',
  'supporting-color',
  'leading-icon-color',
  'trailing-icon-color',
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

/**
 * Resolve a dynamic `compVar(varName, …)` / `compElevation(varName, …)` prefix.
 * Recognizes Phase 3–4 helpers (getVariantStyles, getCheckboxColors, getChipStyles,
 * fieldToken) without requiring dead `*_CONTRACT` dumps.
 */
function resolveVarPrefixes(varName: string, content: string, maps: Map<string, string[]>): string[] {
  const specials: Record<string, string[]> = {
    sizePrefix: [...Object.values(FAB_SIZE_PREFIX), ...Object.values(EXTENDED_FAB_SIZE_PREFIX)],
    containerPrefix: ['fab-primary-container', 'extended-fab-primary'],
    sizeP: Object.values(SPLIT_BUTTON_SIZE_PREFIX),
    btnP: Object.values(BUTTON_SIZE_PREFIX),
    tokenPrefix: [...FIELD_PREFIXES],
    prefixToken: [...FIELD_PREFIXES],
    RADIO: ['radio'],
  };
  if (specials[varName]) return specials[varName];

  if (varName === 'p') {
    if (content.includes('function chipPrefix') || content.includes('function getChipStyles')) {
      return [...CHIP_PREFIXES];
    }
    if (content.includes('function getCheckboxColors') || content.includes("const p = 'checkbox'")) {
      return ['checkbox'];
    }
    if (content.includes("const p = 'switch'")) return ['switch'];
    if (content.includes('function getVariantStyles') || content.includes('function elevationFor')) {
      return [...BUTTON_VARIANT_PREFIXES];
    }
    if (content.includes('function getIconButtonVariantStyles') || content.includes('function stateLayerTokens')) {
      return [...ICON_BUTTON_VARIANT_PREFIXES];
    }
  }

  if (
    (varName === 'prefix' || varName === 'prefixToken') &&
    (content.includes('fieldTokenPrefix') || content.includes('function fieldToken'))
  ) {
    return [...FIELD_PREFIXES];
  }

  const fromMap = content.match(new RegExp(`const\\s+${varName}\\s*=\\s*(\\w+_PREFIX)`));
  if (fromMap && maps.has(fromMap[1]!)) return maps.get(fromMap[1]!)!;

  const fromBracket = content.match(new RegExp(`const\\s+${varName}\\s*=\\s*(\\w+_PREFIX)\\[`));
  if (fromBracket && maps.has(fromBracket[1]!)) return maps.get(fromBracket[1]!)!;

  const fromFn = content.match(new RegExp(`const\\s+${varName}\\s*=\\s*(\\w+)\\(`));
  if (fromFn?.[1] === 'chipPrefix') return [...CHIP_PREFIXES];
  if (fromFn?.[1] === 'fieldTokenPrefix') return [...FIELD_PREFIXES];

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
      'inner-corner-corner-size',
      'inner-pressed-corner-corner-size',
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
    for (const prop of CHIP_HELPER_PROPS) addToken(tokens, prefix, prop);
  }
  for (const prefix of BUTTON_VARIANT_PREFIXES) {
    for (const prop of BUTTON_VARIANT_HELPER_PROPS) addToken(tokens, prefix, prop);
  }
  for (const prefix of ICON_BUTTON_VARIANT_PREFIXES) {
    for (const prop of [
      'color',
      'container-color',
      'disabled-container-color',
      'selected-container-color',
      'outline-color',
      'disabled-outline-color',
      'hover-state-layer-color',
      'hover-state-layer-opacity',
      'pressed-state-layer-color',
      'pressed-state-layer-opacity',
      'selected-hover-state-layer-color',
      'selected-hover-state-layer-opacity',
      'selected-pressed-state-layer-color',
      'selected-pressed-state-layer-opacity',
      'disabled-icon-color',
      'selected-icon-color',
    ]) {
      addToken(tokens, prefix, prop);
    }
  }
  for (const prop of CHECKBOX_HELPER_PROPS) addToken(tokens, 'checkbox', prop);

  for (const prefix of FIELD_PREFIXES) {
    for (const base of FIELD_HELPER_BASES) {
      for (const state of FIELD_STATE_PREFIXES) {
        addToken(tokens, prefix, `${state}${base}`);
      }
    }
    for (const prop of [
      'container-shape',
      'container-height',
      'leading-space',
      'active-indicator-height',
      'outline-width',
      'focus-outline-width',
      'hover-outline-width',
      'trailing-icon-size',
    ]) {
      addToken(tokens, prefix, prop);
    }
  }

  for (const prop of SLIDER_HELPER_PROPS) addToken(tokens, 'slider', prop);
  for (const prop of [
    'item-container-shape',
    'item-container-expressive-shape',
    'item-selected-container-shape',
    'item-selected-label-text-color',
    'item-selected-supporting-text-color',
    'item-selected-overline-color',
    'item-selected-leading-icon-color',
    'item-selected-trailing-icon-color',
  ]) {
    addToken(tokens, 'list', prop);
  }
  addToken(tokens, 'list-item', 'container-shape');
  addToken(tokens, 'docked-toolbar', 'container-shape');
  return tokens;
}

/** Expand `fieldToken(prefix, 'base', state)` into all interaction-state suffixes. */
function expandFieldTokenCalls(content: string, maps: Map<string, string[]>, referenced: Set<string>): void {
  for (const m of content.matchAll(/fieldToken\(\s*(\w+)\s*,\s*['"]([^'"]+)['"]/g)) {
    const prefixes = resolveVarPrefixes(m[1]!, content, maps);
    const resolved = prefixes.length > 0 ? prefixes : [...FIELD_PREFIXES];
    for (const prefix of resolved) {
      for (const state of FIELD_STATE_PREFIXES) {
        addToken(referenced, prefix, `${state}${m[2]!}`);
      }
    }
  }
}

/**
 * Expand template-literal property keys used by getChipStyles / fieldToken helpers,
 * e.g. compVar(p, `${sel}-pressed-label-text-color`) or compVar(p, `flat-${sel}-outline-width`).
 */
function expandTemplateCompVars(content: string, maps: Map<string, string[]>, referenced: Set<string>): void {
  for (const m of content.matchAll(
    /compVar\(\s*(\w+)\s*,\s*`(?:\$\{[^}]+\}-)+([^`$]+)`/g,
  )) {
    const prefixes = resolveVarPrefixes(m[1]!, content, maps);
    const rest = m[2]!;
    const selVariants = ['selected', 'unselected'];
    for (const prefix of prefixes) {
      for (const sel of selVariants) {
        addToken(referenced, prefix, `${sel}-${rest}`);
        addToken(referenced, prefix, `flat-${sel}-${rest}`);
        addToken(referenced, prefix, `elevated-${sel}-${rest}`);
      }
      // fieldToken-style: disabled-/error-/focus-/hover- + base
      for (const state of FIELD_STATE_PREFIXES) {
        if (state) addToken(referenced, prefix, `${state}${rest}`);
      }
    }
  }

  // Ternary property keys: selected ? 'a' : 'b'
  for (const m of content.matchAll(
    /compVar\(\s*(\w+)\s*,\s*[^'"`]*\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g,
  )) {
    const prefixes = resolveVarPrefixes(m[1]!, content, maps);
    for (const prefix of prefixes) {
      addToken(referenced, prefix, m[2]!);
      addToken(referenced, prefix, m[3]!);
    }
  }
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
      const token = m[0];
      if (VALID_TOKENS.has(token)) referenced.add(token);
    }

    for (const m of content.matchAll(/compVar\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g)) {
      addToken(referenced, m[1]!, m[2]!);
    }

    for (const m of content.matchAll(/compVar\(\s*(\w+)\s*,\s*['"]([^'"]+)['"]\s*\)/g)) {
      const prefixes = resolveVarPrefixes(m[1]!, content, maps);
      for (const prefix of prefixes) addToken(referenced, prefix, m[2]!);
    }

    for (const m of content.matchAll(/compElevation\(\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]+)['"])?\s*\)/g)) {
      addToken(referenced, m[1]!, m[2] ?? 'container-elevation');
    }

    for (const m of content.matchAll(/compElevation\(\s*(\w+)\s*(?:,\s*['"]([^'"]+)['"])?\s*\)/g)) {
      const prefixes = resolveVarPrefixes(m[1]!, content, maps);
      for (const prefix of prefixes) addToken(referenced, prefix, m[2] ?? 'container-elevation');
    }

    expandFieldTokenCalls(content, maps, referenced);
    expandTemplateCompVars(content, maps, referenced);
  }

  return referenced;
}
