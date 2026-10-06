import type * as PageTree from 'fumadocs-core/page-tree';
import { categories, componentsIn, kit } from './kit';

/** The /components sidebar: one folder per Kitchen Sink category, in registry order. */
export const componentsTree: PageTree.Root = {
  name: `${kit.name} components`,
  children: [
    { type: 'page', name: 'All components', url: '/components' },
    ...categories.map(
      (cat): PageTree.Folder => ({
        type: 'folder',
        name: cat.label,
        defaultOpen: false,
        children: componentsIn(cat.id).map((c): PageTree.Item => ({ type: 'page', name: c.title, url: `/components/${c.id}` })),
      })
    ),
  ],
};
