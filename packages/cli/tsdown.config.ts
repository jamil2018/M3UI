import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  fixedExtension: false,
  dts: false,
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
});
