/**
 * Parser for material-web SCSS token files (_md-comp-*.scss, _md-sys-*.scss).
 */

export interface ParsedScssTokenFile {
  fileName: string;
  variables: Record<string, string>;
}

const VAR_RE = /^\s*\$([\w-]+):\s*(.+?);\s*(?:\/\/.*)?$/;

function normalizeScssValue(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

export function parseScssTokenFile(fileName: string, content: string): ParsedScssTokenFile {
  const variables: Record<string, string> = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('@'))
      continue;

    const match = VAR_RE.exec(line);
    if (!match?.[1] || !match[2]) continue;

    variables[match[1]] = normalizeScssValue(match[2]);
  }

  return { fileName, variables };
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
