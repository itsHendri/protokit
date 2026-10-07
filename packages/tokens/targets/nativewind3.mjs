/**
 * NativeWind 4 / Tailwind 3 (shadcn v3 shape): bare HSL triplets in `:root` and `.dark:root`, plus the
 * colour + radius maps tailwind.config.js spreads in.
 *   options: { css: 'global.css', tailwind: 'tokens/generated/tailwind.theme.js' }
 */
import { hexToHslTriplet } from '../lib/color.mjs';
import { cssName, isColor, radiusCalc } from '../lib/resolve.mjs';

const rem = (px) => (px >= 9999 ? '9999px' : `${px / 16}rem`);

/** Shape variables come from ctx.shape, which has defaults for a token file from before themes. */
const SHAPE = new Set(['radius-control', 'border-width', 'icon-stroke']);

function cssBlock(selector, tokens, shape) {
  const lines = tokens
    // Shadows are literal in tailwind.theme.js: a var() box-shadow drops the view on native.
    .filter((t) => t.$type !== 'shadow' && !SHAPE.has(cssName(t)) && !cssName(t).startsWith('density-'))
    .map((t) => {
      const name = cssName(t);
      if (isColor(t)) return `    --${name}: ${hexToHslTriplet(t.$value)};`;
      if (name === 'radius') return `    --${name}: ${rem(t.$value)};`;
      return `    --${name}: ${t.$value};`;
    });
  if (shape) {
    lines.push(`    --radius-control: ${rem(shape.control)};`, `    --border-width: ${shape.borderWidth}px;`, `    --icon-stroke: ${shape.stroke};`);
    for (const size of ['sm', 'md', 'lg', 'x']) lines.push(`    --control-${size}: ${shape.density[size]}px;`);
  }
  return `  ${selector} {\n${lines.join('\n')}\n  }`;
}

export default function nativewind3(ctx, options) {
  const css = `/* ${ctx.header} */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
${cssBlock(':root', ctx.semLight, ctx.shape)}

${cssBlock('.dark:root', ctx.semDark)}
}
`;
  const colors = Object.fromEntries(ctx.colors.map((c) => [c.name, `hsl(var(--${c.name}))`]));
  const borderRadius = Object.fromEntries(ctx.radius.steps.map((s) => [s.name, radiusCalc(s.scale)]));
  borderRadius.control = 'var(--radius-control)';
  const borderWidth = { DEFAULT: 'var(--border-width)' };
  // The theme's depth takes over Tailwind's shadow scale: 1 = xs/sm/shadow, 2 = md, 3 = lg/xl/2xl. Light
  // values: native can't switch a box-shadow per scheme.
  const s = ctx.shape.shadows.light;
  const boxShadow = { xs: s[1], sm: s[1], DEFAULT: s[1], md: s[2], lg: s[3], xl: s[3], '2xl': s[3] };
  // Density: control heights (h-control-sm / h-control / h-control-lg, and min-h-*) and padding (px-control-x).
  const height = { 'control-sm': 'var(--control-sm)', control: 'var(--control-md)', 'control-lg': 'var(--control-lg)' };
  const spacing = { 'control-x': 'var(--control-x)' };
  const tailwind = `// ${ctx.header}\nmodule.exports = ${JSON.stringify({ colors, borderRadius, borderWidth, boxShadow, height, minHeight: height, width: height, spacing }, null, 2)};\n`;
  return [
    { path: options.css, contents: css },
    { path: options.tailwind, contents: tailwind },
  ];
}
