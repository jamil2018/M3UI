import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  test: {
    server: { deps: { inline: ['@material/material-color-utilities', '@m3ui/color', '@m3ui/react'] } },
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
