import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { M3Provider } from '../provider/m3-provider.js';
import { SegmentedButton, SegmentedButtonItem } from '../components/segmented-button.js';

describe('SegmentedButton a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(
      <SegmentedButton defaultValue={['a']}>
        <SegmentedButtonItem value="a" label="A" />
        <SegmentedButtonItem value="b" label="B" />
      </SegmentedButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders in RTL', () => {
    renderWithM3(
      <M3Provider direction="rtl">
        <SegmentedButton defaultValue={['a']}>
          <SegmentedButtonItem value="a" label="A" />
        </SegmentedButton>
      </M3Provider>,
    );
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
  });
});
