import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REACT_PKG = join(__dirname, '..');
const REGISTRY_DIR = join(REACT_PKG, 'registry');
const COMPONENTS_DIR = join(REACT_PKG, 'src/components');

/** Workspace import → published npm specifier */
const IMPORT_REWRITES: Record<string, string> = {
  '@m3ui/react': '@m3ui/react',
  '@m3ui/tokens': '@m3ui/tokens',
  '@m3ui/color': '@m3ui/color',
  '@m3ui/motion': '@m3ui/motion',
  '@m3ui/shapes': '@m3ui/shapes',
  '@m3ui/icons': '@m3ui/icons',
};

const INTERNAL_IMPORT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/from '\.\.\/primitives\/state-layer\.js'/g, "from '@m3ui/react/primitives'"],
  [/from '\.\.\/primitives\/ripple\.js'/g, "from '@m3ui/react/primitives'"],
  [/from '\.\.\/primitives\/surface\.js'/g, "from '@m3ui/react/primitives'"],
  [/from '\.\.\/lib\/token-utils\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/pressable-shell\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/popup-motion\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/wavy-path\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/i18n\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/calendar-engine\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/window-size-class\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/provider\/m3-provider\.js'/g, "from '@m3ui/react/provider'"],
  [/from '\.\/fab\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/icon-button\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/button\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/badge\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/snackbar\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/inset-context\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/overlay-motion\.js'/g, "from '@m3ui/react'"],
  [/from '\.\.\/lib\/shape-crop\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/divider\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/menu\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/date-input\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/navigation-bar\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/navigation-rail\.js'/g, "from '@m3ui/react'"],
  [/from '\.\/navigation-drawer\.js'/g, "from '@m3ui/react'"],
];

