import { THEME } from '@/lib/theme';

/**
 * A live theme from the docs site's picker, for the kit inside its browser frame. Same contract as the
 * mobile kit (apps/mobile/lib/embed-theme.ts); here `vars` are oklch, as app/tokens.css writes them.
 *
 *   host → kit   { type: 'kit:tokens', v: 1, code, vars: { light, dark } }
 *                { type: 'kit:tokens', v: 1, code: null }   back to the committed theme
 *   kit → host   { type: 'kit:applied', code }
 *
 * The docs site also caches the theme in sessionStorage (EMBED_THEME_KEY) so embedBootScript paints it
 * before React runs; the checks and selectors there mirror these.
 */
export type EmbedTokens = { code: string | null; vars?: { light: Record<string, string>; dark: Record<string, string> } };

export const EMBED_THEME_KEY = 'kit.embed.theme';
export const OVERRIDE_STYLE_ID = 'kit-theme-override';

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').replace(/([a-z])(\d)/g, '$1-$2').toLowerCase();
const ALLOWED_VARS = new Set([...Object.keys(THEME.light).map((k) => `--${kebab(k)}`), '--radius']);
const SAFE_VALUE = /^[\w.%\s(),#/-]{1,80}$/;

function cleanVars(map: unknown): Record<string, string> {
  if (!map || typeof map !== 'object') return {};
  return Object.fromEntries(
    Object.entries(map as Record<string, unknown>).filter(
      ([name, value]) => ALLOWED_VARS.has(name) && typeof value === 'string' && SAFE_VALUE.test(value) && !/url/i.test(value)
    ) as [string, string][]
  );
}

export function parseEmbedTokens(data: unknown): EmbedTokens | null {
  const d = data as { type?: unknown; v?: unknown; code?: unknown; vars?: { light?: unknown; dark?: unknown } } | null;
  if (!d || d.type !== 'kit:tokens' || d.v !== 1) return null;
  if (d.code === null) return { code: null };
  if (typeof d.code !== 'string' || !/^pk1-[0-9A-Z]{12}$/i.test(d.code)) return null;
  return { code: d.code, vars: { light: cleanVars(d.vars?.light), dark: cleanVars(d.vars?.dark) } };
}

/** Put the theme on the page, or take it off. Beats app/tokens.css (`:root`, `.dark`) on specificity. */
export function applyEmbedTokens(tokens: EmbedTokens) {
  let style = document.getElementById(OVERRIDE_STYLE_ID);
  if (tokens.code === null || !tokens.vars) {
    style?.remove();
    return;
  }
  if (!style) {
    style = document.createElement('style');
    style.id = OVERRIDE_STYLE_ID;
    document.head.appendChild(style);
  }
  const block = (selector: string, vars: Record<string, string>) =>
    `${selector}{${Object.entries(vars).map(([k, v]) => `${k}:${v};`).join('')}}`;
  style.textContent = block(':root:root:root', tokens.vars.light) + block('.dark:root:root:root', tokens.vars.dark);
}
