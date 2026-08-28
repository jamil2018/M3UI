'use client';

import { Radio, RadioGroup } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'radio',
  'Radio',
  <RadioGroup defaultValue="a" name="demo">
    <Radio value="a" label="Option A" />
    <Radio value="b" label="Option B" />
    <Radio value="c" label="Option C" />
  </RadioGroup>,
);
