'use client';

import { LoadingIndicator } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'loading-indicator',
  'Loading Indicator',
  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
    <LoadingIndicator />
    <LoadingIndicator contained />
  </div>,
);
