import { NavigationBar, Icon } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: <Icon name="home" /> },
  { value: 'search', label: 'Search', icon: <Icon name="search" />, badge: 3 },
  { value: 'library', label: 'Library', icon: <Icon name="photo_library" /> },
];

function NavigationBarBasicExample() {
  return <div style={{ position: "relative", transform: "translateZ(0)", minHeight: 120, width: "100%" }}><NavigationBar destinations={DESTINATIONS} defaultValue="home" /></div>;
}

export const navigationBarExamples: ComponentExampleDefinition[] = [
  {
    id: 'navigation-bar-basic',
    componentSlug: 'navigation-bar',
    title: 'Destinations',
    description: 'Bottom navigation bar with badges on destinations.',
    source: `<NavigationBar
  destinations={[
    { value: 'home', label: 'Home', icon: <Icon name="home" /> },
    { value: 'search', label: 'Search', icon: <Icon name="search" />, badge: 3 },
    { value: 'library', label: 'Library', icon: <Icon name="photo_library" /> },
  ]}
  defaultValue="home"
/>`,
    Component: NavigationBarBasicExample,
  },
];
