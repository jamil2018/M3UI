'use client';

import { Select } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'select',
  'Select',
  <Select
    label="Framework"
    options={[
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte' },
    ]}
    defaultValue="react"
  />,
);
