import { Button, Snackbar, useSnackbar } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function SnackbarTrigger() {
  const { show } = useSnackbar();
  return (
    <Button
      variant="filled"
      onClick={() =>
        show({
          message: 'Changes saved',
          action: { label: 'Undo', onClick: () => undefined },
        })
      }
    >
      Show snackbar
    </Button>
  );
}

function SnackbarBasicExample() {
  return (
    <Snackbar>
      <SnackbarTrigger />
    </Snackbar>
  );
}

export const snackbarExamples: ComponentExampleDefinition[] = [
  {
    id: 'snackbar-basic',
    componentSlug: 'snackbar',
    title: 'With action',
    description: 'Snackbar provider with undo action.',
    source: `function App() {
  const { show } = useSnackbar();
  return (
    <Button onClick={() => show({ message: 'Saved', action: { label: 'Undo', onClick: undo } })}>
      Save
    </Button>
  );
}

export default () => (
  <Snackbar><App /></Snackbar>
);`,
    Component: SnackbarBasicExample,
  },
];
