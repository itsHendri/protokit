import { createGetUrl } from 'fumadocs-core/source';

export const docsRoute = '/docs';
export const docsContentRoute = '/llms.mdx/docs';

const getContentUrl = createGetUrl(docsContentRoute);

/** The raw Markdown of a docs page, for agents and the "copy as Markdown" button. */
export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: getContentUrl(segments, page.locale) };
}

/**
 * Syntax themes with AA-contrast comments on our card colours (github-dark's #6a737d comments measure
 * 3.67:1 on the dark card; the "-default" variants clear 4.5:1).
 */
export const codeThemes = { light: 'github-light-default', dark: 'github-dark-default' } as const;
