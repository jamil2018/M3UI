import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { Slider } from '../components/slider.js';

describe('Slider a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Slider defaultValue={40} label="Volume" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <Slider defaultValue={50} label="RTL Slider" />
      </M3Provider>,
    );
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});
