import { render, type RenderOptions } from '@testing-library/react';
import { M3Provider } from '../provider/m3-provider.js';

export function renderWithM3(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: ({ children }) => <M3Provider>{children}</M3Provider>,
    ...options,
  });
}
