import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { kit } from './kit';

/** The site's own address, for absolute URLs in text files. Set kit.json `siteUrl` once deployed. */
export const siteUrl = (kit.siteUrl ?? process.env.SITE_URL ?? '').replace(/\/$/, '');
export const site = (path: string) => (siteUrl ? `${siteUrl}${path}` : path);

/**
 * apps/mobile/llms.txt with its repo-relative links made absolute, so it reads the same served from
 * this site. Build time only (the routes that use it are static).
 */
export function mobileLlms(): string {
  const text = readFileSync(join(process.cwd(), '../mobile/llms.txt'), 'utf8');
  return text.replace(/\]\((?!https?:|#|\/)([^)]+)\)/g, (_m, path: string) => `](${kit.repo}/blob/main/apps/mobile/${path})`);
}
