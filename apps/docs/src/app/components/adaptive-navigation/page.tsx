'use client';

import { AdaptiveNavigation } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

const DESTINATIONS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'search', label: 'Search', icon: '🔍', badge: 2 },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
];

export default componentPage(
  'adaptive-navigation',
  'Adaptive Navigation',
  <AdaptiveNavigation destinations={DESTINATIONS} mode="bar" data-testid="docs-adaptive-nav" />,
);
