import {
  TopAppBar,
  BottomAppBar,
  NavigationRail,
  NavigationDrawer,
  IconButton,
  Fab,
} from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

function TopAppBarExample() {
  return (
    <TopAppBar
      title="Photos"
      subtitle="Album"
      trailing={<IconButton aria-label="Search" icon="🔍" />}
    />
  );
}

function BottomAppBarExample() {
  return (
    <BottomAppBar
      fab={<Fab aria-label="Create" icon="+" size="small" />}
      actions={<IconButton aria-label="Menu" icon="☰" />}
    />
  );
}

function NavigationRailExample() {
  return <NavigationRail destinations={DESTINATIONS} mode="collapsed" />;
}

function NavigationDrawerExample() {
  return (
    <NavigationDrawer
      variant="standard"
      sections={[{ items: [{ value: 'inbox', label: 'Inbox', icon: '📥' }] }]}
    />
  );
}

export const topAppBarExamples: ComponentExampleDefinition[] = [
  {
    id: 'top-app-bar-medium',
    componentSlug: 'top-app-bar',
    title: 'Medium flexible',
    source: `<TopAppBar title="Photos" trailing={<IconButton icon="🔍" />} />`,
    Component: TopAppBarExample,
  },
];

export const bottomAppBarExamples: ComponentExampleDefinition[] = [
  {
    id: 'bottom-app-bar-fab',
    componentSlug: 'bottom-app-bar',
    title: 'With FAB',
    source: `<BottomAppBar fab={<Fab icon="+" />} actions={...} />`,
    Component: BottomAppBarExample,
  },
];

export const navigationRailExamples: ComponentExampleDefinition[] = [
  {
    id: 'nav-rail-collapsed',
    componentSlug: 'navigation-rail',
    title: 'Collapsed rail',
    source: `<NavigationRail destinations={destinations} mode="collapsed" />`,
    Component: NavigationRailExample,
  },
];

export const navigationDrawerExamples: ComponentExampleDefinition[] = [
  {
    id: 'nav-drawer-standard',
    componentSlug: 'navigation-drawer',
    title: 'Standard drawer',
    source: `<NavigationDrawer variant="standard" sections={sections} />`,
    Component: NavigationDrawerExample,
  },
];
