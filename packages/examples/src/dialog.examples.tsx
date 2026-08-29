import { Dialog, AlertDialog, FullScreenDialog, DialogAction, Button } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function DialogVariantsExample() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Dialog
        trigger={<Button variant="filled">Basic dialog</Button>}
        headline="Dialog title"
        body="Supporting text"
        actions={<DialogAction>OK</DialogAction>}
      />
      <AlertDialog
        trigger={<Button variant="outlined">Alert</Button>}
        headline="Delete file?"
        body="This cannot be undone."
      />
      <FullScreenDialog
        trigger={<Button variant="text">Full screen</Button>}
        headline="Edit"
        body="Full screen content"
      />
    </div>
  );
}

function DialogBasicExample() {
  return (
    <Dialog trigger={<Button variant="outlined">Dialog</Button>} headline="Dialog" body="Body" />
  );
}

export const dialogExamples: ComponentExampleDefinition[] = [
  {
    id: 'dialog-variants',
    componentSlug: 'dialog',
    title: 'Variants',
    description: 'Basic, alert, and full-screen dialog patterns.',
    source: `<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  <Dialog
    trigger={<Button variant="filled">Basic dialog</Button>}
    headline="Dialog title"
    body="Supporting text"
    actions={<DialogAction>OK</DialogAction>}
  />
  <AlertDialog
    trigger={<Button variant="outlined">Alert</Button>}
    headline="Delete file?"
    body="This cannot be undone."
  />
  <FullScreenDialog
    trigger={<Button variant="text">Full screen</Button>}
    headline="Edit"
    body="Full screen content"
  />
</div>`,
    Component: DialogVariantsExample,
  },
  {
    id: 'dialog-basic',
    componentSlug: 'dialog',
    title: 'Basic',
    description: 'Minimal dialog trigger from the Storybook demo.',
    source: `<Dialog trigger={<Button variant="outlined">Dialog</Button>} headline="Dialog" body="Body" />`,
    Component: DialogBasicExample,
  },
];
