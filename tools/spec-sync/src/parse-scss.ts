/**
 * Parser for material-web SCSS token files (_md-comp-*.scss, _md-sys-*.scss).
 */

export interface ParsedScssTokenList {
  supported?: string[];
  unsupported?: string[];
  renamed?: Record<string, string>;
}

export interface ParsedScssTokenFile {
  fileName: string;
  variables: Record<string, string>;
  tokenLists: ParsedScssTokenList;
  /** Resolved defaults from generated `@return (...)` maps in version files */
  defaultValues?: Record<string, string>;
}

const VAR_RE = /^\s*\$([\w-]+):\s*(.+?);\s*(?:\/\/.*)?$/;
const CSS_MOTION_VAR_RE = /^\s*(--md-sys-motion-[\w-]+)\s*:\s*(.+?);\s*$/;

/** Multi-line Sass list parser for $supported-tokens / $unsupported-tokens / $renamed-tokens */
const LIST_RE = /\$(supported-tokens|unsupported-tokens|renamed-tokens):\s*\(([\s\S]*?)\);/g;

function normalizeScssValue(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function parseSassListItems(body: string): string[] {
  const items: string[] = [];
  const cleaned = body.replace(/\/\/[^\n]*/g, '');
  for (const raw of cleaned.split(',')) {
    const match = raw.trim().match(/^['"]?([\w-]+)['"]?$/);
    if (match?.[1]) items.push(match[1]);
  }
  return items;
}

function parseRenamedTokens(body: string): Record<string, string> {
  const renamed: Record<string, string> = {};
  const cleaned = body.replace(/\/\/[^\n]*/g, '');
  for (const raw of cleaned.split(',')) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^['"]?([\w-]+)['"]?\s*:\s*['"]?([\w-]+)['"]?$/);
    if (match?.[1] && match[2]) renamed[match[1]] = match[2];
  }
  return renamed;
}

/** Parse token→value pairs from generated `@return (...)` blocks. */
function parseReturnMap(content: string): Record<string, string> {
  const match = content.match(/@return\s*\(\s*([\s\S]*?)\n\s*\)\s*;/);
  if (!match?.[1]) return {};

  const values: Record<string, string> = {};
  const pairRe = /['"]([\w-]+)['"]\s*:\s*([\s\S]*?)(?=,\s*['"][\w-]+['"]\s*:|$)/g;
  let pair: RegExpExecArray | null;
  while ((pair = pairRe.exec(match[1])) !== null) {
    const token = pair[1];
    const raw = pair[2]?.replace(/\s+/g, ' ').trim().replace(/,\s*$/, '') ?? '';
    if (token && raw) values[token] = raw;
  }
  return values;
}

function parseCssCustomProperties(content: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    const match = CSS_MOTION_VAR_RE.exec(trimmed);
    if (match?.[1] && match[2]) props[match[1]] = normalizeScssValue(match[2]);
  }
  return props;
}

/** Resolve labs/gb `#{tokens.$md-sys-motion--*}` refs against latest/sass motion vars. */
export function resolveMotionTokenReferences(
  parsed: Record<string, ParsedScssTokenFile>,
): void {
  const motionSass =
    parsed['latest-sass-md-sys-motion']?.variables ??
    parsed['latest-sass-_md-sys-motion']?.variables;
  if (!motionSass) return;

  const resolveSassValue = (raw: string, depth = 0): string | undefined => {
    if (depth > 4) return undefined;
    const trimmed = raw.trim().replace(/^#\{(.+)\}$/, '$1');
    const tokenRef = trimmed.match(/^tokens\.\$md-sys-motion--([\w-]+)$/);
    if (tokenRef?.[1]) {
      const val = motionSass[tokenRef[1]];
      return val ? resolveSassValue(val, depth + 1) : undefined;
    }
    const sassVar = trimmed.match(/^\$([\w-]+)$/);
    if (sassVar?.[1]) {
      const val = motionSass[sassVar[1]];
      return val ? resolveSassValue(val, depth + 1) : undefined;
    }
    if (trimmed.includes('null') || trimmed.includes('not supported') || trimmed.includes('#{')) {
      return undefined;
    }
    return trimmed;
  };

  for (const [key, file] of Object.entries(parsed)) {
    if (!key.includes('styles-motion')) continue;
    for (const [cssVar, raw] of Object.entries(file.variables)) {
      if (!cssVar.startsWith('--md-sys-motion-')) continue;
      const resolved = resolveSassValue(raw);
      if (resolved) file.variables[cssVar] = resolved;
    }
  }
}

function parseTokenLists(content: string): ParsedScssTokenList {
  const result: ParsedScssTokenList = {};
  LIST_RE.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = LIST_RE.exec(content)) !== null) {
    const kind = match[1];
    const body = match[2] ?? '';
    if (kind === 'supported-tokens') result.supported = parseSassListItems(body);
    else if (kind === 'unsupported-tokens') result.unsupported = parseSassListItems(body);
    else if (kind === 'renamed-tokens') result.renamed = parseRenamedTokens(body);
  }

  return result;
}

export function parseScssTokenFile(fileName: string, content: string): ParsedScssTokenFile {
  const variables: Record<string, string> = { ...parseCssCustomProperties(content) };
  const tokenLists = parseTokenLists(content);
  const defaultValues = parseReturnMap(content);

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('@'))
      continue;

    const match = VAR_RE.exec(line);
    if (!match?.[1] || !match[2]) continue;

    variables[match[1]] = normalizeScssValue(match[2]);
  }

  return {
    fileName,
    variables,
    tokenLists,
    ...(Object.keys(defaultValues).length > 0 ? { defaultValues } : {}),
  };
}

export function parseAllScssTokenFiles(
  files: Array<{ name: string; content: string }>,
): Record<string, ParsedScssTokenFile> {
  const result: Record<string, ParsedScssTokenFile> = {};
  for (const file of files) {
    const key = file.name.replace(/^_/, '').replace('.scss', '');
    result[key] = parseScssTokenFile(file.name, file.content);
  }
  return result;
}
