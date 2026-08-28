import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { renderWithM3 } from '../__tests__/test-utils.js';
import { Divider } from '../components/divider.js';

describe('Divider a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithM3(<Divider />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
