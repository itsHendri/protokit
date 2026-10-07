/**
 * Commit a theme into a tokens.json object. Only the paths a theme owns are written; everything else
 * (status ramps, spacing, type sizes, motion, descriptions) is left exactly as it was. The recipe is
 * recorded under `$extensions["dev.protokit.theme"]`, so the docs picker and `kit-tokens theme show`
 * can tell which theme is applied, and whether anyone has hand-edited it since (drift).
 */
import { generateTheme } from './generate.mjs';
import { flatten } from './refs.mjs';

export const THEME_EXTENSION = 'dev.protokit.theme';

const clone = (value) => JSON.parse(JSON.stringify(value));

/** The values a theme owns, as { 'path.to.token': $value }. */
function ownedValues(theme) {
  const out = {};
  for (const [group, ramp] of Object.entries(theme.primitives)) {
    for (const [step, hex] of Object.entries(ramp)) out[`primitive.color.${group}.${step}`] = hex;
  }
  for (const [name, value] of Object.entries(theme.semantic.color)) out[`semantic.color.${name}`] = value;
  out['semantic.radius.base'] = theme.semantic.radius.base;
  return out;
}

function setPath(root, path, $value, $type) {
  let node = root;
  const keys = path.split('.');
  for (const key of keys.slice(0, -1)) node = node[key] ??= {};
  const leaf = keys.at(-1);
  if (node[leaf] && typeof node[leaf] === 'object' && '$value' in node[leaf]) node[leaf].$value = $value;
  else node[leaf] = { $type, $value };
}

/** → { tokens, theme }. `tokens` is a new object; the input is not touched. */
export function applyRecipe(tokens, recipe) {
  const theme = generateTheme(recipe, tokens);
  const out = clone(tokens);
  for (const [path, value] of Object.entries(ownedValues(theme))) {
    setPath(out, path, value, path.startsWith('semantic.radius') ? 'number' : 'color');
  }
  const { $extensions = {}, ...rest } = out;
  const record = { version: theme.recipe.v, code: theme.code, recipe: theme.recipe };
  if (theme.adjustments.length) record.adjustments = theme.adjustments;
  return { tokens: { ...rest, $extensions: { ...$extensions, [THEME_EXTENSION]: record } }, theme };
}

/**
 * What theme a tokens.json carries:
 *   { applied: false }                               no theme recorded
 *   { applied: true, code, recipe, drift: [paths] }  drift = owned paths edited since the theme was applied
 */
export function themeStatus(tokens) {
  const record = tokens.$extensions?.[THEME_EXTENSION];
  if (!record?.recipe) return { applied: false };
  const expected = ownedValues(generateTheme(record.recipe, tokens));
  const actual = Object.fromEntries(flatten(tokens).map((t) => [t.path.join('.'), t.$value]));
  const drift = Object.entries(expected)
    .filter(([path, value]) => JSON.stringify(actual[path]) !== JSON.stringify(value))
    .map(([path]) => path);
  return { applied: true, code: record.code, recipe: record.recipe, drift };
}
