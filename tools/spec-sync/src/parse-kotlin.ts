/**
 * Narrow parser for androidx Material3 token Kotlin files.
 * Parses `internal object X { val Y = Z }` and `inline val Y get() = Z` shapes.
 * Skips internal class files (e.g. TypographyTokens) that delegate to other token objects.
 */

export interface ParsedKotlinTokenFile {
  fileName: string;
  version: string | null;
  objectName: string;
  skipped?: boolean;
  skipReason?: string;
  properties: Record<string, string | number | boolean>;
}

const VERSION_RE = /\/\/\s*VERSION:\s*(\S+)/;
const OBJECT_RE = /internal\s+object\s+(\w+)\s*\{/;
const CLASS_RE = /internal\s+class\s+(\w+)/;

/** val Name = value */
const VAL_ASSIGN_RE = /^\s*(?:inline\s+)?val\s+(\w+)\s*=\s*(.+?)\s*$/;
/** get() = value (single line) */
const GETTER_VALUE_RE =
  /(?:inline\s+)?val\s+(\w+)[^=\n]*\n?\s*get\(\)\s*=\s*(.+?)(?:\n|$)/g;
/** get() = value (same line): inline val X get() = Y */
const INLINE_GETTER_RE = /(?:inline\s+)?val\s+(\w+)\s*\n?\s*get\(\)\s*=\s*(.+)/;

function parseKotlinValue(raw: string): string | number | boolean {
  const trimmed = raw.trim().replace(/,$/, '');

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  if (/^-?\d+\.?\d*[fd]?$/.test(trimmed)) {
    const num = parseFloat(trimmed.replace(/[fd]$/, ''));
    if (!Number.isNaN(num)) return num;
  }

  // 16.sp or 24.0.sp or -0.2.sp
  const spLiteralMatch = /^(-?[\d.]+)\.sp$/.exec(trimmed);
  if (spLiteralMatch?.[1]) return parseFloat(spLiteralMatch[1]);

  const dpMatch = /^Dp\(([\d.]+)\)$/.exec(trimmed);
  if (dpMatch?.[1]) return parseFloat(dpMatch[1]);

  const colorMatch = /^Color\(0x([0-9A-Fa-f]+)u?\)$/.exec(trimmed);
  if (colorMatch?.[1]) return `#${colorMatch[1].slice(-6).toUpperCase()}`;

  const fontWeightMatch = /^FontWeight\.W(\d+)$/.exec(trimmed);
  if (fontWeightMatch?.[1]) return parseInt(fontWeightMatch[1], 10);

  const spMatch = /^TextUnit\(([\d.]+)\.sp\)$/.exec(trimmed);
  if (spMatch?.[1]) return parseFloat(spMatch[1]);

  const shapeKeyMatch = /^ShapeKeyTokens\.(\w+)$/.exec(trimmed);
  if (shapeKeyMatch?.[1]) return shapeKeyMatch[1];

  const typoKeyMatch = /^TypographyKeyTokens\.(\w+)$/.exec(trimmed);
  if (typoKeyMatch?.[1]) return typoKeyMatch[1];

  const motionKeyMatch = /^Motion(?:Scheme)?Tokens\.(\w+)$/.exec(trimmed);
  if (motionKeyMatch?.[1]) return motionKeyMatch[1];

  const elevationKeyMatch = /^Elevation(?:Tokens)?\.(\w+)$/.exec(trimmed);
  if (elevationKeyMatch?.[1]) return elevationKeyMatch[1];

  const typefaceWeightMatch = /^TypefaceTokens\.Weight(\w+)$/.exec(trimmed);
  if (typefaceWeightMatch?.[1]) return `Weight${typefaceWeightMatch[1]}`;

  const typefaceMatch = /^TypefaceTokens\.(\w+)$/.exec(trimmed);
  if (typefaceMatch?.[1]) return typefaceMatch[1];

  const stringMatch = /^"([^"]*)"$/.exec(trimmed);
  if (stringMatch) return stringMatch[1] ?? '';

  const enumMatch = /^(\w+(?:\.\w+)+)$/.exec(trimmed);
  if (enumMatch?.[1]) return enumMatch[1];

  if (/^[A-Z]\w*$/.test(trimmed)) return trimmed;

  const roundedCornerMatch = /^RoundedCornerShape\(([\d.]+)\.dp\)$/.exec(trimmed);
  if (roundedCornerMatch?.[1]) return `RoundedCornerShape(${roundedCornerMatch[1]}.dp)`;

  const percentMatch = /^Percent\(([\d.]+)\)$/.exec(trimmed);
  if (percentMatch?.[1]) return `Percent(${percentMatch[1]})`;

  const constructorMatch = /^(\w+)\((.+)\)$/.exec(trimmed);
  if (constructorMatch?.[1] && constructorMatch[2]) {
    return trimmed;
  }

  throw new Error(`Unrecognized Kotlin value: ${trimmed}`);
}

function extractPropertiesFromBody(body: string, fileName: string): Record<string, string | number | boolean> {
  const properties: Record<string, string | number | boolean> = {};

  // Parse inline getters: val X ... get() = Y (multiline)
  for (const match of body.matchAll(GETTER_VALUE_RE)) {
    const key = match[1];
    const rawValue = match[2];
    if (!key || !rawValue) continue;
    if (rawValue.includes('copy(') || rawValue.includes('DefaultTextStyle')) continue;
    try {
      properties[key] = parseKotlinValue(rawValue.split('\n')[0] ?? rawValue);
    } catch (err) {
      throw new Error(
        `Failed to parse ${fileName}.${key} get() = ${rawValue}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Parse simple val assignments line by line
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;
    if (trimmed.includes('get()')) continue;

    const valMatch = VAL_ASSIGN_RE.exec(trimmed);
    if (!valMatch?.[1] || !valMatch[2]) continue;

    const key = valMatch[1];
    const rawValue = valMatch[2].replace(/,$/, '');

    if (properties[key] !== undefined) continue;

    try {
      properties[key] = parseKotlinValue(rawValue);
    } catch (err) {
      throw new Error(
        `Failed to parse ${fileName}.${key} = ${rawValue}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return properties;
}

export function parseKotlinTokenFile(fileName: string, content: string): ParsedKotlinTokenFile {
  const versionMatch = VERSION_RE.exec(content);

  // Skip internal class files — they use delegation, not direct values
  const classMatch = CLASS_RE.exec(content);
  if (classMatch?.[1] && !OBJECT_RE.test(content)) {
    return {
      fileName,
      version: versionMatch?.[1] ?? null,
      objectName: classMatch[1],
      skipped: true,
      skipReason: 'internal class with delegated getters',
      properties: {},
    };
  }

  const objectMatch = OBJECT_RE.exec(content);
  if (!objectMatch?.[1]) {
    throw new Error(`No internal object found in ${fileName}`);
  }

  const objectName = objectMatch[1];
  const bodyStart = content.indexOf('{', objectMatch.index);
  const bodyEnd = content.lastIndexOf('}');
  const body = content.slice(bodyStart + 1, bodyEnd);

  const properties = extractPropertiesFromBody(body, fileName);

  return {
    fileName,
    version: versionMatch?.[1] ?? null,
    objectName,
    properties,
  };
}

export function parseAllKotlinTokenFiles(
  files: Array<{ name: string; content: string }>,
): Record<string, ParsedKotlinTokenFile> {
  const result: Record<string, ParsedKotlinTokenFile> = {};
  for (const file of files) {
    result[file.name.replace('.kt', '')] = parseKotlinTokenFile(file.name, file.content);
  }
  return result;
}
