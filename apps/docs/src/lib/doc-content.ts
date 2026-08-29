import type { ComponentContentConfig } from '@/components/doc/types';
import type { ComponentDocContent } from '@/content/types';
import type { ComponentCatalogEntry } from '@/lib/catalog';

function formatImportLine(imports: string[]): string {
  if (imports.length === 0) {
    return "import { Component } from '@m3ui/react';";
  }
  if (imports.length === 1) {
    return `import { ${imports[0]} } from '@m3ui/react';`;
  }
  return `import { ${imports.join(', ')} } from '@m3ui/react';`;
}

/** Map catalog + legacy prose content into doc primitive config */
export function buildDocContentConfig(
  entry: ComponentCatalogEntry,
  content?: ComponentDocContent | null,
): ComponentContentConfig {
  const imports = content?.imports ?? entry.exports;
  const importLine = formatImportLine(imports);

  return {
    slug: entry.slug,
    title: entry.title,
    description: content?.overview ?? entry.description,
    previewCode: content?.usageCode ?? `${importLine}\n\n// See live preview`,
    usage: {
      code: content?.usageCode ?? `${importLine}\n\n// Add usage example`,
      description: 'Import the component and wrap your app with M3Provider.',
    },
    examples: content?.variants.map((variant, index) => ({
      id: `variant-${index}`,
      title: variant.title,
      description: variant.description,
      code: `// ${variant.title}\n// ${variant.description}`,
    })),
    accessibility: content?.accessibility
      ? { items: content.accessibility }
      : undefined,
    related: content?.related ?? entry.related,
  };
}

/** Map standalone legacy content modules (no catalog entry required) */
export function buildDocContentFromLegacy(content: ComponentDocContent): ComponentContentConfig {
  const importLine = formatImportLine(content.imports);

  return {
    slug: content.slug,
    title: content.title,
    description: content.overview,
    previewCode: content.usageCode,
    usage: {
      code: `${importLine}\n\n${content.usageCode}`,
    },
    examples: content.variants.map((variant, index) => ({
      id: `variant-${index}`,
      title: variant.title,
      description: variant.description,
      code: `// ${variant.title}: ${variant.description}`,
    })),
    accessibility: { items: content.accessibility },
    related: content.related,
  };
}

/** Prefer enriched content module when present, otherwise catalog defaults */
export function resolveDocContentConfig(
  entry: ComponentCatalogEntry,
  enriched?: ComponentContentConfig | null,
  legacy?: ComponentDocContent | null,
): ComponentContentConfig {
  if (enriched) {
    return {
      ...buildDocContentConfig(entry, legacy),
      ...enriched,
      slug: entry.slug,
      title: enriched.title ?? entry.title,
    };
  }
  return buildDocContentConfig(entry, legacy);
}
