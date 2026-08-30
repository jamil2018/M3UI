import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: { port: 6006 },
  resolve: {
    alias: {
      '@m3ui/tokens/tokens.css': resolve(
        __dirname,
        '../../packages/tokens/src/generated/tokens.css',
      ),
      '@m3ui/tokens/theme.css': resolve(
        __dirname,
        '../../packages/tokens/src/generated/theme.css',
      ),
      '@m3ui/motion/motion.css': resolve(
        __dirname,
        '../../packages/motion/src/motion.css',
      ),
    },
  },
});
