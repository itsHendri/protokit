/**
 * Load tokens.json and resolve it once per mode. Style Dictionary resolves {references}; this file
 * handles the light/dark split (a semantic colour's $value is { light, dark }) and hands every
 * target the same context object.
 */
import StyleDictionary from 'style-dictionary';
import { readFileSync } from 'node:fs';

export const MODES = ['light', 'dark'];

function isModed(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && MODES.every((m) => m in value);
}

/** Return a copy of the token tree with every { light, dark } value collapsed to one mode. */
function forMode(node, mode) {
  if (Array.isArray(node) || node === null || typeof node !== 'object') return node;
  if ('$value' in node) return { ...node, $value: isModed(node.$value) ? node.$value[mode] : node.$value };
  return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, forMode(v, mode)]));
}

async function resolveMode(source, mode) {
  const sd = new StyleDictionary({
    tokens: forMode(source, mode),
    usesDtcg: true,
    log: { verbosity: 'silent' },
    platforms: { kit: { transforms: [] } },
  });
  await sd.hasInitialized;
  const { allTokens } = await sd.getPlatformTokens('kit');
  return allTokens;
}

export const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
export const isColor = (t) => t.$type === 'color';

/** CSS variable name for a semantic token: semantic.color.card-foreground → card-foreground, semantic.radius.base → radius */
export function cssName(token) {
  const parts = token.path.slice(1).filter((p) => p !== 'color');
  if (parts.at(-1) === 'base') parts.pop();
  return parts.join('-');
}

/**
 * Tailwind radius classes as offsets from primitive.radius.lg. With the default base every class
 * equals its primitive (rounded-xl = radius.xl); moving semantic.radius.base shifts the whole scale.
 */
function radiusOffsets(prim) {
  const steps = prim.filter((t) => t.path[1] === 'radius' && t.path.length === 3 && t.path[2] !== 'full');
  const anchor = steps.find((t) => t.path[2] === 'lg').$value;
  return steps.map((t) => ({ name: t.path[2], offset: t.$value - anchor }));
}

export function radiusCalc(offset) {
  return offset === 0 ? 'var(--radius)' : `calc(var(--radius) ${offset < 0 ? '-' : '+'} ${Math.abs(offset)}px)`;
}

/**
 * Everything a target needs:
 *   semLight / semDark   semantic tokens per mode (colours + radius), in tokens.json order
 *   prim                 primitive tokens (mode-independent)
 *   colors               [{ name, light, dark }] semantic colours as hex
 *   radius               { base: px, steps: [{ name, offset }] }
 */
export async function loadTokens(sourcePath) {
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const [light, dark] = await Promise.all(MODES.map((m) => resolveMode(source, m)));
  const semLight = light.filter((t) => t.path[0] === 'semantic');
  const semDark = dark.filter((t) => t.path[0] === 'semantic');
  const prim = light.filter((t) => t.path[0] === 'primitive');
  const darkHex = Object.fromEntries(semDark.filter(isColor).map((t) => [cssName(t), t.$value.toLowerCase()]));
  const colors = semLight
    .filter(isColor)
    .map((t) => ({ name: cssName(t), light: t.$value.toLowerCase(), dark: darkHex[cssName(t)] }));
  const radius = {
    base: semLight.find((t) => cssName(t) === 'radius').$value,
    steps: radiusOffsets(prim),
  };
  return { source, semLight, semDark, prim, colors, radius };
}

/** Primitive tokens under a path prefix, e.g. group(prim, ['font', 'size']) → [{ key: 'xs', value: 12 }, …]. */
export function group(prim, prefix) {
  return prim
    .filter((t) => t.path.slice(1, 1 + prefix.length).join('.') === prefix.join('.'))
    .map((t) => ({ key: t.path.slice(1 + prefix.length).join('-'), value: t.$value, type: t.$type }));
}
