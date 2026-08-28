import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { List, ListItem } from '../components/list.js';

describe('List a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(
      <List>
        <ListItem headline="One" />
        <ListItem headline="Two" />
      </List>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
