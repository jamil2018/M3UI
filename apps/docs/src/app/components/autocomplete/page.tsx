'use client';

import { Autocomplete } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'autocomplete',
  'Autocomplete',
  <Autocomplete
    label="Country"
    options={[
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'de', label: 'Germany' },
    ]}
  />,
);
