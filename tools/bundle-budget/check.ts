#!/usr/bin/env tsx
/**
 * Bundle size budget checker — run after `pnpm build`.
 * Fails CI when any package exceeds its byte budget (minified ESM, pre-gzip).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../..');

/** Per-package entry file budgets (raw bytes — minified ESM) */
export const BUNDLE_BUDGETS: Record<string, { path: string; maxKb: number; label: string }[]> = {
  '@m3ui/react': [
    { path: 'packages/react/dist/index.js', maxKb: 210, label: 'main entry' },
    { path: 'packages/react/dist/m3-provider-*.js', maxKb: 10, label: 'M3Provider chunk' },
    { path: 'packages/react/dist/primitives-*.js', maxKb: 10, label: 'primitives chunk' },
  ],
  '@m3ui/tokens': [{ path: 'packages/tokens/dist/index.js', maxKb: 110, label: 'tokens entry' }],
  '@m3ui/shapes': [{ path: 'packages/shapes/dist/index.js', maxKb: 35, label: 'shapes entry' }],
  '@m3ui/color': [{ path: 'packages/color/dist/index.js', maxKb: 8, label: 'color entry' }],
  '@m3ui/motion': [{ path: 'packages/motion/dist/index.js', maxKb: 4, label: 'motion entry' }],
  '@m3ui/icons': [{ path: 'packages/icons/dist/index.js', maxKb: 3, label: 'icons entry' }],
};

function resolvePath(relativePath: string): string | null {
  const full = join(REPO_ROOT, relativePath);
  if (!relativePath.includes('*')) {
    return existsSync(full) ? full : null;
  }
  const dir = dirname(full);
  const pattern = relativePath.split('/').pop()!;
  const prefix = pattern.replace('*', '').replace('.js', '');
  if (!existsSync(dir)) return null;
  const match = readdirSync(dir).find((f) => f.startsWith(prefix) && f.endsWith('.js'));
  return match ? join(dir, match) : null;
}

function measureFile(path: string): { raw: number; gzip: number } {
  const content = readFileSync(path);
  return { raw: content.length, gzip: gzipSync(content).length };
}

function main(): void {
  const rows: Array<{ pkg: string; label: string; rawKb: number; gzipKb: number; maxKb: number; ok: boolean }> =
    [];
  let failed = false;

  for (const [pkg, entries] of Object.entries(BUNDLE_BUDGETS)) {
    for (const entry of entries) {
      const filePath = resolvePath(entry.path);

      if (!filePath) {
        console.error(`Missing build output: ${entry.path} (run pnpm build first)`);
        failed = true;
        continue;
      }

      const { raw, gzip } = measureFile(filePath);
      const rawKb = raw / 1024;
      const gzipKb = gzip / 1024;
      const ok = rawKb <= entry.maxKb;

      rows.push({ pkg, label: entry.label, rawKb, gzipKb, maxKb: entry.maxKb, ok });
      if (!ok) failed = true;
    }
  }

  console.log('\nBundle size report (raw KB / gzip KB / budget KB):\n');
  console.log('| Package | Entry | Raw | Gzip | Budget | Status |');
  console.log('|---------|-------|-----|------|--------|--------|');
  for (const row of rows) {
    const status = row.ok ? 'OK' : 'OVER';
    console.log(
      `| ${row.pkg} | ${row.label} | ${row.rawKb.toFixed(1)} | ${row.gzipKb.toFixed(1)} | ${row.maxKb} | ${status} |`,
    );
  }

  if (failed) {
    console.error('\nBundle size budget exceeded. See docs/BUNDLE_SIZES.md');
    process.exit(1);
  }

  console.log('\nAll bundle budgets passed.');
}

main();
