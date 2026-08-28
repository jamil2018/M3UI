'use client';

import { SegmentedButton, SegmentedButtonItem } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'segmented-button',
  'Segmented Button',
  <SegmentedButton defaultValue={['day']}>
    <SegmentedButtonItem value="day" label="Day" />
    <SegmentedButtonItem value="week" label="Week" />
    <SegmentedButtonItem value="month" label="Month" />
  </SegmentedButton>,
);
