import type { ComponentType } from 'react';

export interface ComponentExampleDefinition {
  id: string;
  componentSlug: string;
  title: string;
  description?: string;
  /** Copyable TSX source shown in docs preview/code tabs */
  source: string;
  /** Client component that renders the live example */
  Component: ComponentType;
}

export type ExamplesBySlug = Record<string, ComponentExampleDefinition[]>;
