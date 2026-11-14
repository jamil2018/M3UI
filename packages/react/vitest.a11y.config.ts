import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

export default defineConfig({
  root: import.meta.dirname,
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: join(root, 'node_modules/react'),
      'react-dom': join(root, 'node_modules/react-dom'),
      '@m3ui/color': join(root, 'packages/color/src/index.ts'),
      '@m3ui/icons': join(root, 'packages/icons/src/index.ts'),
      '@m3ui/motion': join(root, 'packages/motion/src/index.ts'),
      '@m3ui/shapes': join(root, 'packages/shapes/src/index.ts'),
      '@m3ui/tokens': join(root, 'packages/tokens/src/index.ts'),
    },
  },
  test: {
    server: { deps: { inline: ['@material/material-color-utilities', '@m3ui/color', '@m3ui/react'] } },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../vitest.setup.ts'],
    include: ['src/**/*.a11y.test.{ts,tsx}'],
  },
});
