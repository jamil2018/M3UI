import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORYBOOK_ROOT = join(__dirname, '..');
const REPO_ROOT = join(STORYBOOK_ROOT, '../..');
const GENERATED_DIR = join(STORYBOOK_ROOT, 'src/stories/generated');
const DOCS_CATALOG_PATH = join(REPO_ROOT, 'packages/react/registry/docs-catalog.json');
const EXAMPLES_INDEX_PATH = join(REPO_ROOT, 'packages/examples/src/examples-map.ts');

const CATEGORY_LABELS = {
  actions: 'Actions',
  inputs: 'Inputs',
  selection: 'Selection',
  communication: 'Communication',
  containment: 'Containment',
  navigation: 'Navigation',
  feedback: 'Feedback',
  pickers: 'Pickers',
  layout: 'Layout',
};

/** Parity tier map — keep in sync with apps/docs/src/lib/parity-tiers.ts */
const TIER_A = new Set([
  'button', 'icon-button', 'fab', 'split-button', 'card', 'checkbox', 'radio', 'switch',
  'chip', 'divider', 'list', 'menu', 'badge', 'top-app-bar',
]);
const TIER_B = new Set(['dialog', 'slider', 'text-field', 'select', 'tabs', 'progress']);

function getParityTier(slug) {
  if (TIER_A.has(slug)) return { tier: 'A', reference: 'labs/gb' };
  if (TIER_B.has(slug)) return { tier: 'B', reference: 'stable' };
  return { tier: 'C', reference: 'tokens-only' };
}

function parityTags(entry) {
  const { tier, reference } = getParityTier(entry.slug);
  return [`parity-tier-${tier}`, `parity-ref-${reference.replace('/', '-')}`];
}

function loadDocsCatalog() {
  const raw = readFileSync(DOCS_CATALOG_PATH, 'utf8');
  const manifest = JSON.parse(raw);
  return manifest.entries.filter(
    (entry) => entry.registryType === 'registry:ui' && entry.docs?.publicIndex === true,
  );
}

function loadSharedExampleSlugs() {
  const source = readFileSync(EXAMPLES_INDEX_PATH, 'utf8');
  const block = source.match(/EXAMPLES_BY_SLUG[^=]*=\s*\{([\s\S]*?)\};/);
  if (!block) {
    return new Set();
  }

  const slugs = [];
  for (const match of block[1].matchAll(/^\s+['"]?([\w-]+)['"]?\s*:/gm)) {
    slugs.push(match[1]);
  }
  return new Set(slugs);
}

function slugToExampleName(slug) {
  const pascal = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${pascal}Example`;
}

function toStoryExportName(title, index) {
  const sanitized = title.replace(/[^a-zA-Z0-9]/g, '');
  if (!sanitized) {
    return `Example${index}`;
  }
  if (/^\d/.test(sanitized)) {
    return `Example${sanitized}`;
  }
  return sanitized;
}

function renderComplianceStory(entry, renderExpression) {
  const conformance = entry.conformance;
  const parity = getParityTier(entry.slug);
  return `
export const Compliance: Story = {
  name: 'Compliance contract',
  tags: ${JSON.stringify(['compliance', ...parityTags(entry)])},
  render: () => (
    <section className="m3-story-compliance">
      <p className="m3-story-kicker">Contract ${conformance.version} · Parity Tier ${parity.tier}</p>
      <h2>${entry.title}</h2>
      <p>${entry.description}</p>
      <dl>
        <div><dt>Status</dt><dd>${conformance.status}</dd></div>
        <div><dt>Parity tier</dt><dd>${parity.tier} (${parity.reference})</dd></div>
        <div><dt>Sources</dt><dd>${conformance.sources.join(' · ')}</dd></div>
        <div><dt>States</dt><dd>${conformance.states.join(' · ')}</dd></div>
        <div><dt>Modes</dt><dd>RTL · reduced motion · forced colors</dd></div>
      </dl>
      <div className="m3-story-compliance-preview">{${renderExpression}}</div>
    </section>
  ),
};

export const HighContrast: Story = {
  globals: { contrast: 1 },
  render: () => ${renderExpression},
};

export const RightToLeft: Story = {
  globals: { direction: 'rtl' },
  render: () => ${renderExpression},
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: true },
  render: () => ${renderExpression},
};

export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
  render: () => ${renderExpression},
};`;
}

function renderSharedExampleStoryFile(entry, sharedExamples) {
  const category = CATEGORY_LABELS[entry.category] ?? entry.category;
  const storyExports = sharedExamples
    .map((example, index) => {
      const exportName = toStoryExportName(example.title, index);
      return `
export const ${exportName}: Story = {
  name: ${JSON.stringify(example.title)},
  render: () => {
    const Example = examples[${index}]!.Component;
    return <Example />;
  },
};`;
    })
    .join('\n');

  const defaultPlay =
    sharedExamples.length > 0
      ? `
export const SmokeTest: Story = {
  render: () => {
    const Example = examples[0]!.Component;
    return <Example />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.firstChild).toBeTruthy();
  },
};`
      : '';
  const conformanceStories = renderComplianceStory(
    entry,
    `(() => { const Example = examples[0]!.Component; return <Example />; })()`,
  );

  return `/* eslint-disable -- generated by scripts/generate-stories.mjs */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { getExamplesForSlug } from '@m3ui/examples';

