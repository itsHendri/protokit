/**
 * Contrast gate. Re-branding tokens.json is the documented workflow, and a pleasant-looking brand
 * colour will happily fail WCAG without anyone noticing. Every pairing the kit actually renders is
 * checked here, and a failure stops the build.
 */
import { blend, contrast } from './color.mjs';

export const AA = 4.5; // WCAG 2.1 AA, normal text. Kit labels are 16px — not "large text".
const AA_NON_TEXT = 3; // WCAG 1.4.11, icons and other meaningful non-text.

/** The alpha values the kit actually tints with (bg-<tone>/10 etc). */
const TINTS = [0.1, 0.15, 0.2];
/** Tones that get used as ink — text-<tone> and coloured icons — not just as fills. */
const TONES = ['primary', 'success', 'warning', 'info', 'destructive'];

/**
 * Every way the kit puts one token against another:
 *   1. a fill and its own -foreground label
 *   2. body and muted text on each surface
 *   3. a tone used as INK — text-<tone> and coloured icons — on the page and on a card
 *   4. a tone's icon sitting on that same tone's tint, as Alert and IconCircle do
 *
 * 3 and 4 are the ones that matter most for a re-brand: a colour can be a perfectly good
 * fill and still be unreadable as text, which is exactly how an amber warning gets in.
 *
 * `hex` is { name: '#rrggbb' } for one mode. `strict` adds tones as ink on the `muted` and `accent`
 * surfaces too (a link in a muted panel). The theme generator always fixes for strict; the build only
 * warns about it until every committed palette passes (see apps/mobile/BACKLOG.md).
 */
export function contrastFailures(hex, mode, { strict = false } = {}) {
  const pairs = [];
  for (const name of ['primary', 'secondary', 'destructive', 'success', 'warning', 'info', 'accent', 'card', 'popover', 'muted', 'sidebar', 'sidebar-primary', 'sidebar-accent']) {
    if (hex[name] && hex[`${name}-foreground`]) pairs.push([`${name}-foreground on ${name}`, hex[`${name}-foreground`], hex[name]]);
  }
  for (const surface of ['background', 'card', 'muted']) {
    if (hex['muted-foreground'] && hex[surface]) pairs.push([`muted-foreground on ${surface}`, hex['muted-foreground'], hex[surface]]);
    if (hex.foreground && hex[surface]) pairs.push([`foreground on ${surface}`, hex.foreground, hex[surface]]);
  }

  // A tone used as ink rather than as a fill.
  const inkPairs = [];
  for (const tone of TONES) {
    if (!hex[tone]) continue;
    for (const surface of strict ? ['background', 'card', 'muted', 'accent'] : ['background', 'card']) {
      if (hex[surface]) inkPairs.push([`text-${tone} on ${surface}`, hex[tone], hex[surface]]);
    }
  }

  // A tone's icon on that tone's own tint — Alert, IconCircle, SwipeToConfirm.
  const tintPairs = [];
  for (const tone of TONES) {
    if (!hex[tone] || !hex.background) continue;
    for (const alpha of TINTS) {
      tintPairs.push([`${tone} icon on ${tone}/${alpha * 100}`, hex[tone], blend(hex[tone], hex.background, alpha)]);
    }
  }

  const check = (list, threshold) =>
    list
      .map(([label, fg, bg]) => ({ label, fg, bg, ratio: contrast(fg, bg), threshold }))
      .filter((r) => r.ratio < threshold);

  return [...check(pairs, AA), ...check(inkPairs, AA), ...check(tintPairs, AA_NON_TEXT)].map(
    (r) => `  ${mode.padEnd(5)} ${r.label.padEnd(36)} ${r.ratio.toFixed(2)} / ${r.threshold}  (${r.fg} on ${r.bg})`
  );
}

/** Tint strengths a class can ask for (`bg-<tone>/5` … `/20`), for the text-on-tint limits below. */
export const TEXT_TINTS = [0.05, 0.1, 0.15, 0.2];

/**
 * How strong a tint of each tone can be with that same tone's TEXT on it (`text-success` on
 * `bg-success/15`) and still clear AA in both themes: `{ primary: 0.05, destructive: 0, … }`, where 0
 * means never. A different pairing from 3 above (the tone on the page) and 4 (an icon, 3:1): a colour
 * that reads fine on white loses contrast fast on its own tint. Not a gate on the palette, because the
 * kit can always put `text-foreground` on a tint; `kit-tokens check` holds the source to these limits.
 */
export function textOnTintLimits(colors) {
  const modes = ['light', 'dark'].map((mode) => Object.fromEntries(colors.map((c) => [c.name, c[mode]])));
  const limits = {};
  for (const tone of TONES) {
    let max = 0;
    for (const alpha of TEXT_TINTS) {
      const ok = modes.every((hex) => hex[tone] && hex.background && contrast(hex[tone], blend(hex[tone], hex.background, alpha)) >= AA);
      if (!ok) break;
      max = alpha;
    }
    limits[tone] = max;
  }
  return limits;
}

/** `{ primary: 0.05, destructive: 0 }` → "primary up to /5, destructive never". */
export const describeTintLimits = (limits) =>
  Object.entries(limits)
    .map(([tone, max]) => `${tone} ${max ? `up to /${Math.round(max * 100)}` : 'never'}`)
    .join(', ');

/** Run the gate over both modes of the resolved colours; returns the failure lines. */
export function checkContrast(colors, options) {
  const of = (mode) => Object.fromEntries(colors.map((c) => [c.name, c[mode]]));
  return [...contrastFailures(of('light'), 'light', options), ...contrastFailures(of('dark'), 'dark', options)];
}
