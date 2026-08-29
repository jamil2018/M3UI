import type { NextConfig } from 'next';

import path from 'node:path';

import { fileURLToPath } from 'node:url';



const docsRoot = path.dirname(fileURLToPath(import.meta.url));

const repoRoot = path.join(docsRoot, '../..');



const nextConfig: NextConfig = {

  serverExternalPackages: ['@orama/orama'],

  transpilePackages: [

    '@m3ui/react',

    '@m3ui/tokens',

    '@m3ui/color',

    '@m3ui/examples',

    '@m3ui/motion',

    '@m3ui/shapes',

    '@m3ui/icons',

  ],

  experimental: {

    externalDir: true,

  },

  webpack: (config) => {

    config.resolve.alias = {

      ...config.resolve.alias,

      '@m3ui/react/provider': path.join(repoRoot, 'packages/react/dist/provider/index.js'),

      '@m3ui/react/primitives': path.join(repoRoot, 'packages/react/dist/primitives/index.js'),

      '@m3ui/react': path.join(repoRoot, 'packages/react/dist/index.js'),

      '@m3ui/tokens': path.join(repoRoot, 'packages/tokens/dist/index.js'),

      '@m3ui/color': path.join(repoRoot, 'packages/color/dist/index.js'),

      '@m3ui/motion': path.join(repoRoot, 'packages/motion/dist/index.js'),

      '@m3ui/shapes': path.join(repoRoot, 'packages/shapes/dist/index.js'),

      '@m3ui/icons': path.join(repoRoot, 'packages/icons/dist/index.js'),

      '@m3ui/examples': path.join(repoRoot, 'packages/examples/src/index.ts'),

      '@m3ui/examples/metadata': path.join(repoRoot, 'packages/examples/src/metadata.ts'),

    };

    return config;

  },

  async rewrites() {

    return [

      {

        source: '/registry.json',

        destination: '/api/registry',

      },

      {

        source: '/r/:path*',

        destination: '/api/registry/:path*',

      },

    ];

  },

};



export default nextConfig;


