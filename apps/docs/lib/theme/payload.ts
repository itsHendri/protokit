/**
 * What the docs site sends each embedded kit for a theme, in that kit's own variable format (the format
 * its tokens:build writes). Shared contract: apps/mobile/lib/embed-theme.ts and apps/web/lib/embed-theme.ts.
 */
import { themeCss, themeHex, themeVars, type Theme } from '@itshendri/kit-tokens/theme';

export type KitPayload = { code: string | null; vars?: Record<'light' | 'dark', Record<string, string>>; hex?: Record<'light' | 'dark', Record<string, string>> };
export type KitPayloads = { code: string | null; mobile: KitPayload; web: KitPayload };

/** `live: false` (the committed theme) tells the kits to drop any override. */
export function kitPayloads(theme: Theme, live: boolean): KitPayloads {
  if (!live) return { code: null, mobile: { code: null }, web: { code: null } };
  return {
    code: theme.code,
    mobile: { code: theme.code, vars: themeVars(theme, 'hsl'), hex: themeHex(theme) },
    web: { code: theme.code, vars: themeVars(theme, 'oklch') },
  };
}

/**
 * The docs site's own stylesheet for a theme. More specific than app/tokens.css (`:root`, `.dark`), and
 * Fumadocs reads the same variables (fumadocs-ui/css/shadcn.css), so the whole chrome follows.
 */
export const siteCss = (theme: Theme) => themeCss(theme, { format: 'oklch', light: ':root:root', dark: '.dark:root:root' });
