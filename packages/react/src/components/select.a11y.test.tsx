import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { Select } from '../components/select.js';

describe('Select a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(
      <Select options={[{ value: '1', label: 'One' }]} label="Pick" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <Select options={[{ value: '1', label: 'واحد' }]} label="اختر" />
      </M3Provider>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
