import { NavigationBar } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 3 },
  { value: 'library', label: 'Library', icon: '📚' },
];

function NavigationBarBasicExample() {
  return <NavigationBar destinations={DESTINATIONS} defaultValue="home" />;
}

export const navigationBarExamples: ComponentExampleDefinition[] = [
  {
    id: 'navigation-bar-basic',
    componentSlug: 'navigation-bar',
    title: 'Destinations',
    description: 'Bottom navigation bar with badges on destinations.',
    source: `<NavigationBar
  destinations={[
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'search', label: 'Search', icon: '🔍', badge: 3 },
    { value: 'library', label: 'Library', icon: '📚' },
  ]}
  defaultValue="home"
/>`,
    Component: NavigationBarBasicExample,
  },
];
