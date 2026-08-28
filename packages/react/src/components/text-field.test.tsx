import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { TextField } from '../components/text-field.js';

describe('TextField', () => {
  it('renders filled variant with label', () => {
    renderWithM3(<TextField label="Email" variant="filled" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders outlined variant', () => {
    renderWithM3(<TextField label="Name" variant="outlined" data-testid="tf" />);
    expect(screen.getByTestId('tf')).toBeInTheDocument();
  });

  it('accepts input', () => {
    renderWithM3(<TextField label="Search" defaultValue="" />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input).toHaveValue('hello');
  });

  it('shows supporting text', () => {
    renderWithM3(<TextField label="Bio" supportingText="Max 100 chars" multiline />);
    expect(screen.getByText('Max 100 chars')).toBeInTheDocument();
  });

  it('shows counter', () => {
    renderWithM3(<TextField label="Title" counter maxLength={50} defaultValue="Hi" />);
    expect(screen.getByText('2/50')).toBeInTheDocument();
  });
});
