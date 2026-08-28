import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Slider } from '../components/slider.js';

describe('Slider', () => {
  it('renders with default value', () => {
    renderWithM3(<Slider defaultValue={50} data-testid="slider" />);
    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders range slider', () => {
    renderWithM3(<Slider defaultValue={[20, 80]} data-testid="range" />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('renders vertical orientation', () => {
    renderWithM3(<Slider orientation="vertical" defaultValue={30} data-testid="vertical" />);
    expect(screen.getByTestId('vertical')).toBeInTheDocument();
  });

  it('renders centered slider', () => {
    renderWithM3(<Slider centered defaultValue={0} min={-100} max={100} data-testid="centered" />);
    expect(screen.getByTestId('centered')).toBeInTheDocument();
  });
});
