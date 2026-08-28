import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Card } from '../components/card.js';

describe('Card a11y', () => {
  it('has no accessibility violations for static card', async () => {
    const { container } = renderWithM3(<Card><h2>Title</h2><p>Body</p></Card>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
