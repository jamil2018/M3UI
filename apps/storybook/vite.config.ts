import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: { port: 6006 },
  resolve: {
    alias: {
      '@m3ui/tokens/tokens.css': resolve(
        __dirname,
        '../../packages/tokens/dist/tokens.css',
      ),
      '@m3ui/tokens/theme.css': resolve(
        __dirname,
        '../../packages/tokens/dist/theme.css',
      ),
      '@m3ui/motion/motion.css': resolve(
        __dirname,
        '../../packages/motion/dist/motion.css',
      ),
    },
  },
});
