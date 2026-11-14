import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Button } from '../components/button.js';
import { Tooltip, RichTooltip } from '../components/tooltip.js';

describe('Tooltip', () => {
  it('opens on keyboard focus when composed with the public Button', async () => {
    renderWithM3(<Tooltip trigger={<Button>Composed trigger</Button>} content="Composed help" />);
    fireEvent.focus(screen.getByRole('button', { name: 'Composed trigger' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Composed help');
  });
  it('renders trigger', () => {
    renderWithM3(<Tooltip trigger={<Button>Hover</Button>} content="Help text" />);
    expect(screen.getByRole('button', { name: 'Hover' })).toBeInTheDocument();
  });

  it('renders rich tooltip trigger', () => {
    renderWithM3(
      <RichTooltip trigger={<Button>Preview</Button>} title="Title" description="Details" />,
    );
    expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument();
  });
});
