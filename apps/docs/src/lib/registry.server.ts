import fs from 'node:fs';
import path from 'node:path';
import type { RegistryInstallInfo } from '@/components/doc/types';
import {
  buildRegistryInstallInfo,
  getComponentNavFromOrder,
  getComponentTitle,
} from '@/lib/component-nav';
interface RegistryItemJson {
  name: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
}

interface RegistryManifest {
  items: Array<{ name: string; title: string; description: string }>;
}

const REACT_PKG = path.join(process.cwd(), '../../packages/react');
const REGISTRY_R_DIR = path.join(REACT_PKG, 'registry/r');
const REGISTRY_MANIFEST = path.join(REACT_PKG, 'registry/registry.json');

function readJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Load shadcn registry item metadata for install tabs (server only) */
export function getRegistryItem(slug: string): RegistryItemJson | null {
  return readJsonFile<RegistryItemJson>(path.join(REGISTRY_R_DIR, `${slug}.json`));
}

/** Resolve npm + registry install commands from `registry/r/<slug>.json` (server only) */
export function getRegistryInstallInfo(slug: string): RegistryInstallInfo {
  const item = getRegistryItem(slug);
  const manifest = readJsonFile<RegistryManifest>(REGISTRY_MANIFEST);
  const manifestEntry = manifest?.items.find((entry) => entry.name === slug);

  if (!item) {
    return buildRegistryInstallInfo(slug);
  }

  const npmDependencies = item.dependencies ?? ['@m3ui/react', '@m3ui/tokens'];
  const registryDependencies = item.registryDependencies ?? [];
  const npmInstallCommand = `pnpm add ${npmDependencies.join(' ')}`;
  const registryCommand = `npx shadcn@latest add https://m3ui.dev/r/${slug}.json`;

  let registryDepsCommand = '';
  if (registryDependencies.length > 0) {
    const depCommands = registryDependencies.map(
      (dep) => `npx shadcn@latest add https://m3ui.dev/r/${dep}.json`,
    );
    registryDepsCommand = `# Install registry dependencies first\n${depCommands.join('\n')}\n\n`;
  }

  return {
    slug,
    title: item.title ?? manifestEntry?.title ?? getComponentTitle(slug),
    description: item.description ?? manifestEntry?.description ?? '',
    npmDependencies,
    registryDependencies,
    registryCommand: `${registryDepsCommand}${registryCommand}`,
    npmInstallCommand,
  };
}

/** Public component order from generated registry manifest (server only) */
export function getComponentOrder(): readonly string[] {
  try {
    const raw = fs.readFileSync(REGISTRY_MANIFEST, 'utf8');
    const manifest = JSON.parse(raw) as RegistryManifest;
    return manifest.items
      .map((item) => item.name)
      .filter((name) => name !== 'placeholder-button');
  } catch {
    return [];
  }
}

export function getComponentNav(slug: string) {
  const order = getComponentOrder();
  return getComponentNavFromOrder(slug, order.length > 0 ? order : undefined);
}
