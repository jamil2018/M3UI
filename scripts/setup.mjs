#!/usr/bin/env node
/**
 * Fresh-clone onboarding for the M3UI monorepo.
 *
 * Usage:
 *   node scripts/setup.mjs [--skip-spec-sync] [--skip-vrt] [--help]
 *   pnpm setup
 */

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNPM_VERSION = '9.15.0';
const MIN_NODE_MAJOR = 20;

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const argv = process.argv.slice(2);
const flags = {
  skipSpecSync: argv.includes('--skip-spec-sync'),
  skipVrt: argv.includes('--skip-vrt'),
  help: argv.includes('--help') || argv.includes('-h'),
};

if (flags.help) {
  console.log(`M3UI monorepo setup

Usage:
  pnpm run setup [--skip-spec-sync] [--skip-vrt]

Options:
  --skip-spec-sync  Skip fetching upstream token specs (uses committed JSON)
  --skip-vrt        Skip Playwright Chromium install for visual regression tests
  --help, -h        Show this help message

Prerequisites:
  Node.js >= ${MIN_NODE_MAJOR}
  pnpm ${PNPM_VERSION} (enabled automatically via corepack when available)
`);
  process.exit(0);
}

function log(step, message) {
  console.log(`\n[${step}] ${message}`);
}

function fail(message, hint) {
  console.error(`\n✗ ${message}`);
  if (hint) {
    console.error(`  ${hint}`);
  }
  process.exit(1);
}

function run(command, args, { label, optional = false } = {}) {
  const description = label ?? [command, ...args].join(' ');
  console.log(`  → ${description}`);

  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  });

  if (result.error) {
    if (optional) {
      console.warn(`  ⚠ Skipped (${result.error.message})`);
      return false;
    }
    fail(`Command failed: ${description}`, result.error.message);
  }

  if (result.status !== 0) {
    if (optional) {
      console.warn(`  ⚠ Exited with code ${result.status} — continuing`);
      return false;
    }
    fail(`Command failed: ${description}`);
  }

  return true;
}

function commandSucceeds(command, args = []) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return result.status === 0;
}

function readPnpmVersion() {
  const result = spawnSync('pnpm', ['--version'], {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function ensureNode() {
  log('1/8', 'Checking Node.js version');
  const major = Number.parseInt(process.versions.node.split('.')[0], 10);
  if (!Number.isFinite(major) || major < MIN_NODE_MAJOR) {
    fail(
      `Node.js >= ${MIN_NODE_MAJOR} is required (found ${process.versions.node})`,
      'Install Node 20+ from https://nodejs.org/ or use nvm/fnm/volta.',
    );
  }
  console.log(`  ✓ Node.js ${process.versions.node}`);
}

function ensurePnpm() {
  log('2/8', `Ensuring pnpm ${PNPM_VERSION}`);

  let version = readPnpmVersion();
  if (version) {
    console.log(`  ✓ pnpm ${version} already available`);
    return { command: 'pnpm', prefixArgs: [] };
  }

  console.log('  pnpm not found — trying corepack…');
  if (commandSucceeds('corepack', ['--version'])) {
    const enabled = run('corepack', ['enable'], { optional: true, label: 'corepack enable' });
    if (enabled) {
      run('corepack', ['prepare', `pnpm@${PNPM_VERSION}`, '--activate'], {
        optional: true,
        label: `corepack prepare pnpm@${PNPM_VERSION}`,
      });
      version = readPnpmVersion();
      if (version) {
        console.log(`  ✓ pnpm ${version} activated via corepack`);
        return { command: 'pnpm', prefixArgs: [] };
      }
    } else {
      console.log('  corepack enable failed (often needs admin on Windows) — trying npx fallback…');
    }
  }

  console.log(`  Using npx pnpm@${PNPM_VERSION}`);
  if (!commandSucceeds('npx', [`pnpm@${PNPM_VERSION}`, '--version'])) {
    fail(
      'Could not run pnpm',
      `Install pnpm ${PNPM_VERSION} globally, run corepack enable as admin, or ensure npx can reach the registry.`,
    );
  }

  console.log(`  ✓ npx pnpm@${PNPM_VERSION} is available`);
  return { command: 'npx', prefixArgs: [`pnpm@${PNPM_VERSION}`] };
}

function pnpm(pnpmRunner, args, options) {
  return run(pnpmRunner.command, [...pnpmRunner.prefixArgs, ...args], options);
}

function main() {
  console.log('M3UI setup — preparing docs, Storybook, and workspace packages\n');

  ensureNode();
  const pnpmRunner = ensurePnpm();

  log('3/8', 'Installing workspace dependencies');
  pnpm(pnpmRunner, ['install']);

  if (flags.skipSpecSync) {
    log('4/8', 'Skipping spec:sync (--skip-spec-sync — using committed spec JSON)');
  } else {
    log('4/8', 'Syncing pinned token specs from upstream (requires network)');
    pnpm(pnpmRunner, ['spec:sync']);
  }

  log('5/8', 'Generating design tokens from spec');
  pnpm(pnpmRunner, ['tokens:codegen']);

  log('6/8', 'Building workspace packages (excluding docs/storybook apps)');
  // Exclude apps to avoid turbo running @m3ui/react#catalog:build in parallel with
  // @m3ui/react#build (both write to packages/react/registry).
  pnpm(pnpmRunner, ['turbo', 'run', 'build', '--filter=!./apps/*']);

  log('7/8', 'Building component registry and examples metadata for docs');
  pnpm(pnpmRunner, ['registry:build']);

  if (flags.skipVrt) {
    log('8/8', 'Skipping Playwright browser install (--skip-vrt)');
  } else {
    log('8/8', 'Installing Playwright Chromium for visual regression tests');
    pnpm(pnpmRunner, ['exec', 'playwright', 'install', 'chromium'], { optional: true });
  }

  console.log(`
✓ Setup complete!

Next steps:
  pnpm dev                 Start docs (http://localhost:3000) + Storybook (http://localhost:6006)
  pnpm --filter @m3ui/docs dev
  pnpm --filter @m3ui/storybook dev

Other useful commands:
  pnpm test                Unit tests
  pnpm lint                ESLint
  pnpm typecheck           TypeScript
`);
}

main();
