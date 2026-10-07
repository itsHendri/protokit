/**
 * A small DTCG reference resolver that runs anywhere (browser included). The build resolves with Style
 * Dictionary (lib/resolve.mjs, Node only); the theme generator and the docs site's live picker use this
 * one, and a test holds the two to the same answer on the real tokens.json.
 *
 * resolveTree(source, mode) → [{ path: ['semantic','color','primary'], $type, $value }] in source order,
 * with every { light, dark } value collapsed to `mode` and every "{a.b.c}" reference followed.
 */
export const MODES = ['light', 'dark'];

export const isModed = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && MODES.every((m) => m in value);

const REF = /^\{([^{}]+)\}$/;

/** Flatten a token tree: [{ path, $type, $value }] for every node with a $value, in order. */
export function flatten(node, path = []) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return [];
  if ('$value' in node) return [{ path, $type: node.$type, $value: node.$value }];
  return Object.entries(node)
    .filter(([key]) => !key.startsWith('$'))
    .flatMap(([key, child]) => flatten(child, [...path, key]));
}

export function resolveTree(source, mode) {
  const tokens = flatten(source);
  const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]));
  const value = (t) => (isModed(t.$value) ? t.$value[mode] : t.$value);

  const resolve = (raw, seen) => {
    const m = typeof raw === 'string' ? REF.exec(raw) : null;
    if (!m) return raw;
    const target = byPath.get(m[1]);
    if (!target) throw new Error(`Unresolved reference ${raw}`);
    if (seen.has(m[1])) throw new Error(`Circular reference ${[...seen, m[1]].join(' → ')}`);
    return resolve(value(target), new Set([...seen, m[1]]));
  };

  return tokens.map((t) => ({ ...t, $value: resolve(value(t), new Set([t.path.join('.')])) }));
}

/** { 'semantic.color.primary': '#2563eb', … } for one mode. */
export function resolvedMap(source, mode) {
  return Object.fromEntries(resolveTree(source, mode).map((t) => [t.path.join('.'), t.$value]));
}
