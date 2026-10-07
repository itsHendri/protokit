/**
 * Colour ramps from a seed. A seed that is a curated ramp's 600 step returns that ramp untouched;
 * anything else is generated in OKLCH:
 *   - lightness per step follows the average of Tailwind's chromatic ramps (LIGHTNESS below)
 *   - the seed lands EXACTLY on the step nearest its lightness (the anchor), and the steps around it
 *     bend smoothly towards it, so the ramp stays monotonic
 *   - chroma follows Tailwind's relative chroma profile, scaled so the anchor keeps the seed's chroma
 *   - hue stays the seed's; a step outside sRGB loses chroma until it fits (never clipped)
 */
import { hexToOklchParts, inGamut, oklchPartsToHex } from '../color.mjs';
import { BRAND_RAMPS, NEUTRAL_RAMPS, STEPS } from './palettes.mjs';

const LIGHTNESS = { 50: 0.977, 100: 0.95, 200: 0.906, 300: 0.84, 400: 0.761, 500: 0.683, 600: 0.598, 700: 0.515, 800: 0.446, 900: 0.395, 950: 0.278 };
const CHROMA = { 50: 0.094, 100: 0.222, 200: 0.418, 300: 0.653, 400: 0.855, 500: 0.952, 600: 0.934, 700: 0.83, 800: 0.696, 900: 0.58, 950: 0.418 };

/** Map an OKLCH colour into sRGB by lowering chroma. */
export function toGamutHex([L, C, H]) {
  let lo = 0;
  let hi = C;
  if (inGamut([L, C, H])) return oklchPartsToHex([L, C, H]);
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut([L, mid, H])) lo = mid;
    else hi = mid;
  }
  return oklchPartsToHex([L, lo, H]);
}

/** The curated ramp whose 600 step is this seed, if any. */
export function curatedRamp(seed) {
  const hex = seed.toLowerCase();
  return Object.entries(BRAND_RAMPS).find(([, ramp]) => ramp[600] === hex)?.[0] ?? null;
}

/** The step a seed sits on: its curated 600, or the generated step nearest its lightness. */
export function anchorStep(seed) {
  if (curatedRamp(seed)) return '600';
  const [L] = hexToOklchParts(seed);
  return STEPS.reduce((best, s) => (Math.abs(LIGHTNESS[s] - L) < Math.abs(LIGHTNESS[best] - L) ? s : best), '600');
}

/** { 50: '#…', …, 950: '#…' } for a brand seed. */
export function brandRamp(seed) {
  const curated = curatedRamp(seed);
  if (curated) return { ...BRAND_RAMPS[curated] };

  const [Ls, Cs, Hs] = hexToOklchParts(seed);
  const anchor = anchorStep(seed);
  const ai = STEPS.indexOf(anchor);
  const dL = Ls - LIGHTNESS[anchor];
  const chromaScale = Cs / CHROMA[anchor];
  const ramp = {};
  STEPS.forEach((s, i) => {
    if (s === anchor) {
      ramp[s] = seed.toLowerCase();
      return;
    }
    // The seed's offset from the target lightness fades out over three steps either side, which keeps
    // neighbours in order (|dL| is at most half the gap to the next step).
    const fade = Math.max(0, 1 - Math.abs(i - ai) / 3);
    const L = LIGHTNESS[s] + dL * fade;
    ramp[s] = toGamutHex([L, CHROMA[s] * chromaScale, Hs]);
  });
  return ramp;
}

const TINT_CHROMA = { 50: 0.003, 100: 0.005, 200: 0.008, 300: 0.012, 400: 0.02, 500: 0.024, 600: 0.022, 700: 0.02, 800: 0.016, 900: 0.014, 950: 0.012 };

/** The 13-step neutral: 0 (white), the 11 steps, 1000 (black). */
export function neutralRamp(kind, seed) {
  if (kind !== 'brand') return { 0: '#ffffff', ...NEUTRAL_RAMPS[kind], 1000: '#000000' };
  // Brand-tinted: zinc's lightness, a whisper of the brand hue (more in the mid steps, as slate does).
  const [, Cs, Hs] = hexToOklchParts(seed);
  const strength = Math.min(1, Cs / 0.12);
  const ramp = { 0: '#ffffff' };
  for (const s of STEPS) {
    const [L] = hexToOklchParts(NEUTRAL_RAMPS.zinc[s]);
    ramp[s] = toGamutHex([L, TINT_CHROMA[s] * strength, Hs]);
  }
  ramp[1000] = '#000000';
  return ramp;
}
