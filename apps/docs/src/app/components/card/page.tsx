'use client';

import { Card } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'card',
  'Card',
  <div style={{ display: 'flex', gap: 16 }}>
    <Card variant="elevated" style={{ padding: 16 }}>Elevated</Card>
    <Card variant="filled" style={{ padding: 16 }}>Filled</Card>
    <Card variant="outlined" style={{ padding: 16 }}>Outlined</Card>
  </div>,
);
