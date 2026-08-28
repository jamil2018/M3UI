import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('RSC client boundary audit', () => {
  it('tsdown config sets use client banner on all react bundles', () => {
    const config = readFileSync(join(__dirname, '../../tsdown.config.ts'), 'utf-8');
    expect(config).toContain('"use client"');
    expect(config).toContain('banner');
  });

  it('icons package also ships client banner for React wrapper', () => {
    const config = readFileSync(
      join(__dirname, '../../../icons/tsdown.config.ts'),
      'utf-8',
    );
    expect(config).toContain('"use client"');
  });

  it('provider and primitives are separate subpath exports for selective client boundaries', () => {
    const pkg = JSON.parse(
      readFileSync(join(__dirname, '../../package.json'), 'utf-8'),
    ) as { exports: Record<string, unknown> };
    expect(pkg.exports['./provider']).toBeDefined();
    expect(pkg.exports['./primitives']).toBeDefined();
  });

  it('M3Provider and window size class hooks are client-only modules', () => {
    const provider = readFileSync(join(__dirname, '../provider/m3-provider.tsx'), 'utf-8');
    expect(provider).toMatch(/window|matchMedia|useEffect/);
    const wsc = readFileSync(join(__dirname, '../lib/window-size-class.tsx'), 'utf-8');
    expect(wsc).toContain('useEffect');
  });
});
