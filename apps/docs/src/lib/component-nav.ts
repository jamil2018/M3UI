import type { ComponentNavLink, ComponentNavResult, RegistryInstallInfo } from '@/components/doc/types';

/** Public docs route order — mirrors `packages/react/registry/registry.json` */
export const PUBLIC_COMPONENT_ORDER = [
  'button',
  'icon-button',
  'fab',
  'checkbox',
  'radio',
  'switch',
  'text-field',
  'card',
  'list',
  'divider',
  'badge',
  'tooltip',
  'chip',
  'segmented-button',
  'slider',
  'menu',
  'select',
  'autocomplete',
  'progress',
  'loading-indicator',
  'snackbar',
  'meter',
  'top-app-bar',
  'bottom-app-bar',
  'navigation-bar',
  'navigation-rail',
  'navigation-drawer',
  'tabs',
  'search',
  'dialog',
  'bottom-sheet',
  'side-sheet',
  'carousel',
  'scaffold',
  'button-group',
  'split-button',
  'fab-menu',
  'toolbar',
  'date-input',
  'date-picker',
  'time-picker',
  'pane-scaffold',
  'adaptive-navigation',
  'shapes',
] as const;

const TITLE_BY_SLUG: Record<string, string> = {
  button: 'Button',
  'icon-button': 'Icon Button',
  fab: 'FAB',
  checkbox: 'Checkbox',
  radio: 'Radio',
  switch: 'Switch',
  'text-field': 'Text Field',
  card: 'Card',
  list: 'List',
  divider: 'Divider',
  badge: 'Badge',
  tooltip: 'Tooltip',
  chip: 'Chip',
  'segmented-button': 'Segmented Button',
  slider: 'Slider',
  menu: 'Menu',
  select: 'Select',
  autocomplete: 'Autocomplete',
  progress: 'Progress',
  'loading-indicator': 'Loading Indicator',
  snackbar: 'Snackbar',
  meter: 'Meter',
  'top-app-bar': 'Top App Bar',
  'bottom-app-bar': 'Bottom App Bar',
  'navigation-bar': 'Navigation Bar',
  'navigation-rail': 'Navigation Rail',
  'navigation-drawer': 'Navigation Drawer',
  tabs: 'Tabs',
  search: 'Search',
  dialog: 'Dialog',
  'bottom-sheet': 'Bottom Sheet',
  'side-sheet': 'Side Sheet',
  carousel: 'Carousel',
  scaffold: 'Scaffold',
  'button-group': 'Button Group',
  'split-button': 'Split Button',
  'fab-menu': 'FAB Menu',
  toolbar: 'Toolbar',
  'date-input': 'Date Input',
  'date-picker': 'Date Picker',
  'time-picker': 'Time Picker',
  'pane-scaffold': 'Pane Scaffold',
  'adaptive-navigation': 'Adaptive Navigation',
  shapes: 'Shapes',
};

export function getComponentTitle(slug: string): string {
  return TITLE_BY_SLUG[slug] ?? slug;
}

export function toComponentNavLink(slug: string): ComponentNavLink {
  return {
    slug,
    title: getComponentTitle(slug),
    href: `/components/${slug}`,
  };
}

export function getComponentNavFromOrder(
  slug: string,
  order: readonly string[] = PUBLIC_COMPONENT_ORDER,
): ComponentNavResult {
  const index = order.indexOf(slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? toComponentNavLink(order[index - 1]!) : null,
    next: index < order.length - 1 ? toComponentNavLink(order[index + 1]!) : null,
  };
}

export function getRelatedComponentLinks(slugs: string[]): ComponentNavLink[] {
  return slugs.map(toComponentNavLink);
}

/** Fallback install info when registry JSON is unavailable (client bundles) */
export function buildRegistryInstallInfo(slug: string): RegistryInstallInfo {
  const npmDependencies = ['@m3ui/react', '@m3ui/tokens', '@m3ui/motion', '@m3ui/shapes'];
  return {
    slug,
    title: getComponentTitle(slug),
    description: '',
    npmDependencies,
    registryDependencies: [],
    npmInstallCommand: `pnpm add ${npmDependencies.join(' ')}`,
    registryCommand: `npx shadcn@latest add https://m3ui.dev/r/${slug}.json`,
  };
}
