'use client';

import { Meter } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'meter',
  'Meter',
  <Meter value={72} min={0} max={100} label="Disk usage" />,
);
