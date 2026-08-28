import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Button } from '../components/button.js';
import { Snackbar, useSnackbar } from '../components/snackbar.js';

function SnackbarDemo() {
  const { show } = useSnackbar();
  return (
    <Button
      variant="filled"
      onClick={() => show({ message: 'Saved successfully' })}
    >
      Show snackbar
    </Button>
  );
}

describe('Snackbar', () => {
  it('shows snackbar on trigger', async () => {
    renderWithM3(
      <Snackbar>
        <SnackbarDemo />
      </Snackbar>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show snackbar' }));
    await waitFor(() => {
      expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    });
  });
});
