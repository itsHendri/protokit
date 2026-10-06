/**
 * Tailwind 4 / shadcn web (v4 shape): oklch variables in `:root` and `.dark`, the `@theme inline`
 * mapping that turns them into utilities, and shadcn's base layer. A partial, not a full stylesheet:
 *   app/globals.css →  @import "tailwindcss";  @import "./tokens.css";
 * Same tokens, same contrast gate as the native CSS; colours are converted with a round-trip check.
 *   options: { out: 'tokens/generated/web.css' }
 */
import { hexToOklch } from '../lib/color.mjs';
import { radiusCalc } from '../lib/resolve.mjs';

export default function shadcnWeb(ctx, options) {
  const vars = (mode) => ctx.colors.map((c) => `  --${c.name}: ${hexToOklch(c[mode])};`).join('\n');
  const contents = `/* ${ctx.header} */
@custom-variant dark (&:is(.dark *));

:root {
  --radius: ${ctx.radius.base / 16}rem;
${vars('light')}
}

.dark {
${vars('dark')}
}

@theme inline {
${ctx.radius.steps.map((s) => `  --radius-${s.name}: ${radiusCalc(s.offset)};`).join('\n')}
${ctx.colors.map((c) => `  --color-${c.name}: var(--${c.name});`).join('\n')}
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
  return [{ path: options.out, contents }];
}
