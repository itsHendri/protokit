#!/usr/bin/env node
/**
 * Every internal link in out/ resolves to a file the site will serve. Run after `npm run build`.
 * External links are not fetched; anchors (#…) and the mobile kit's /m routes (served by _redirects) are skipped.
 * The web kit's export under /w is walked too: its pages are static files, so its links must resolve.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const out = join(import.meta.dirname, '..', 'out');
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (name === 'm' && dir === out) continue; // the mobile kit's SPA export
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.html')) pages.push(full);
  }
})(out);

const resolves = (path) => {
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  if (clean.startsWith('/m/') || clean === '/m') return true;
  const target = join(out, clean);
  return (
    existsSync(target) && statSync(target).isFile() ||
    existsSync(join(target, 'index.html')) ||
    existsSync(`${target}.html`)
  );
};

const broken = new Map();
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const [, href] of html.matchAll(/\shref="(\/[^"]*)"/g)) {
    if (href.startsWith('/_next/') || href.startsWith('//')) continue;
    if (!resolves(href)) broken.set(href, page.slice(out.length));
  }
}
if (broken.size) {
  console.error(`check-links: ${broken.size} broken internal link(s):`);
  for (const [href, page] of broken) console.error(`  ${href}  (in ${page})`);
  process.exit(1);
}
console.log(`check-links: ${pages.length} pages, every internal link resolves`);
