'use client';

import { LinearProgress, CircularProgress } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'progress',
  'Progress',
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
    <LinearProgress value={60} />
    <LinearProgress value={40} variant="wavy" />
    <CircularProgress value={75} />
    <CircularProgress value={50} variant="wavy" />
  </div>,
);
