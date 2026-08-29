import { getExampleMetadataForSlug } from './metadata-map';

/** Serializable example metadata for docs preview/code tabs */
export interface DocExampleConfig {
  id: string;
  title: string;
  description?: string;
  code: string;
}

export function toDocExampleConfig(example: {
  id: string;
  title: string;
  description?: string;
  source: string;
}): DocExampleConfig {
  return {
    id: example.id,
    title: example.title,
    description: example.description,
    code: example.source,
  };
}

/** Server-safe alias — returns copyable example metadata for a catalog slug */
export function getExamplesForComponent(slug: string): DocExampleConfig[] {
  return getExampleMetadataForSlug(slug).map(toDocExampleConfig);
}
