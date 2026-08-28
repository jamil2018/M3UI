'use client';

import { Chip, ChipSet } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'chip',
  'Chip',
  <ChipSet>
    <Chip type="assist" label="Assist" />
    <Chip type="filter" label="Filter" defaultSelected />
    <Chip type="input" label="Input" onRemove={() => undefined} />
    <Chip type="suggestion" label="Suggestion" elevated />
  </ChipSet>,
);