function rewriteImports(source: string): string {
  let result = source;
  for (const [from, to] of Object.entries(IMPORT_REWRITES)) {
    result = result.replaceAll(`from '${from}`, `from '${to}`);
    result = result.replaceAll(`from "${from}`, `from "${to}`);
  }
  for (const [pattern, replacement] of INTERNAL_IMPORT_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  if (result.includes('workspace:') || result.includes('../lib/') || result.includes('../primitives/')) {
    throw new Error('Registry source contains workspace-relative imports that must be rewritten');
  }
  return result;
}

interface RegistryItem {
  name: string;
  type: 'registry:ui';
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: Array<{ path: string; content: string; type: 'registry:ui' }>;
}

interface RegistryManifest {
  $schema: string;
  name: string;
  homepage: string;
  items: Array<{ name: string; type: string; title: string; description: string }>;
}

const COMPONENT_REGISTRY = [
  { name: 'button', file: 'button.tsx', title: 'Button', description: 'M3 Expressive button with press shape morph', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'] },
  { name: 'icon-button', file: 'icon-button.tsx', title: 'Icon Button', description: 'M3 Expressive icon button with toggle support', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'] },
  { name: 'fab', file: 'fab.tsx', title: 'FAB', description: 'Floating action button and extended FAB', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'checkbox', file: 'checkbox.tsx', title: 'Checkbox', description: 'Checkbox and checkbox group', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'radio', file: 'radio.tsx', title: 'Radio', description: 'Radio button and radio group', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'switch', file: 'switch.tsx', title: 'Switch', description: 'M3 Expressive switch with icon slots', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'text-field', file: 'text-field.tsx', title: 'Text Field', description: 'Filled and outlined text fields with floating labels', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'card', file: 'card.tsx', title: 'Card', description: 'Elevated, filled, and outlined cards', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'list', file: 'list.tsx', title: 'List', description: 'M3 list and list items', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'divider', file: 'divider.tsx', title: 'Divider', description: 'Full-width, inset, and vertical dividers', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'badge', file: 'badge.tsx', title: 'Badge', description: 'Dot and numbered badges', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'tooltip', file: 'tooltip.tsx', title: 'Tooltip', description: 'Plain and rich tooltips', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'chip', file: 'chip.tsx', title: 'Chip', description: 'Assist, filter, input, and suggestion chips', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'segmented-button', file: 'segmented-button.tsx', title: 'Segmented Button', description: 'Single and multi-select segmented buttons', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'slider', file: 'slider.tsx', title: 'Slider', description: 'Continuous, discrete, centered, range, and vertical sliders', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'menu', file: 'menu.tsx', title: 'Menu', description: 'Dropdown menu, context menu, and menubar', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'select', file: 'select.tsx', title: 'Select', description: 'M3 exposed dropdown menu styled as text field', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'autocomplete', file: 'autocomplete.tsx', title: 'Autocomplete', description: 'Autocomplete and combobox with M3 text field styling', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'progress', file: 'progress.tsx', title: 'Progress', description: 'Linear and circular progress with wavy Expressive variants', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'loading-indicator', file: 'loading-indicator.tsx', title: 'Loading Indicator', description: 'Expressive shape-cycling loader', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'] },
  { name: 'snackbar', file: 'snackbar.tsx', title: 'Snackbar', description: 'Toast snackbars with queueing and positioning', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'meter', file: 'meter.tsx', title: 'Meter', description: 'Meter styled consistently with progress indicators', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'top-app-bar', file: 'top-app-bar.tsx', title: 'Top App Bar', description: 'Small, medium, large, and flexible Expressive top app bars', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'bottom-app-bar', file: 'bottom-app-bar.tsx', title: 'Bottom App Bar', description: 'Bottom app bar with action slots and attached FAB', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'navigation-bar', file: 'navigation-bar.tsx', title: 'Navigation Bar', description: 'Bottom navigation bar with active indicator pill and badges', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'navigation-rail', file: 'navigation-rail.tsx', title: 'Navigation Rail', description: 'Collapsed, expanded, and modal navigation rail', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'navigation-drawer', file: 'navigation-drawer.tsx', title: 'Navigation Drawer', description: 'Standard and modal navigation drawer with sections', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'tabs', file: 'tabs.tsx', title: 'Tabs', description: 'Primary and secondary tabs with scrollable layout', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'search', file: 'search.tsx', title: 'Search', description: 'Search bar and full-screen search view', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'dialog', file: 'dialog.tsx', title: 'Dialog', description: 'Dialog, alert dialog, and full-screen dialog', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'bottom-sheet', file: 'bottom-sheet.tsx', title: 'Bottom Sheet', description: 'Modal bottom sheet with snap points and drag handle', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'side-sheet', file: 'side-sheet.tsx', title: 'Side Sheet', description: 'Side sheet with header and action row', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'carousel', file: 'carousel.tsx', title: 'Carousel', description: 'M3 carousel layouts with scroll-linked resize', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'scaffold', file: 'scaffold.tsx', title: 'Scaffold', description: 'App layout composing chrome with inset CSS variables', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
  { name: 'button-group', file: 'button-group.tsx', title: 'Button Group', description: 'Standard and connected button groups with neighbor bump', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'] },
  { name: 'split-button', file: 'split-button.tsx', title: 'Split Button', description: 'Leading action with trailing menu trigger', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'] },
  { name: 'fab-menu', file: 'fab-menu.tsx', title: 'FAB Menu', description: 'FAB expanding to labeled action list', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'] },
  { name: 'toolbar', file: 'toolbar.tsx', title: 'Toolbar', description: 'Docked and floating toolbars with scroll hide/show', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'date-input', file: 'date-input.tsx', title: 'Date Input', description: 'Locale-aware date input with Field validation', dependencies: ['@m3ui/react', '@m3ui/tokens', '@internationalized/date'] },
  { name: 'date-picker', file: 'date-picker.tsx', title: 'Date Picker', description: 'Docked, modal, and range date pickers with calendar engine', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@internationalized/date'] },
  { name: 'time-picker', file: 'time-picker.tsx', title: 'Time Picker', description: 'Dial and input time pickers with 12h/24h support', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'pane-scaffold', file: 'pane-scaffold.tsx', title: 'Pane Scaffold', description: 'List-detail and supporting-pane adaptive layouts', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'adaptive-navigation', file: 'adaptive-navigation.tsx', title: 'Adaptive Navigation', description: 'Auto-switching navigation bar, rail, and drawer', dependencies: ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion'] },
  { name: 'placeholder-button', file: 'placeholder-button.tsx', title: 'Placeholder Button', description: 'Registry placeholder for install testing', dependencies: ['@m3ui/react', '@m3ui/tokens'] },
] as const;

function buildRegistry(): void {
  mkdirSync(REGISTRY_DIR, { recursive: true });
  mkdirSync(join(REGISTRY_DIR, 'r'), { recursive: true });

  const items: RegistryItem[] = [];

  for (const comp of COMPONENT_REGISTRY) {
    const sourcePath = join(COMPONENTS_DIR, comp.file);
    const rawSource = readFileSync(sourcePath, 'utf-8');
    const flatSource = rewriteImports(rawSource);

    const item: RegistryItem = {
      name: comp.name,
      type: 'registry:ui',
      title: comp.title,
      description: comp.description,
      dependencies: [...comp.dependencies],
      registryDependencies: [],
      files: [
        {
          path: `components/m3ui/${comp.name}.tsx`,
          content: flatSource,
          type: 'registry:ui',
        },
      ],
    };

    items.push(item);
    writeFileSync(join(REGISTRY_DIR, 'r', `${comp.name}.json`), JSON.stringify(item, null, 2) + '\n');
  }

  const manifest: RegistryManifest = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'm3ui',
    homepage: 'https://m3ui.dev',
    items: items.map((i) => ({
      name: i.name,
      type: i.type,
      title: i.title,
      description: i.description,
    })),
  };

  writeFileSync(join(REGISTRY_DIR, 'registry.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Registry built: ${items.length} items → ${REGISTRY_DIR}`);
}

buildRegistry();
