import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/provider/index.ts', 'src/primitives/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  banner: { js: '"use client";' },
  external: [
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
});
