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
 * `hex` is { name: '#rrggbb' } for one mode.
 */
export function contrastFailures(hex, mode) {
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
    for (const surface of ['background', 'card']) {
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

/** Run the gate over both modes of the resolved colours; returns the failure lines. */
export function checkContrast(colors) {
  const of = (mode) => Object.fromEntries(colors.map((c) => [c.name, c[mode]]));
  return [...contrastFailures(of('light'), 'light'), ...contrastFailures(of('dark'), 'dark')];
}
