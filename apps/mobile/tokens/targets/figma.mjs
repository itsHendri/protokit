/**
 * Input for push-figma.mjs: semantic colours per mode and the numeric scales with their class names,
 * so Figma Variables carry `var(--primary)` / `p-4` code syntax.
 *   options: { out: 'tokens/generated/figma-theme.mjs' }
 */
import { group } from '../lib/resolve.mjs';

export default function figma(ctx, options) {
  const colors = Object.fromEntries(ctx.colors.map((c) => [c.name, { light: c.light, dark: c.dark }]));
  const num = (prefix, code) =>
    Object.fromEntries(
      group(ctx.prim, prefix)
        .filter((t) => typeof t.value === 'number')
        .map((t) => [t.key, { value: t.value, code: code(t.key) }])
    );
  const numbers = {
    radius: num(['radius'], (k) => `rounded-${k}`),
    space: num(['space'], (k) => `p-${k}`),
    'font-size': num(['font', 'size'], (k) => `text-${k}`),
  };
  const contents = `// ${ctx.header}\nexport const COLORS = ${JSON.stringify(colors, null, 2)};\nexport const NUMBERS = ${JSON.stringify(numbers, null, 2)};\n`;
  return [{ path: options.out, contents }];
}
