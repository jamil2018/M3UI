'use client';

import { Button, Snackbar, useSnackbar } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

function SnackbarDemo() {
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

export default componentPage(
  'snackbar',
  'Snackbar',
  <Snackbar>
    <SnackbarDemo />
  </Snackbar>,
);
