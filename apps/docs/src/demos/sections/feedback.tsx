'use client';

import {
  LinearProgress,
  CircularProgress,
  LoadingIndicator,
  Meter,
  Snackbar,
  useSnackbar,
  Button,
} from '@m3ui/react';
import { column } from '../shared';

export function ProgressDemo() {
  return (
    <div style={{ ...column, maxWidth: 400 }}>
      <LinearProgress value={60} />
      <LinearProgress value={40} variant="wavy" />
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <CircularProgress value={75} />
        <CircularProgress value={50} variant="wavy" />
      </div>
    </div>
  );
}

export function LoadingIndicatorDemo() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <LoadingIndicator contained />
      <div style={{ width: 120, height: 80, position: 'relative', border: '1px dashed var(--md-sys-color-outline-variant)' }}>
        <LoadingIndicator contained />
      </div>
    </div>
  );
}

function SnackbarTrigger() {
  const { show } = useSnackbar();
  return (
    <Button
      variant="filled-tonal"
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

export function SnackbarDemo() {
  return (
    <Snackbar>
      <SnackbarTrigger />
    </Snackbar>
  );
}

export function MeterDemo() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Meter value={65} label="Storage used" min={0} max={100} />
    </div>
  );
}
