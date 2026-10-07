import { EMBED, isAllowedOrigin } from '@/lib/embed';
import { THEME } from '@/lib/theme';
import { Platform } from 'react-native';

/**
 * A live theme from the docs site's picker, for the web export inside its phone frame. Native never
 * themes at runtime: a theme reaches the app by `kit-tokens theme apply`, which rewrites tokens.json.
 *
 *   host → kit   { type: 'kit:tokens', v: 1, code, vars: { light, dark }, hex: { light, dark } }
 *                { type: 'kit:tokens', v: 1, code: null }   back to the committed theme
 *   kit → host   { type: 'kit:applied', code }
 *
 * `vars` are CSS variables in this kit's format (HSL triplets, as global.css writes them); `hex` is the
 * same palette for usePalette(). The host resolves everything; the kit only checks and applies it:
 * variable names must be ones global.css defines, values plain colour/length syntax. The applied CSS is
 * also kept in sessionStorage (same origin as the docs), so public/index.html can paint it first.
 */
export type ThemeHex = Partial<Record<keyof typeof THEME.light, string>>;
export type EmbedTokens = {
  code: string | null;
  /** Google Fonts family names by role; loaded from fonts.googleapis.com while the theme is live. */
  fonts?: { heading?: string; body?: string };
  vars?: { light?: Record<string, string>; dark?: Record<string, string> };
  hex?: { light?: ThemeHex; dark?: ThemeHex };
};

const STYLE_ID = 'kit-theme-override';
const FONTS_ID = 'kit-theme-fonts';
const FAMILY = /^[A-Za-z0-9 ]{1,40}$/;
/** Shared with public/index.html (pre-paint) and the docs site (apps/docs/lib/theme), which writes it. */
export const EMBED_THEME_KEY = 'kit.embed.theme';

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').replace(/([a-z])(\d)/g, '$1-$2').toLowerCase();
const ALLOWED_VARS = new Set([...Object.keys(THEME.light).map((k) => `--${kebab(k)}`), '--radius', '--radius-control', '--border-width', '--icon-stroke', '--shadow-1', '--shadow-2', '--shadow-3']);
const SAFE_VALUE = /^[\w.%\s(),#/-]{1,80}$/;
const HEX = /^#[0-9a-f]{6}$/i;

function cleanVars(map: unknown): Record<string, string> {
  if (!map || typeof map !== 'object') return {};
  return Object.fromEntries(
    Object.entries(map as Record<string, unknown>).filter(
      ([name, value]) => ALLOWED_VARS.has(name) && typeof value === 'string' && SAFE_VALUE.test(value) && !/url/i.test(value)
    ) as [string, string][]
  );
}

function cleanHex(map: unknown): ThemeHex {
  if (!map || typeof map !== 'object') return {};
  return Object.fromEntries(
    Object.entries(map as Record<string, unknown>).filter(([name, value]) => name in THEME.light && typeof value === 'string' && HEX.test(value))
  ) as ThemeHex;
}

/** Validate a message (or a cached copy). Returns null for anything that isn't a theme. */
export function parseEmbedTokens(data: unknown): EmbedTokens | null {
  const d = data as { type?: unknown; v?: unknown; code?: unknown; vars?: { light?: unknown; dark?: unknown }; hex?: { light?: unknown; dark?: unknown } } | null;
  if (!d || d.type !== 'kit:tokens' || d.v !== 1) return null;
  if (d.code === null) return { code: null };
  if (typeof d.code !== 'string' || !/^pk1-[0-9A-Z]{12}$/i.test(d.code)) return null;
  const f = (d as { fonts?: { heading?: unknown; body?: unknown } }).fonts;
  const family = (v: unknown) => (typeof v === 'string' && FAMILY.test(v) ? v : undefined);
  return {
    code: d.code,
    fonts: { heading: family(f?.heading), body: family(f?.body) },
    vars: { light: cleanVars(d.vars?.light), dark: cleanVars(d.vars?.dark) },
    hex: { light: cleanHex(d.hex?.light), dark: cleanHex(d.hex?.dark) },
  };
}

/**
 * Tailwind's shadow classes carry literal values here (a var() box-shadow breaks native), so a live
 * theme points them at its depth variables. Mirrored in public/index.html.
 */
export const SHADOW_RULES =
  '.shadow-xs,.shadow-sm,.shadow{--tw-shadow:var(--shadow-1)!important}' +
  '.shadow-md{--tw-shadow:var(--shadow-2)!important}' +
  '.shadow-lg,.shadow-xl,.shadow-2xl{--tw-shadow:var(--shadow-3)!important}';

/**
 * The stylesheet for a theme. Higher specificity than global.css (`:root`, `.dark:root`) so it wins
 * whatever order the sheets load in, and light/dark keep switching through the `dark` class.
 */
export function overrideCss(tokens: EmbedTokens): string {
  const block = (selector: string, vars: Record<string, string> = {}) =>
    `${selector}{${Object.entries(vars).map(([k, v]) => `${k}:${v};`).join('')}}`;
  const shadows = tokens.vars?.light?.['--shadow-1'] ? SHADOW_RULES : '';
  return block(':root:root:root', tokens.vars?.light) + block('.dark:root:root:root', tokens.vars?.dark) + shadows;
}

/** Put the theme on the page (or take it off), and remember it for the next load in this tab. */
export function applyEmbedTokens(tokens: EmbedTokens) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  let style = document.getElementById(STYLE_ID);
  applyFonts(tokens);
  if (tokens.code === null) {
    style?.remove();
  } else {
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = overrideCss(tokens);
  }
}

/** Load a live theme's fonts from Google Fonts (the committed theme's fonts are bundled). */
function applyFonts(tokens: EmbedTokens) {
  const families = [...new Set([tokens.fonts?.heading, tokens.fonts?.body].filter((f): f is string => !!f))];
  let link = document.getElementById(FONTS_ID) as HTMLLinkElement | null;
  if (tokens.code === null || !families.length) {
    link?.remove();
    return;
  }
  const href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&')}&display=swap`;
  if (!link) {
    link = document.createElement('link');
    link.id = FONTS_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;
}

/** The theme cached by the docs site for this tab, so the first render already has its palette. */
export function cachedEmbedTokens(): EmbedTokens | null {
  if (!EMBED.embedded || Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(EMBED_THEME_KEY);
    const cached = raw ? (JSON.parse(raw) as { code?: unknown; mobile?: unknown }) : null;
    return cached ? parseEmbedTokens({ type: 'kit:tokens', v: 1, ...(cached.mobile as object), code: cached.code }) : null;
  } catch {
    return null;
  }
}

/** Reply to the host once a theme is on the page, so the frame can show it. */
export function reportApplied(code: string | null, origin: string) {
  if (typeof window === 'undefined' || window.parent === window || !isAllowedOrigin(origin)) return;
  window.parent.postMessage({ type: 'kit:applied', code }, origin);
}
