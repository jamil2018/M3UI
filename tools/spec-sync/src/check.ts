/**
 * Spec drift check — compares pinned upstream revisions against committed manifest.
 * Does not fetch upstream; validates local manifest matches config pins.
 * For live drift detection against GitHub, run in CI schedule with network (see workflow).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PINNED_REVISIONS, SPEC_VERSION } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_DIR = join(__dirname, '../../../packages/tokens/src/spec');

interface SpecManifest {
  version: string;
  revisions: typeof PINNED_REVISIONS;
  androidx: { contentHash: string };
  materialWeb: { contentHash: string };
}

function main(): void {
  const manifestPath = join(SPEC_DIR, 'manifest.json');
  const androidxPath = join(SPEC_DIR, 'androidx-tokens.json');
  const materialWebPath = join(SPEC_DIR, 'material-web-tokens.json');

  for (const p of [manifestPath, androidxPath, materialWebPath]) {
    if (!existsSync(p)) {
      console.error(`Missing spec file: ${p}\nRun: pnpm spec:sync`);
      process.exit(1);
    }
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as SpecManifest;

  if (manifest.version !== SPEC_VERSION) {
    console.error(
      `Spec version drift: manifest.version=${manifest.version} but config SPEC_VERSION=${SPEC_VERSION}\n` +
        `Run pnpm spec:sync and commit updated JSON, or update PINNED_REVISIONS deliberately.`,
    );
    process.exit(1);
  }

  const configJson = JSON.stringify(PINNED_REVISIONS);
  const manifestJson = JSON.stringify(manifest.revisions);
  if (configJson !== manifestJson) {
    console.error(
      'Pinned revision drift: tools/spec-sync/src/config.ts revisions differ from committed manifest.json revisions.\n' +
        `Config:   ${configJson}\n` +
        `Manifest: ${manifestJson}\n` +
        'Run pnpm spec:sync and commit, or update pins deliberately.',
    );
    process.exit(1);
  }

  console.log('Spec sync check passed.');
  console.log(`  version: ${manifest.version}`);
  console.log(`  androidx hash: ${manifest.androidx.contentHash}`);
  console.log(`  material-web hash: ${manifest.materialWeb.contentHash}`);
}

main();
