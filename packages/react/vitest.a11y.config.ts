import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/**/*.a11y.test.{ts,tsx}'],
  },
  ssr: {
    noExternal: ['@material/material-color-utilities', '@m3ui/color', '@m3ui/react'],
  },
});
