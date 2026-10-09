import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { SiteHeader } from '@/components/site-header';
import { SECTIONS } from '@/lib/sections';
import { kit } from './kit';

/**
 * Options both Fumadocs layouts share. The top bar is our own SiteHeader on every page, so the navigation
 * never moves between sections (apps/docs/design/navigation-wireframes.md). `links` only feeds the notebook
 * layout's phone drawer, where the sections sit above the section's tree.
 */
export function baseOptions(layout: 'home' | 'docs' = 'home'): BaseLayoutProps {
  return {
    nav: {
      title: kit.name,
      component: <SiteHeader variant={layout} />,
    },
    links: [
      ...SECTIONS.map((s) => ({ text: s.text, url: s.url, active: 'nested-url' as const, on: 'menu' as const })),
      { text: 'Get started', url: '/docs/install', on: 'menu' as const },
    ],
  };
}
