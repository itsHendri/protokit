/**
 * NativeWind 4 / Tailwind 3 (shadcn v3 shape): bare HSL triplets in `:root` and `.dark:root`, plus the
 * colour + radius maps tailwind.config.js spreads in.
 *   options: { css: 'global.css', tailwind: 'tokens/generated/tailwind.theme.js' }
 */
import { hexToHslTriplet } from '../lib/color.mjs';
import { cssName, isColor, radiusCalc } from '../lib/resolve.mjs';

function cssBlock(selector, tokens) {
  const lines = tokens.map((t) => {
    const name = cssName(t);
    if (isColor(t)) return `    --${name}: ${hexToHslTriplet(t.$value)};`;
    if (name === 'radius') return `    --${name}: ${t.$value / 16}rem;`;
    return `    --${name}: ${t.$value};`;
  });
  return `  ${selector} {\n${lines.join('\n')}\n  }`;
}

export default function nativewind3(ctx, options) {
  const css = `/* ${ctx.header} */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
${cssBlock(':root', ctx.semLight)}

${cssBlock('.dark:root', ctx.semDark)}
}
`;
  const colors = Object.fromEntries(ctx.colors.map((c) => [c.name, `hsl(var(--${c.name}))`]));
  const borderRadius = Object.fromEntries(ctx.radius.steps.map((s) => [s.name, radiusCalc(s.offset)]));
  const tailwind = `// ${ctx.header}\nmodule.exports = ${JSON.stringify({ colors, borderRadius }, null, 2)};\n`;
  return [
    { path: options.css, contents: css },
    { path: options.tailwind, contents: tailwind },
  ];
}
