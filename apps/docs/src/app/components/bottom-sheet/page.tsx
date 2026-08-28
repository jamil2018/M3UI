'use client';

import { BottomSheet, Button } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'bottom-sheet',
  'Bottom Sheet',
  <BottomSheet trigger={<Button variant="filled">Show bottom sheet</Button>} snapPoints={[0.4, 1]}>
    <p>Sheet content with drag handle and snap points.</p>
  </BottomSheet>,
);
