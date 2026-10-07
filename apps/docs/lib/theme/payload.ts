/**
 * What the docs site sends each embedded kit for a theme, in that kit's own variable format (the format
 * its tokens:build writes). Shared contract: apps/mobile/lib/embed-theme.ts and apps/web/lib/embed-theme.ts.
 */
import { googleFontsHref, themeCss, themeHex, themeVars, type Theme } from '@itshendri/kit-tokens/theme';

type Fonts = { heading?: string; body?: string };
export type KitPayload = {
  code: string | null;
  vars?: Record<'light' | 'dark', Record<string, string>>;
  hex?: Record<'light' | 'dark', Record<string, string>>;
  fonts?: Fonts;
};
export type KitPayloads = { code: string | null; mobile: KitPayload; web: KitPayload };

/** `live: false` (the committed theme) tells the kits to drop any override. */
export function kitPayloads(theme: Theme, live: boolean): KitPayloads {
  if (!live) return { code: null, mobile: { code: null }, web: { code: null } };
  const f = theme.fonts;
  const fonts: Fonts = { heading: f.heading || undefined, body: f.body || undefined };
  return {
    code: theme.code,
    mobile: { code: theme.code, vars: themeVars(theme, 'hsl'), hex: themeHex(theme), fonts },
    web: { code: theme.code, vars: themeVars(theme, 'oklch'), fonts },
  };
}

const SANS = 'ui-sans-serif, system-ui, sans-serif';

/** Google Fonts for a theme's heading and body, or null for the system font. */
export const fontsHref = (theme: Theme) => googleFontsHref([theme.recipe.font.heading, theme.recipe.font.body]);

/**
 * The docs site's own stylesheet for a theme. More specific than app/tokens.css (`:root`, `.dark`), and
 * Fumadocs reads the same variables (fumadocs-ui/css/shadcn.css), so the whole chrome follows.
 */
export function siteCss(theme: Theme) {
  const f = theme.fonts;
  const body = f.body ? `"${f.body}", ${SANS}` : SANS;
  const heading = f.heading ? `"${f.heading}", ${SANS}` : body;
  // app/tokens.css maps these to font-sans and the h1–h4 heading font.
  const fonts = `:root:root{--kit-font-body:${body};--kit-font-heading:${heading};}\n`;
  return themeCss(theme, { format: 'oklch', light: ':root:root', dark: '.dark:root:root' }) + fonts;
}
