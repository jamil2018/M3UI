'use client';

import { Dialog, AlertDialog, FullScreenDialog, DialogAction, Button } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'dialog',
  'Dialog',
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Dialog trigger={<Button variant="filled">Basic dialog</Button>} headline="Dialog title" body="Supporting text" actions={<DialogAction>OK</DialogAction>} />
    <AlertDialog trigger={<Button variant="outlined">Alert</Button>} headline="Delete file?" body="This cannot be undone." />
    <FullScreenDialog trigger={<Button variant="text">Full screen</Button>} headline="Edit" body="Full screen content" />
  </div>,
);
