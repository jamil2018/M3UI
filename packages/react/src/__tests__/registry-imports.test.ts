import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_DIR = join(__dirname, '../../registry/r');

const REQUIRED_NPM_DEPS = ['@m3ui/react', '@m3ui/tokens'];

describe('registry E2E validation', () => {
  const files = readdirSync(REGISTRY_DIR).filter((f) => f.endsWith('.json'));

  it('contains registry JSON for every component', () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
  });

  it.each(files)('%s has no workspace paths', (file) => {
    const content = readFileSync(join(REGISTRY_DIR, file), 'utf-8');
    expect(content).not.toContain('workspace:');
    expect(content).not.toContain('../../');
    expect(content).not.toContain('../primitives');
  });

  it.each(files)('%s declares npm dependencies and @m3ui/react imports', (file) => {
    const json = JSON.parse(readFileSync(join(REGISTRY_DIR, file), 'utf-8')) as {
      dependencies?: string[];
      files?: Array<{ content?: string }>;
    };

    expect(json.dependencies).toBeDefined();
    for (const dep of REQUIRED_NPM_DEPS) {
      expect(json.dependencies).toContain(dep);
    }

    const combined = (json.files ?? []).map((f) => f.content ?? '').join('\n');
    expect(combined).toContain('@m3ui/react');
    expect(combined).not.toMatch(/from ['"]@\/|from ['"]\.\./);
  });

  it('placeholder-button uses published npm specifiers (smoke)', () => {
    const content = readFileSync(join(REGISTRY_DIR, 'placeholder-button.json'), 'utf-8');
    expect(content).toContain('@m3ui/react');
    expect(content).toContain('@m3ui/tokens');
  });
});
