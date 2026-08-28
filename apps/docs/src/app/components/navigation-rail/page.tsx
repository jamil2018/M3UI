'use client';

import { NavigationRail, Fab } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

const destinations = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'browse', label: 'Browse', icon: '📂' },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

export default componentPage(
  'navigation-rail',
  'Navigation Rail',
  <div style={{ display: 'flex', minHeight: 320 }}>
    <NavigationRail destinations={destinations} mode="expanded" header="M3UI" fab={<Fab aria-label="Create" icon="+" size="small" />} menuButton />
  </div>,
);
