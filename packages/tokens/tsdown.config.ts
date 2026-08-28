import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  copy: [
    { from: 'src/generated/tokens.css', to: 'dist/tokens.css' },
    { from: 'src/generated/theme.css', to: 'dist/theme.css' },
  ],
});
