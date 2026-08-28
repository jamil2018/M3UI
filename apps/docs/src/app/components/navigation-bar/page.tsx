'use client';

import { NavigationBar } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

const destinations = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 3 },
  { value: 'library', label: 'Library', icon: '📚' },
];

export default componentPage('navigation-bar', 'Navigation Bar', <NavigationBar destinations={destinations} defaultValue="home" />);
