import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Snackbar, SnackbarProvider } from '../components/snackbar.js';

describe('Snackbar a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(
      <SnackbarProvider>
        <div>Content</div>
      </SnackbarProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
