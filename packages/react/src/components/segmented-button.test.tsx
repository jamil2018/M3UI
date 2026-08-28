import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { SegmentedButton, SegmentedButtonItem } from '../components/segmented-button.js';

describe('SegmentedButton', () => {
  it('renders items and selects on click', () => {
    const onValueChange = vi.fn();
    renderWithM3(
      <SegmentedButton defaultValue={['day']} onValueChange={onValueChange}>
        <SegmentedButtonItem value="day" label="Day" />
        <SegmentedButtonItem value="week" label="Week" />
      </SegmentedButton>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Week' }));
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(['week']);
  });

  it('supports multi select', () => {
    const onValueChange = vi.fn();
    renderWithM3(
      <SegmentedButton multiple defaultValue={['a']} onValueChange={onValueChange}>
        <SegmentedButtonItem value="a" label="A" />
        <SegmentedButtonItem value="b" label="B" />
      </SegmentedButton>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(onValueChange).toHaveBeenCalled();
  });
});
