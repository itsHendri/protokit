/**
 * Contrast auto-fix. A theme from the picker must never fail the build, so instead of rejecting a brand
 * colour that doesn't read, the fixer keeps its hue and nudges its lightness the least it can, per mode:
 *
 *   1. a label on its fill (`primary-foreground on primary`): flip the label between neutral.0 and
 *      neutral.950; if neither reads, move the fill away from the better one
 *   2. a tone as ink or an icon on its tint (`text-primary on muted`): move the tone away from the page
 *      (darker in light mode, lighter in dark), then re-check its label
 *   3. body or muted text on a surface: move the text away from the surface
 *
 * It checks the STRICT set (tones on muted/accent too). A moved token becomes a literal hex for that
 * mode, and every move is reported as { token, mode, from, to } so the picker can show it.
 */
import { contrast, hexToOklchParts } from '../color.mjs';
import { contrastPairs } from '../contrast.mjs';
import { toGamutHex } from './ramp.mjs';
import { BRAND_LINKED, FOREGROUND_CHOICES } from './semantic.mjs';

const MAX_PASSES = 24;
const STEP = 0.004;

const failing = (pairs) => pairs.filter((r) => r.ratio < r.threshold);

/** Move `hex` in lightness (dir -1 darker, +1 lighter) until ok(candidate); null if it never is. */
function nudge(hex, dir, ok) {
  const [L, C, H] = hexToOklchParts(hex);
  for (let i = 1; i * STEP <= 1; i++) {
    const next = Math.min(1, Math.max(0, L + dir * i * STEP));
    const candidate = toGamutHex([next, C, H]);
    if (ok(candidate)) return candidate;
    if (next === 0 || next === 1) break;
  }
  return null;
}

/**
 * semantic: { name: { light, dark } } of references or hex; lookup: (value) → hex.
 * Returns { semantic, adjustments } — a new map, the input is not touched.
 */
export function fixContrast(semantic, lookup) {
  const out = Object.fromEntries(Object.entries(semantic).map(([k, v]) => [k, { ...v }]));
  const adjustments = [];

  for (const mode of ['light', 'dark']) {
    const original = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, lookup(v[mode])]));
    const away = mode === 'light' ? -1 : 1; // the direction that moves ink away from the page
    const hexNow = () => Object.fromEntries(Object.entries(out).map(([k, v]) => [k, lookup(v[mode])]));
    const set = (name, value) => {
      out[name][mode] = value;
    };

    for (let pass = 0; pass < MAX_PASSES; pass++) {
      const hex = hexNow();
      const [f] = failing(contrastPairs(hex, mode, { strict: true }));
      if (!f) break;

      if (f.fgName === `${f.bgName}-foreground`) {
        // 1. A label on its own fill.
        const [best] = FOREGROUND_CHOICES.map((ref) => ({ ref, ratio: contrast(lookup(ref), hex[f.bgName]) })).sort((a, b) => b.ratio - a.ratio);
        if (best.ratio >= f.threshold && out[f.fgName][mode] !== best.ref) {
          set(f.fgName, best.ref);
          continue;
        }
        const label = lookup(best.ref);
        const dir = contrast(label, '#000000') > contrast(label, '#ffffff') ? 1 : -1; // light label → darker fill
        const moved = nudge(hex[f.bgName], dir, (c) => contrast(label, c) >= f.threshold);
        if (!moved) throw new Error(`fixContrast: cannot fix ${f.label} (${mode})`);
        set(f.fgName, best.ref);
        moveFill(f.bgName, moved);
        continue;
      }

      // 2 and 3: move the ink until every pairing it takes part in as ink passes.
      const ink = f.fgName;
      const asInk = (candidate) =>
        failing(contrastPairs({ ...hex, [ink]: candidate }, mode, { strict: true }).filter((r) => r.fgName === ink)).length === 0;
      const moved = nudge(hex[ink], away, asInk);
      if (!moved) throw new Error(`fixContrast: cannot fix ${f.label} (${mode})`);
      moveFill(ink, moved);
    }

    const left = failing(contrastPairs(hexNow(), mode, { strict: true }));
    if (left.length) throw new Error(`fixContrast: ${left[0].label} still fails in ${mode} after ${MAX_PASSES} passes`);

    for (const [name, before] of Object.entries(original)) {
      const after = lookup(out[name][mode]);
      if (after !== before && out[name][mode].startsWith('#')) adjustments.push({ token: name, mode, from: before, to: after });
    }

    function moveFill(name, hex) {
      const was = lookup(out[name][mode]);
      set(name, hex);
      if (name === 'primary') {
        for (const linked of BRAND_LINKED) if (lookup(out[linked][mode]) === was) set(linked, hex);
      }
    }
  }
  return { semantic: out, adjustments };
}
