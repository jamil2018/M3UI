import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { Button } from '../components/button.js';
import { Menu, MenuItem } from '../components/menu.js';

describe('Menu a11y', () => {
  it('has no accessibility violations when closed', async () => {
    const { container } = renderWithM3(
      <Menu trigger={<Button variant="outlined">Menu</Button>}>
        <MenuItem>Action</MenuItem>
      </Menu>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders in RTL', async () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <Menu trigger={<Button variant="outlined">قائمة</Button>}>
          <MenuItem>عنصر</MenuItem>
        </Menu>
      </M3Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'قائمة' }));
    expect(await screen.findByRole('menuitem', { name: 'عنصر' })).toBeInTheDocument();
  });
});
