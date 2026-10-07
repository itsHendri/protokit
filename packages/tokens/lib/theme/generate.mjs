/**
 * generateTheme — a recipe expanded into a theme. Pure ESM, no Node APIs: the docs site runs it in
 * the browser for the live picker, the CLI runs it to commit a theme into tokens.json.
 *
 *   generateTheme(recipe, base)  base = the app's tokens.json (status ramps, radius steps come from it)
 *     → { recipe, code, primitives, semantic, resolved, radius, adjustments }
 *
 * Status colours (success, warning, danger, info) are not themed in v1; they come from `base`.
 */
import { fixContrast } from './fix.mjs';
import { encodeRecipe } from './codec.mjs';
import { fontById } from './fonts.mjs';
import { BORDER, DENSITY, DEPTH, normalizeRecipe, RADIUS, STROKE } from './recipe.mjs';
import { anchorStep, brandRamp, neutralRamp } from './ramp.mjs';
import { resolvedMap } from './refs.mjs';
import { semanticColors } from './semantic.mjs';


const ramp = (values) => Object.fromEntries(Object.entries(values).map(([step, $value]) => [step, { $type: 'color', $value }]));

/** The theme for a recipe, on top of `base` (a tokens.json object). `fix: false` skips the contrast fixer. */
export function generateTheme(input, base, { fix = true } = {}) {
  const recipe = normalizeRecipe(input);
  const brand = brandRamp(recipe.brand);
  const neutral = neutralRamp(recipe.neutral, recipe.brand);

  // Primitive lookup: the base primitives with this theme's ramps swapped in.
  const primitive = { ...base.primitive, color: { ...base.primitive.color, brand: ramp(brand), neutral: ramp(neutral) } };
  const prim = resolvedMap({ primitive }, 'light');
  const lookup = (value) => {
    if (typeof value !== 'string' || !value.startsWith('{')) return value;
    const hex = prim[value.slice(1, -1)];
    if (hex === undefined) throw new Error(`generateTheme: ${value} is not in the base tokens`);
    return hex;
  };

  let colors = semanticColors(anchorStep(recipe.brand));
  let adjustments = [];
  if (fix) ({ semantic: colors, adjustments } = fixContrast(colors, lookup));

  const radiusRef = RADIUS[recipe.radius];
  const radiusValue = typeof radiusRef === 'string' ? `{primitive.radius.${radiusRef}}` : radiusRef;
  const resolved = Object.fromEntries(
    ['light', 'dark'].map((mode) => [mode, Object.fromEntries(Object.entries(colors).map(([name, v]) => [name, lookup(v[mode])]))])
  );

  const radius = lookup(radiusValue);
  const controlRadius = recipe.controls === 'pill' ? 9999 : radiusValue;
  const font = (id) => (id === 'system' ? '' : fontById(id).family);
  const density = DENSITY[recipe.density];

  return {
    recipe,
    code: encodeRecipe(recipe),
    primitives: { brand, neutral },
    fonts: { heading: font(recipe.font.heading), body: font(recipe.font.body) },
    semantic: {
      color: colors,
      radius: { base: radiusValue, control: controlRadius },
      border: { width: BORDER[recipe.border] },
      icon: { stroke: STROKE[recipe.stroke] },
      shadow: DEPTH[recipe.depth],
      density: { scale: density.scale, control: { sm: density.sm, md: density.md, lg: density.lg, x: density.x } },
    },
    density,
    resolved,
    radius,
    radiusControl: lookup(controlRadius),
    borderWidth: BORDER[recipe.border],
    stroke: STROKE[recipe.stroke],
    adjustments,
  };
}
