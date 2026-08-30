import {
  TopAppBar,
  BottomAppBar,
  NavigationRail,
  NavigationDrawer,
  IconButton,
  Fab,
  Icon,
} from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: <Icon name="home" /> },
  { value: 'search', label: 'Search', icon: <Icon name="search" />, badge: 2 },
  { value: 'settings', label: 'Settings', icon: <Icon name="settings" /> },
];

function TopAppBarExample() {
  return (
    <TopAppBar
      title="Photos"
      subtitle="Album"
      trailing={<IconButton aria-label="Search" icon={<Icon name="search" />} />}
    />
  );
}

function BottomAppBarExample() {
  return (
    <BottomAppBar
      fab={<Fab aria-label="Create" icon={<Icon name="add" />} size="standard" />}
      actions={<IconButton aria-label="Menu" icon={<Icon name="menu" />} />}
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
      sections={[{ items: [{ value: 'inbox', label: 'Inbox', icon: <Icon name="inbox" /> }] }]}
    />
  );
}

export const topAppBarExamples: ComponentExampleDefinition[] = [
  {
    id: 'top-app-bar-medium',
    componentSlug: 'top-app-bar',
    title: 'Medium flexible',
    source: `<TopAppBar title="Photos" trailing={<IconButton icon={<Icon name="search" />} />} />`,
    Component: TopAppBarExample,
  },
];

export const bottomAppBarExamples: ComponentExampleDefinition[] = [
  {
    id: 'bottom-app-bar-fab',
    componentSlug: 'bottom-app-bar',
    title: 'With FAB',
    source: `<BottomAppBar fab={<Fab icon={<Icon name="add" />} size="standard" />} actions={...} />`,
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
