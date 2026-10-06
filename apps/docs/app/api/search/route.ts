import { createSearchAPI } from 'fumadocs-core/search/server';
import { categoryLabel, componentUrl, kits, PLATFORMS } from '@/lib/kit';
import { source } from '@/lib/source';

export const revalidate = false;

/** One static index: the MDX docs plus every component page of both kits (title, exports, notes, caption, aliases). */
export const { staticGET: GET } = createSearchAPI('advanced', {
  language: 'english',
  indexes: async () => [
    ...source.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      breadcrumbs: ['Docs'],
      structuredData: page.data.structuredData,
    })),
    ...PLATFORMS.flatMap((platform) =>
      kits[platform].components.map((c) => ({
        id: componentUrl(platform, c.id),
        title: c.title,
        description: c.notes.replace(/`/g, ''),
        url: componentUrl(platform, c.id),
        breadcrumbs: [kits[platform].label, categoryLabel(platform, c.category)],
        structuredData: {
          headings: [],
          contents: [c.exports.join(' '), c.notes, c.caption ?? '', (c.aliases ?? []).join(' ')]
            .filter(Boolean)
            .map((content) => ({ heading: undefined, content: content.replace(/`/g, '') })),
        },
      }))
    ),
  ],
});
