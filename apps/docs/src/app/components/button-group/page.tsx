'use client';

import { ButtonGroup, ButtonGroupItem } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'button-group',
  'Button Group',
  <ButtonGroup>
    <ButtonGroupItem>Save</ButtonGroupItem>
    <ButtonGroupItem>Share</ButtonGroupItem>
    <ButtonGroupItem>Delete</ButtonGroupItem>
  </ButtonGroup>,
);
