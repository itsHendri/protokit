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
/** px; hairline renders as one device pixel on a 2x screen. */
export const BORDER = { hairline: 0.5, regular: 1, heavy: 2 };

const s = (x, y, blur, spread, color) => ({ offsetX: x, offsetY: y, blur, spread, color });
/**
 * Three elevation levels per depth (DTCG shadow values, light and dark): 1 for controls and cards,
 * 2 for raised cards and popovers, 3 for menus, dialogs and floating buttons. An empty list is no shadow.
 * Flat keeps a faint level 3 so a menu still separates from the page.
 */
export const DEPTH = {
  flat: {
    1: { light: [], dark: [] },
    2: { light: [], dark: [] },
    3: { light: [s(0, 4, 12, 0, '#0000001a')], dark: [s(0, 4, 12, 0, '#00000066')] },
  },
  soft: {
    1: { light: [s(0, 1, 2, 0, '#0000000d')], dark: [s(0, 1, 2, 0, '#0000004d')] },
    2: { light: [s(0, 4, 12, -2, '#00000014')], dark: [s(0, 4, 12, -2, '#00000066')] },
    3: { light: [s(0, 12, 24, -6, '#0000001f')], dark: [s(0, 12, 24, -6, '#00000080')] },
  },
  raised: {
    1: { light: [s(0, 2, 8, -2, '#0000001f')], dark: [s(0, 2, 8, -2, '#00000066')] },
    2: { light: [s(0, 8, 20, -6, '#0000002e')], dark: [s(0, 8, 20, -6, '#00000080')] },
    3: { light: [s(0, 20, 40, -10, '#00000040')], dark: [s(0, 20, 40, -10, '#00000099')] },
  },
  hard: {
    1: { light: [s(2, 2, 0, 0, '#09090b')], dark: [s(2, 2, 0, 0, '#fafafa')] },
    2: { light: [s(3, 3, 0, 0, '#09090b')], dark: [s(3, 3, 0, 0, '#fafafa')] },
    3: { light: [s(5, 5, 0, 0, '#09090b')], dark: [s(5, 5, 0, 0, '#fafafa')] },
  },
};

/** A DTCG shadow list as CSS. */
export const shadowCss = (list) =>
  list.length ? list.map((x) => `${x.offsetX}px ${x.offsetY}px ${x.blur}px ${x.spread}px ${hexAlphaToRgba(x.color)}`).join(', ') : '0 0 #0000';

function hexAlphaToRgba(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  const a = hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Number(a.toFixed(3))})`;
}

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
