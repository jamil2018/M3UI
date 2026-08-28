'use client';

import { Checkbox, CheckboxGroup } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'checkbox',
  'Checkbox',
  <CheckboxGroup defaultValue={[]}>
    <Checkbox label="Option A" value="a" />
    <Checkbox label="Option B" value="b" />
    <Checkbox label="Indeterminate" indeterminate />
  </CheckboxGroup>,
);
