/**
 * Spec drift check — compares pinned upstream revisions against committed manifest.
 * Does not fetch upstream; validates local manifest matches config pins.
 * For live drift detection against GitHub, run in CI schedule with network (see workflow).
 *
 * Usage:
 *   pnpm spec:sync:check           — manifest + revision pins
 *   pnpm spec:parity:check         — parity artifact + filled-button contract counts
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PINNED_REVISIONS, SPEC_VERSION } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_DIR = join(__dirname, '../../../packages/tokens/src/spec');
const REPO_ROOT = join(__dirname, '../../..');

const PARITY_ARTIFACT_PATH = join(REPO_ROOT, 'docs/parity-report.json');

const FILLED_BUTTON_SUPPORTED_MIN = 35;
const FILLED_BUTTON_SUPPORTED_MAX = 42;
const FILLED_BUTTON_UNSUPPORTED_EXPECTED = 4;

interface SpecManifest {
  version: string;
  revisions: typeof PINNED_REVISIONS;
  androidx: { contentHash: string };
  materialWeb: { contentHash: string };
}

interface MaterialWebTokenFile {
  tokenLists?: {
    supported?: string[];
    unsupported?: string[];
  };
}

interface ParityReportArtifact {
  generatedAt: string;
  summary?: {
    components: number;
    totalMissing: number;
    totalExtra: number;
    totalDrifted: number;
  };
  components: Record<
    string,
    {
      tier?: string;
      missing?: string[];
      extra?: string[];
      drifted?: unknown[];
    }
  >;
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

function normalizeRevisions(revisions: typeof PINNED_REVISIONS): string {
  return JSON.stringify({
    androidx: {
      repo: revisions.androidx.repo,
      ref: revisions.androidx.ref,
      tokensPath: revisions.androidx.tokensPath,
    },
    materialWeb: {
      repo: revisions.materialWeb.repo,
      ref: revisions.materialWeb.ref,
      paths: [...revisions.materialWeb.paths],
    },
  });
}

function checkManifest(): SpecManifest {
  const manifestPath = join(SPEC_DIR, 'manifest.json');
  const androidxPath = join(SPEC_DIR, 'androidx-tokens.json');
  const materialWebPath = join(SPEC_DIR, 'material-web-tokens.json');

  for (const p of [manifestPath, androidxPath, materialWebPath]) {
    if (!existsSync(p)) {
      console.error(`Missing spec file: ${p}\nRun: pnpm spec:sync`);
      process.exit(1);
    }
  }

  const manifest = readJson<SpecManifest>(manifestPath);

  if (manifest.version !== SPEC_VERSION) {
    console.error(
      `Spec version drift: manifest.version=${manifest.version} but config SPEC_VERSION=${SPEC_VERSION}\n` +
        `Run pnpm spec:sync and commit updated JSON, or update PINNED_REVISIONS deliberately.`,
    );
    process.exit(1);
  }

  const configJson = normalizeRevisions(PINNED_REVISIONS);
  const manifestJson = normalizeRevisions(manifest.revisions);
  if (configJson !== manifestJson) {
    console.error(
      'Pinned revision drift: tools/spec-sync/src/config.ts revisions differ from committed manifest.json revisions.\n' +
        'Expected materialWeb.paths (array) and androidx.tokensPath — not a single materialWeb.tokensPath.\n' +
        `Config:   ${configJson}\n` +
        `Manifest: ${manifestJson}\n` +
        'Run pnpm spec:sync and commit, or update pins deliberately.',
    );
    process.exit(1);
  }

  return manifest;
}

function checkFilledButtonContract(): void {
  const materialWebPath = join(SPEC_DIR, 'material-web-tokens.json');
  const materialWeb = readJson<Record<string, MaterialWebTokenFile>>(materialWebPath);
  const filled = materialWeb['md-comp-filled-button'];

  if (!filled?.tokenLists?.supported?.length) {
    console.warn(
      'Material Web contract not yet in spec JSON (no tokenLists on md-comp-filled-button).\n' +
        '  Skipping filled-button count validation until spec-sync Phase 0 lands.',
    );
    return;
  }

  const supported = filled.tokenLists.supported.length;
  const unsupported = filled.tokenLists.unsupported?.length ?? 0;

  console.log(`  md-comp-filled-button: ${String(supported)} supported, ${String(unsupported)} unsupported`);

  if (supported < FILLED_BUTTON_SUPPORTED_MIN || supported > FILLED_BUTTON_SUPPORTED_MAX) {
    console.error(
      `Filled-button supported token count out of range: ${String(supported)} ` +
        `(expected ${String(FILLED_BUTTON_SUPPORTED_MIN)}–${String(FILLED_BUTTON_SUPPORTED_MAX)}).\n` +
        'Spec-sync parser may still be dropping multi-line $supported-tokens lists.',
    );
    process.exit(1);
  }

  if (unsupported !== FILLED_BUTTON_UNSUPPORTED_EXPECTED) {
    console.error(
      `Filled-button unsupported token count mismatch: ${String(unsupported)} ` +
        `(expected ${String(FILLED_BUTTON_UNSUPPORTED_EXPECTED)}).`,
    );
    process.exit(1);
  }
}

function checkParityArtifact(strict: boolean): void {
  if (!existsSync(PARITY_ARTIFACT_PATH)) {
    const msg =
      `Parity report JSON not found at ${PARITY_ARTIFACT_PATH}.\n` +
      '  Run: pnpm spec:parity';
    if (strict) {
      console.error(msg);
      process.exit(1);
    }
    console.warn(msg);
    return;
  }

  const report = readJson<ParityReportArtifact>(PARITY_ARTIFACT_PATH);
  if (!report.generatedAt || !report.components) {
    console.error(`Invalid parity report structure: ${PARITY_ARTIFACT_PATH}`);
    process.exit(1);
  }

  const componentCount = Object.keys(report.components).length;
  console.log(`  parity artifact: ${PARITY_ARTIFACT_PATH} (${String(componentCount)} components)`);
}

function main(): void {
  const mode = process.argv.includes('--parity') ? 'parity' : 'manifest';
  const strictParity = process.env.SPEC_PARITY_STRICT === '1' || process.argv.includes('--strict');

  if (mode === 'parity') {
    console.log('Parity spec check...');
    checkFilledButtonContract();
    checkParityArtifact(strictParity);
    console.log('Parity spec check passed.');
    return;
  }

  const manifest = checkManifest();
  console.log('Spec sync check passed.');
  console.log(`  version: ${manifest.version}`);
  console.log(`  androidx hash: ${manifest.androidx.contentHash}`);
  console.log(`  material-web hash: ${manifest.materialWeb.contentHash}`);
}

main();
