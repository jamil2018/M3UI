import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/provider/index.ts', 'src/primitives/index.ts'],
  format: ['esm'],
  fixedExtension: false,
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  ignoreWatch: [
    'registry/**',
    'dist/**',
    '.turbo/**',
    'node_modules/**',
    'packages/react/registry/**',
    'packages/react/dist/**',
  ],
  banner: { js: '"use client";' },
  deps: {
    neverBundle: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@base-ui/react',
      'motion',
      'motion/react',
      '@m3ui/color',
      '@m3ui/icons',
      '@m3ui/motion',
      '@m3ui/tokens',
    ],
  },
});
