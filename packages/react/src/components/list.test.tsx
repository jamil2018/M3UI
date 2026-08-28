import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { List, ListItem } from '../components/list.js';

describe('List', () => {
  it('renders list items', () => {
    renderWithM3(
      <List>
        <ListItem headline="Item 1" />
        <ListItem headline="Item 2" supportingText="Detail" lines={2} />
      </List>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  it('handles interactive item click', () => {
    let clicked = false;
    renderWithM3(
      <List>
        <ListItem headline="Tap me" interactive onClick={() => { clicked = true; }} />
      </List>,
    );
    fireEvent.click(screen.getByText('Tap me'));
    expect(clicked).toBe(true);
  });
});
