/**
 * A theme RECIPE: the handful of choices a theme is made from. The generator (index.mjs) expands it
 * into primitives, semantic tokens and CSS variables; the codec (codec.mjs) packs it into a short code.
 *
 * Every option list is APPEND-ONLY: codes store an option's index. Add new options at the end.
 */
import { FONTS } from './fonts.mjs';

export const RECIPE_VERSION = 1;

export const OPTIONS = {
  /** The neutral ramp: four curated greys plus one tinted with the brand hue. */
  neutral: ['zinc', 'neutral', 'slate', 'stone', 'gray', 'brand'],
  /** Base corner radius (px). Tailwind's rounded-sm…2xl are offsets from it. */
  radius: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
  /** Controls (buttons, inputs, chips) follow the radius, or are pills. */
  controls: ['pill', 'match'],
  /** Lucide stroke width. */
  stroke: ['regular', 'thin', 'bold'],
  /** Elevation of cards, sheets and menus. */
  depth: ['soft', 'flat', 'raised', 'hard'],
  /** Control heights and padding. */
  density: ['comfortable', 'compact', 'spacious'],
  /** Border width of cards, inputs and outlines. */
  border: ['regular', 'hairline', 'heavy'],
};

/** Base radius per option: a primitive radius step (a reference) or 0. */
export const RADIUS = { none: 0, sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', '2xl': '2xl' };
export const STROKE = { thin: 1.5, regular: 2, bold: 2.5 };
export const BORDER = { hairline: 0, regular: 1, heavy: 2 };
/** Control heights (sm / md / lg) and horizontal padding per density. */
export const DENSITY = {
  compact: { sm: 36, md: 44, lg: 52, x: 16 },
  comfortable: { sm: 40, md: 48, lg: 56, x: 20 },
  spacious: { sm: 44, md: 52, lg: 60, x: 24 },
};

export const DEFAULT_RECIPE = Object.freeze({
  v: RECIPE_VERSION,
  brand: '#2563eb',
  neutral: 'zinc',
  radius: 'lg',
  controls: 'pill',
  font: Object.freeze({ heading: 'system', body: 'system' }),
  stroke: 'regular',
  depth: 'soft',
  density: 'comfortable',
  border: 'regular',
});

const HEX = /^#[0-9a-f]{6}$/;

/** Fill in defaults, normalise, and throw on anything invalid. Returns a new, plain recipe. */
export function normalizeRecipe(input = {}) {
  const r = { ...DEFAULT_RECIPE, ...input, font: { ...DEFAULT_RECIPE.font, ...input.font } };
  r.v = RECIPE_VERSION;
  r.brand = String(r.brand).toLowerCase();
  if (!HEX.test(r.brand)) throw new Error(`Recipe brand must be a 6-digit hex colour, got "${input.brand}"`);
  for (const [key, list] of Object.entries(OPTIONS)) {
    if (!list.includes(r[key])) throw new Error(`Recipe ${key} must be one of ${list.join(', ')}; got "${r[key]}"`);
  }
  for (const role of ['heading', 'body']) {
    if (!FONTS.some((f) => f.id === r.font[role])) throw new Error(`Unknown ${role} font "${r.font[role]}"`);
  }
  const out = { v: r.v, brand: r.brand, neutral: r.neutral, radius: r.radius, controls: r.controls, font: { heading: r.font.heading, body: r.font.body }, stroke: r.stroke, depth: r.depth, density: r.density, border: r.border };
  if (input.preset) out.preset = String(input.preset);
  return out;
}

/** Same theme? (ignores the preset label) */
export function sameRecipe(a, b) {
  const strip = ({ preset, ...rest }) => rest;
  return JSON.stringify(strip(normalizeRecipe(a))) === JSON.stringify(strip(normalizeRecipe(b)));
}
