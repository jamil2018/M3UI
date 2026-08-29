import { Tabs } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function TabsPrimaryExample() {
  return (
    <Tabs
      variant="primary"
      layout="fixed"
      items={[
        { value: 'photos', label: 'Photos', panel: 'Photos panel' },
        { value: 'albums', label: 'Albums', panel: 'Albums panel' },
        { value: 'stories', label: 'Stories', panel: 'Stories panel' },
      ]}
    />
  );
}

function TabsCompactExample() {
  return (
    <Tabs
      items={[
        { value: 'a', label: 'Tab A', panel: 'Panel A' },
        { value: 'b', label: 'Tab B', panel: 'Panel B' },
      ]}
    />
  );
}

export const tabsExamples: ComponentExampleDefinition[] = [
  {
    id: 'tabs-primary',
    componentSlug: 'tabs',
    title: 'Primary tabs',
    description: 'Fixed primary tabs with three panels.',
    source: `<Tabs
  variant="primary"
  layout="fixed"
  items={[
    { value: 'photos', label: 'Photos', panel: 'Photos panel' },
    { value: 'albums', label: 'Albums', panel: 'Albums panel' },
    { value: 'stories', label: 'Stories', panel: 'Stories panel' },
  ]}
/>`,
    Component: TabsPrimaryExample,
  },
  {
    id: 'tabs-compact',
    componentSlug: 'tabs',
    title: 'Compact',
    description: 'Default tabs layout from the Storybook demo.',
    source: `<Tabs
  items={[
    { value: 'a', label: 'Tab A', panel: 'Panel A' },
    { value: 'b', label: 'Tab B', panel: 'Panel B' },
  ]}
/>`,
    Component: TabsCompactExample,
  },
];
