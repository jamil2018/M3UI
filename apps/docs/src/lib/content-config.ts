import type { ComponentContentConfig } from '@/components/doc/types';
import type { ComponentDocContent } from '@/content/types';
import { buttonContent } from '@/content/button';

const CONTENT_OVERRIDES: Partial<Record<string, Partial<ComponentContentConfig>>> = {
  button: buttonContent,
};

function formatImportLine(imports: string[]): string {
  return imports.length === 1
    ? `import { ${imports[0]} } from '@m3ui/react';`
    : `import { ${imports.join(', ')} } from '@m3ui/react';`;
}

function withImports(imports: string[], code: string): string {
  if (code.includes("from '@m3ui/react'")) {
    return code;
  }
  return `${formatImportLine(imports)}\n\n${code}`;
}

/** Map prose content modules to the rich doc page config shape */
export function contentToConfig(content: ComponentDocContent): ComponentContentConfig {
  const override = CONTENT_OVERRIDES[content.slug];
  const importLine = formatImportLine(content.imports);

  const base: ComponentContentConfig = {
    slug: content.slug,
    title: content.title,
    description: content.overview,
    previewCode: withImports(content.imports, content.usageCode),
    usage: {
      code: withImports(content.imports, content.usageCode),
      description: `Import ${content.imports.join(', ')} from @m3ui/react and compose as shown.`,
    },
    examples: content.variants.map((variant, index) => ({
      id: `${content.slug}-variant-${index}`,
      title: variant.title,
      description: variant.description,
      code: `${importLine}\n\n// ${variant.title}: ${variant.description}`,
    })),
    accessibility: {
      items: content.accessibility,
    },
    related: content.related,
  };

  if (override) {
    return { ...base, ...override, slug: content.slug, title: content.title };
  }

  return base;
}
