#!/usr/bin/env tsx
/**
 * Post-build Material Web parity gates — spec sync, parity artifact, bundle budgets.
 * Token coverage (`pnpm --filter @m3ui/react test:coverage`) runs separately in CI
 * because it requires the Vitest harness and built packages.
 *
 * Usage:
 *   pnpm parity:gates              — all gates (parity artifact warn-only unless strict)
 *   SPEC_PARITY_STRICT=1 pnpm parity:gates
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../..');

interface Gate {
  label: string;
  command: string;
  args: string[];
  env?: NodeJS.ProcessEnv;
}

const GATES: Gate[] = [
  {
    label: 'Spec sync (pinned revisions vs committed manifest)',
    command: 'pnpm',
    args: ['spec:sync:check'],
  },
  {
    label: 'Parity report (filled-button contract + parity artifact)',
    command: 'pnpm',
    args: ['parity:check'],
    env: { SPEC_PARITY_STRICT: process.env.SPEC_PARITY_STRICT ?? '0' },
  },
  {
    label: 'Bundle size budgets (minified ESM)',
    command: 'pnpm',
    args: ['size:check'],
  },
];

function runGate(gate: Gate): boolean {
  console.log(`\n▶ ${gate.label}\n`);
  const result = spawnSync(gate.command, gate.args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...gate.env },
  });

  if (result.status === 0) return true;

  console.error(`\n✗ Gate failed: ${gate.label}`);
  return false;
}

function main(): void {
  console.log('Material Web parity gates (spec sync → parity → bundle budgets)\n');

  let failed = false;
  for (const gate of GATES) {
    if (!runGate(gate)) failed = true;
  }

  if (failed) {
    console.error('\nOne or more parity gates failed. See docs/PARITY-SYNC.md § CI integration.');
    process.exit(1);
  }

  console.log('\nAll Material Web parity gates passed.');
  console.log('Run `pnpm --filter @m3ui/react test:coverage` for token coverage.');
}

main();
