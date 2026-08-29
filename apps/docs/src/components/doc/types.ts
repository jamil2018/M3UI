import type { ReactNode } from 'react';

/** Serializable example definition (shared with future `@m3ui/examples`) */
export interface DocExampleConfig {
  id: string;
  title: string;
  description?: string;
  code: string;
}

/** Runtime example with live preview slot */
export interface DocExample extends DocExampleConfig {
  preview: ReactNode;
}

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description?: string;
}

export interface AccessibilityConfig {
  /** Short overview shown above the list */
  summary?: string;
  items: string[];
  /** WCAG techniques, keyboard patterns, ARIA roles, etc. */
  metadata?: Record<string, string>;
}

export interface UsageConfig {
  code: string;
  description?: string;
}

/** Serializable content config — safe for content modules and future MDX */
export interface ComponentContentConfig {
  slug: string;
  title: string;
  description: string;
  previewCode: string;
  usage: UsageConfig;
  examples?: DocExampleConfig[];
  props?: PropDefinition[];
  accessibility?: AccessibilityConfig;
  related?: string[];
}

/** Props for assembling a full component documentation page */
export interface ComponentDocPageProps {
  config: ComponentContentConfig;
  preview: ReactNode;
  /** When omitted, gallery falls back to `config.examples` code-only cards */
  examples?: Array<DocExample | DocExampleConfig>;
}

export interface RegistryInstallInfo {
  slug: string;
  title: string;
  description: string;
  npmDependencies: string[];
  registryDependencies: string[];
  registryCommand: string;
  npmInstallCommand: string;
}

export interface ComponentNavLink {
  slug: string;
  title: string;
  href: string;
}

export interface ComponentNavResult {
  prev: ComponentNavLink | null;
  next: ComponentNavLink | null;
}