const examples = getExamplesForSlug(${JSON.stringify(entry.slug)});

const meta = {
  title: '${category}/${entry.title}',
  tags: ${JSON.stringify(['autodocs', ...parityTags(entry)])},
  parameters: {
    docs: {
      description: {
        component: ${JSON.stringify(entry.description)},
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;
${storyExports}
${defaultPlay}
${conformanceStories}
`;
}

function renderLegacyStoryFile(entry) {
  const category = CATEGORY_LABELS[entry.category] ?? entry.category;
  const example = slugToExampleName(entry.slug);
  const conformanceStories = renderComplianceStory(entry, `<${example} />`);

  return `/* eslint-disable -- generated by scripts/generate-stories.mjs */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { ${example} } from '../../examples/components.js';

const meta = {
  title: '${category}/${entry.title}',
  component: ${example},
  tags: ${JSON.stringify(['autodocs', ...parityTags(entry)])},
  parameters: {
    docs: {
      description: {
        component: ${JSON.stringify(entry.description)},
      },
    },
  },
} satisfies Meta<typeof ${example}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interaction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2 })).toBeVisible();
  },
};
${conformanceStories}
`;
}

function renderOverviewStory() {
  return `/* eslint-disable -- generated by scripts/generate-stories.mjs */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { OverviewExample } from '../../examples/components.js';

const meta = {
  title: 'Gallery/Overview',
  component: OverviewExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Full component gallery for visual regression and smoke testing.',
      },
    },
  },
} satisfies Meta<typeof OverviewExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'M3UI Component Gallery' })).toBeVisible();
    await expect(canvas.getByTestId('demo-buttons')).toBeVisible();
    await expect(canvas.getByTestId('demo-phase3-nav')).toBeVisible();
    await expect(canvas.getByTestId('demo-nav-bar-compact')).toBeVisible();
    await expect(canvas.getByTestId('demo-carousel-compact')).toBeVisible();
    await expect(canvas.getByTestId('demo-phase4')).toBeVisible();
    await expect(canvas.getByTestId('demo-phase5')).toBeVisible();
  },
};
`;
}

function loadSharedExampleMetadata(slug) {
  const modulePath = join(REPO_ROOT, 'packages/examples/src', `${slug}.examples.tsx`);
  try {
    const source = readFileSync(modulePath, 'utf8');
    const examples = [];
    const titleRe = /title:\s*'([^']+)'/g;
    let match;
    while ((match = titleRe.exec(source)) !== null) {
      examples.push({ title: match[1] });
    }
    return examples;
  } catch {
    return [{ title: 'Default' }];
  }
}

const catalog = loadDocsCatalog();
const sharedExampleSlugs = loadSharedExampleSlugs();

mkdirSync(GENERATED_DIR, { recursive: true });
writeFileSync(join(GENERATED_DIR, 'overview.stories.tsx'), renderOverviewStory());

for (const entry of catalog) {
  const filename = `${entry.slug}.stories.tsx`;
  if (sharedExampleSlugs.has(entry.slug)) {
    const sharedExamples = loadSharedExampleMetadata(entry.slug);
    writeFileSync(
      join(GENERATED_DIR, filename),
      renderSharedExampleStoryFile(entry, sharedExamples),
    );
  } else {
    writeFileSync(join(GENERATED_DIR, filename), renderLegacyStoryFile(entry));
  }
}

console.log(
  `Generated ${catalog.length + 1} Storybook story files from docs-catalog.json (${sharedExampleSlugs.size} shared example slugs)`,
);
