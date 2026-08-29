/** Serializable example fields — no live React components */
export interface ExampleMetadata {
  id: string;
  componentSlug: string;
  title: string;
  description?: string;
  source: string;
}

export type ExampleMetadataBySlug = Record<string, ExampleMetadata[]>;
