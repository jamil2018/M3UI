import { AdaptiveNavigation } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

function AdaptiveNavigationBarExample() {
  return (
    <AdaptiveNavigation destinations={DESTINATIONS} mode="bar" data-testid="docs-adaptive-nav" />
  );
}

function AdaptiveNavigationDemoExample() {
  return (
    <AdaptiveNavigation
      destinations={[
        { value: 'home', label: 'Home', icon: '🏠' },
        { value: 'search', label: 'Search', icon: '🔍' },
        { value: 'settings', label: 'Settings', icon: '⚙️' },
      ]}
      mode="bar"
      data-testid="demo-adaptive-nav"
    />
  );
}

export const adaptiveNavigationExamples: ComponentExampleDefinition[] = [
  {
    id: 'adaptive-navigation-bar',
    componentSlug: 'adaptive-navigation',
    title: 'Navigation bar mode',
    description: 'Adaptive navigation forced to bottom bar layout.',
    source: `const destinations = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

<AdaptiveNavigation destinations={destinations} mode="bar" />`,
    Component: AdaptiveNavigationBarExample,
  },
  {
    id: 'adaptive-navigation-demo',
    componentSlug: 'adaptive-navigation',
    title: 'Storybook demo',
    description: 'Same scenario used in the monolithic Storybook catalog.',
    source: `<AdaptiveNavigation
  destinations={[
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'search', label: 'Search', icon: '🔍' },
    { value: 'settings', label: 'Settings', icon: '⚙️' },
  ]}
  mode="bar"
/>`,
    Component: AdaptiveNavigationDemoExample,
  },
];
