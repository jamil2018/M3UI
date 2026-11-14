import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const repoRoot = resolve(__dirname, '../../..');

/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: [],
  async viteFinal(storybookConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(storybookConfig, {
      resolve: {
        alias: {
          '@m3ui/react': resolve(repoRoot, 'packages/react/dist/index.js'),
          '@m3ui/react/provider': resolve(repoRoot, 'packages/react/dist/provider/index.js'),
          '@m3ui/react/primitives': resolve(repoRoot, 'packages/react/dist/primitives/index.js'),
          '@m3ui/examples': resolve(repoRoot, 'packages/examples/src/index.ts'),
          '@m3ui/tokens/tokens.css': resolve(repoRoot, 'packages/tokens/src/generated/tokens.css'),
          '@m3ui/tokens/theme.css': resolve(repoRoot, 'packages/tokens/src/generated/theme.css'),
          '@m3ui/motion/motion.css': resolve(repoRoot, 'packages/motion/src/motion.css'),
        },
      },
    });
  },
};
