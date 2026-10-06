import type * as PageTree from 'fumadocs-core/page-tree';
import { componentsIn, componentUrl, kit, kits, PLATFORMS } from './kit';

/**
 * The /components sidebar: one root folder per kit (Fumadocs shows them as a switcher), each with its
 * Kitchen Sink categories in registry order.
 */
export const componentsTree: PageTree.Root = {
  name: `${kit.name} components`,
  children: PLATFORMS.map(
    (platform): PageTree.Folder => ({
      type: 'folder',
      name: kits[platform].label,
      description: `${kits[platform].components.length} components · ${kits[platform].stack}`,
      root: true,
      index: { type: 'page', name: `All ${platform} components`, url: `/components/${platform}` },
      children: kits[platform].categories.map(
        (cat): PageTree.Folder => ({
          type: 'folder',
          name: cat.label,
          defaultOpen: false,
          children: componentsIn(platform, cat.id).map((c): PageTree.Item => ({ type: 'page', name: c.title, url: componentUrl(platform, c.id) })),
        })
      ),
    })
  ),
};
