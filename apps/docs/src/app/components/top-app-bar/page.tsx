'use client';

import { TopAppBar, IconButton } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'top-app-bar',
  'Top App Bar',
  <TopAppBar
    title="Photos"
    subtitle="Jan 2026"
    size="medium-flexible"
    onBack={() => undefined}
    trailing={<IconButton aria-label="Search" icon="🔍" />}
  />,
);
