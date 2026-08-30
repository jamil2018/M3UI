import { AdaptiveNavigation, Icon } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: <Icon name="home" /> },
  { value: 'search', label: 'Search', icon: <Icon name="search" />, badge: 2 },
  { value: 'settings', label: 'Settings', icon: <Icon name="settings" /> },
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
        { value: 'home', label: 'Home', icon: <Icon name="home" /> },
        { value: 'search', label: 'Search', icon: <Icon name="search" /> },
        { value: 'settings', label: 'Settings', icon: <Icon name="settings" /> },
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
  { value: 'home', label: 'Home', icon: <Icon name="home" /> },
  { value: 'search', label: 'Search', icon: <Icon name="search" />, badge: 2 },
  { value: 'settings', label: 'Settings', icon: <Icon name="settings" /> },
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
    { value: 'home', label: 'Home', icon: <Icon name="home" /> },
    { value: 'search', label: 'Search', icon: <Icon name="search" /> },
    { value: 'settings', label: 'Settings', icon: <Icon name="settings" /> },
  ]}
  mode="bar"
/>`,
    Component: AdaptiveNavigationDemoExample,
  },
];
