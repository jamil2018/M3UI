import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_SOURCE = readFileSync(join(__dirname, 'cli.ts'), 'utf-8');

describe('@m3ui/cli', () => {
  it('uses published @m3ui/tokens CSS entry points for theme output', () => {
    expect(CLI_SOURCE).toContain('@m3ui/tokens/tokens.css');
    expect(CLI_SOURCE).toContain('@m3ui/tokens/theme.css');
    expect(CLI_SOURCE).not.toContain('@m3ui/tokens/dist/');
    expect(CLI_SOURCE).not.toContain('src/generated/');
  });

  it('exposes theme generate subcommand', () => {
    expect(CLI_SOURCE).toContain(".command('generate')");
  });
});
