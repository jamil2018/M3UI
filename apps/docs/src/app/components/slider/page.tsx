'use client';

import { Slider } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'slider',
  'Slider',
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
    <Slider defaultValue={50} label="Volume" showValueIndicator />
    <Slider defaultValue={[20, 80]} label="Range" />
  </div>,
);
