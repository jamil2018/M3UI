import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@m3ui/react', '@m3ui/tokens', '@m3ui/color'],
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
