import type { HTMLAttributes } from 'react';
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

/**
 * The notebook layout's grid, with the header row spanning the whole viewport. Fumadocs' own template
 * (fumadocs-ui/dist/layouts/notebook/slots/container.js) puts the header in the middle three columns, which
 * stop at --fd-layout-width (97rem): past that the bar was inset on Docs and Components but full-bleed on the
 * home-layout pages, so it jumped between sections. Here the outer gutters are 0px, the sidebar sits flush left
 * under the bar, and the page column takes the rest (DocsPage centres its 900px article in it). The slot spreads
 * `style` after its own gridTemplate, so this wins; the area names are Fumadocs', check them on an upgrade.
 */
export const notebookContainerProps: HTMLAttributes<HTMLDivElement> = {
  style: {
    gridTemplate: `"header header header header header"
"sidebar sidebar toc-popover toc-popover toc-popover"
"sidebar sidebar main toc ." 1fr / 0px var(--fd-sidebar-col) minmax(0, 1fr) var(--fd-toc-col) 0px`,
  },
};
