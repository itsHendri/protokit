import { createSearchAPI } from 'fumadocs-core/search/server';
import { categoryLabel, components } from '@/lib/kit';
import { source } from '@/lib/source';

export const revalidate = false;

/** One static index: the MDX docs plus every component page (title, exports, notes, caption, aliases). */
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
    ...components.map((c) => ({
      id: `/components/${c.id}`,
      title: c.title,
      description: c.notes.replace(/`/g, ''),
      url: `/components/${c.id}`,
      breadcrumbs: ['Components', categoryLabel(c.category)],
      structuredData: {
        headings: [],
        contents: [c.exports.join(' '), c.notes, c.caption ?? '', (c.aliases ?? []).join(' ')]
          .filter(Boolean)
          .map((content) => ({ heading: undefined, content: content.replace(/`/g, '') })),
      },
    })),
  ],
});
