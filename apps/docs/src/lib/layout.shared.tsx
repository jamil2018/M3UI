import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: 'https://github.com/m3ui/m3ui',
    nav: {
      title: 'M3UI',
      url: '/',
      enableSearch: true,
    },
    links: [
      {
        text: 'Components',
        url: '/components',
        active: 'nested-url',
      },
      {
        text: 'Tokens',
        url: '/tokens',
        active: 'url',
      },
      {
        text: 'Guides',
        url: '/guides/rsc',
        active: 'nested-url',
      },
      {
        text: 'Registry',
        url: '/registry.json',
        active: 'none',
      },
    ],
  };
}
