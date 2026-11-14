import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
