import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/__tests__/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['src/**/*.a11y.test.{ts,tsx}'],
  },
  ssr: {
    noExternal: ['@material/material-color-utilities', '@m3ui/color', '@m3ui/react'],
  },
});
