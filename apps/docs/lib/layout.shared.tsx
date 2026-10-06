import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { kit } from './kit';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-semibold">
          <span aria-hidden className="bg-primary size-5 rounded-md" />
          {kit.name}
        </span>
      ),
    },
    githubUrl: kit.repo,
    links: [
      { text: 'Components', url: '/components', active: 'nested-url' },
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      { text: 'Screens', url: '/screens' },
      { text: 'Install', url: '/docs/install' },
    ],
  };
}
