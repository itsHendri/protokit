#!/usr/bin/env node
/**
 * Accessibility gate for the built site: `npm run check:a11y` after `npm run build`.
 *
 * Serves out/ with wrangler (the same rules Cloudflare applies), opens each page in Chromium in light and
 * dark, and runs axe-core (the engine behind Lighthouse's accessibility score) against WCAG 2.1 A and AA,
 * including the kits running inside the phone and browser frames. Any violation fails the run.
 *
 * Needs Chromium once: `npx playwright install chromium` (CI: `--with-deps`).
 *
 * Not yet checked: the mobile kit inside the phone frames (/m). React Native for Web leaves progress rings,
 * radios, sliders and selectable cards unnamed; that is fixed in apps/mobile (see its BACKLOG.md), then
 * MOBILE_FRAMES below becomes `true`.
 */
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const docs = join(import.meta.dirname, '..');
const PORT = Number(process.env.A11Y_PORT ?? 8799);
const BASE = `http://localhost:${PORT}`;

/** The pages people land on, one of each kind, plus the web kit's own pages. */
const PAGES = [
  '/',
  '/components/',
  '/components/mobile/',
  '/components/mobile/button/',
  '/components/web/',
  '/components/web/data-table/',
  '/screens/',
  '/docs/',
  '/docs/install/',
  '/docs/web/',
  '/docs/patterns/',
  '/docs/foundations/',
  '/w/',
  '/w/components/',
  '/w/dashboard/',
  '/w/dashboard/invoices/',
  '/w/dashboard/settings/',
  '/w/landing/',
  '/w/assistant/',
];
const SCHEMES = ['light', 'dark'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const MOBILE_FRAMES = false;

const server = spawn('npx', ['wrangler', 'dev', '--port', String(PORT), '--ip', '127.0.0.1', '--log-level', 'error'], {
  cwd: docs,
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: 'true' },
  stdio: ['ignore', 'inherit', 'inherit'],
});
const stop = () => server.kill('SIGTERM');
process.on('exit', stop);

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(`${BASE}/`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`check-a11y: the preview server did not start on ${BASE}`);
}

await waitForServer();
const browser = await chromium.launch();
const failures = [];

for (const scheme of SCHEMES) {
  const context = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
  for (const path of PAGES) {
    const page = await context.newPage();
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    // Let the frames boot and take the theme, and let entrance animations finish.
    await page.waitForTimeout(1500);
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (dark !== (scheme === 'dark')) {
      failures.push({ path, scheme, rule: 'theme', help: `expected the ${scheme} theme, page rendered ${dark ? 'dark' : 'light'}`, nodes: [] });
    }
    const axe = new AxeBuilder({ page }).withTags(TAGS);
    if (!MOBILE_FRAMES) axe.exclude('iframe[src^="/m/"]');
    const { violations } = await axe.analyze();
    for (const v of violations) {
      failures.push({
        path,
        scheme,
        rule: v.id,
        help: v.help,
        // axe's own reason, e.g. "insufficient color contrast of 3.1 (foreground #…, background #…)".
        nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' > ')}  ${(n.any[0] ?? n.all[0] ?? n.none[0])?.message ?? ''}`),
      });
    }
    console.log(`${violations.length ? '✗' : '✓'} ${scheme.padEnd(5)} ${path}${violations.length ? `  (${violations.map((v) => v.id).join(', ')})` : ''}`);
    await page.close();
  }
  await context.close();
}

await browser.close();
stop();

if (failures.length) {
  console.error(`\ncheck-a11y: ${failures.length} violation(s)`);
  for (const f of failures) {
    console.error(`  ${f.scheme} ${f.path}  ${f.rule}: ${f.help}`);
    for (const n of f.nodes) console.error(`      ${n}`);
  }
  process.exit(1);
}
console.log(`\ncheck-a11y: ${PAGES.length} pages × ${SCHEMES.length} themes, no WCAG 2.1 AA violations${MOBILE_FRAMES ? '' : ' (mobile kit frames not checked yet)'}`);
