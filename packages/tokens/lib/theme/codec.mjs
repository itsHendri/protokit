/**
 * Theme codes: a recipe packed into 60 bits and written as 12 Crockford base32 characters after a
 * `pk1-` prefix, e.g. `pk1-0AW0PT8X4A2Z`. Short enough to read out, paste into a terminal or a URL.
 *
 *   bits  field
 *     4   recipe version (RECIPE_VERSION)
 *    24   brand hex
 *  3+3+1  neutral, radius, controls   (option indexes, recipe.mjs)
 *   5+5   heading, body               (indexes into FONTS, fonts.mjs)
 * 2+2+2+2 stroke, depth, density, border
 *     7   checksum (payload mod 127), so a typo is caught instead of silently making another theme
 *
 * The preset name is not in the code: a code is the theme, whichever preset it started from.
 */
import { FONTS } from './fonts.mjs';
import { normalizeRecipe, OPTIONS, RECIPE_VERSION } from './recipe.mjs';

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const PREFIX = 'pk1-';
const LAYOUT = [
  ['neutral', 3],
  ['radius', 3],
  ['controls', 1],
];
const TAIL = [
  ['stroke', 2],
  ['depth', 2],
  ['density', 2],
  ['border', 2],
];

export function encodeRecipe(input) {
  const r = normalizeRecipe(input);
  let bits = BigInt(r.v);
  const push = (value, width) => {
    if (value < 0 || value >= 2 ** width) throw new Error(`encodeRecipe: ${value} does not fit in ${width} bits`);
    bits = (bits << BigInt(width)) | BigInt(value);
  };
  push(parseInt(r.brand.slice(1), 16), 24);
  for (const [key, width] of LAYOUT) push(OPTIONS[key].indexOf(r[key]), width);
  push(FONTS.findIndex((f) => f.id === r.font.heading), 5);
  push(FONTS.findIndex((f) => f.id === r.font.body), 5);
  for (const [key, width] of TAIL) push(OPTIONS[key].indexOf(r[key]), width);
  bits = (bits << 7n) | (bits % 127n);

  let out = '';
  for (let i = 0; i < 12; i++) {
    out = ALPHABET[Number(bits & 31n)] + out;
    bits >>= 5n;
  }
  return PREFIX + out;
}

/** Code → recipe. Throws on a malformed code, a bad checksum or an unknown version. */
export function decodeRecipe(code) {
  const raw = String(code).trim().toUpperCase().replace(/^PK1-?/, '').replace(/[IL]/g, '1').replace(/O/g, '0').replace(/-/g, '');
  if (!/^[0-9A-HJKMNP-TV-Z]{12}$/.test(raw)) throw new Error(`"${code}" is not a theme code (expected pk1- and 12 characters)`);
  let bits = 0n;
  for (const ch of raw) bits = (bits << 5n) | BigInt(ALPHABET.indexOf(ch));

  const checksum = bits & 127n;
  bits >>= 7n;
  if (bits % 127n !== checksum) throw new Error(`"${code}" has a typo (checksum mismatch)`);

  const pull = (width) => {
    const value = Number(bits & ((1n << BigInt(width)) - 1n));
    bits >>= BigInt(width);
    return value;
  };
  const opt = (key, width) => {
    const value = OPTIONS[key][pull(width)];
    if (value === undefined) throw new Error(`"${code}" has an unknown ${key}`);
    return value;
  };
  const font = (width) => {
    const f = FONTS[pull(width)];
    if (!f) throw new Error(`"${code}" has an unknown font`);
    return f.id;
  };
  // Read back to front.
  const tail = Object.fromEntries([...TAIL].reverse().map(([key, width]) => [key, opt(key, width)]));
  const body = font(5);
  const heading = font(5);
  const head = Object.fromEntries([...LAYOUT].reverse().map(([key, width]) => [key, opt(key, width)]));
  const brand = '#' + pull(24).toString(16).padStart(6, '0');
  const v = Number(bits);
  if (v !== RECIPE_VERSION) throw new Error(`"${code}" is a version ${v} theme; this kit-tokens reads version ${RECIPE_VERSION}. Update @itshendri/kit-tokens.`);
  return normalizeRecipe({ v, brand, ...head, font: { heading, body }, ...tail });
}

export const isThemeCode = (value) => /^pk1-?[0-9a-z]{12}$/i.test(String(value).trim());
