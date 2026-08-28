'use client';

import { Badge } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'badge',
  'Badge',
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Badge variant="dot" />
    <Badge count={3} />
    <Badge count={120} max={99} />
  </div>,
);
