/**
 * Tailwind 4 / shadcn web (v4 shape): oklch variables in `:root` and `.dark`, the `@theme inline`
 * mapping that turns them into utilities, and shadcn's base layer. A partial, not a full stylesheet:
 *   app/globals.css →  @import "tailwindcss";  @import "./tokens.css";
 * Same tokens, same contrast gate as the native CSS; colours are converted with a round-trip check.
 *   options: { out: 'tokens/generated/web.css' }
 */
import { hexToOklch } from '../lib/color.mjs';
import { radiusCalc } from '../lib/resolve.mjs';

const rem = (px) => (px >= 9999 ? '9999px' : `${px / 16}rem`);
const SYSTEM_SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";

export default function shadcnWeb(ctx, options) {
  const vars = (mode) => ctx.colors.map((c) => `  --${c.name}: ${hexToOklch(c[mode])};`).join('\n');
  const shadows = (mode) => Object.entries(ctx.shape.shadows[mode]).map(([level, css]) => `  --shadow-${level}: ${css};`).join('\n');
  const contents = `/* ${ctx.header} */
@custom-variant dark (&:is(.dark *));

:root {
  --radius: ${rem(ctx.radius.base)};
  --radius-control: ${rem(ctx.shape.control)};
  --border-width: ${ctx.shape.borderWidth}px;
  --icon-stroke: ${ctx.shape.stroke};${options.density === false ? '' : `\n  --density: ${ctx.shape.density.scale};`}
${shadows('light')}
${vars('light')}
}

.dark {
${shadows('dark')}
${vars('dark')}
}

@theme inline {
${ctx.radius.steps.map((s) => `  --radius-${s.name}: ${radiusCalc(s.scale)};`).join('\n')}
  --radius-control: var(--radius-control);
  --default-border-width: var(--border-width);${options.density === false ? '' : `\n  /* The theme's density scales the whole spacing scale (p-4, gap-2, h-9…). */\n  --spacing: calc(0.25rem * var(--density));`}
  --shadow-2xs: var(--shadow-1);
  --shadow-xs: var(--shadow-1);
  --shadow-sm: var(--shadow-1);
  --shadow-md: var(--shadow-2);
  --shadow-lg: var(--shadow-3);
  --shadow-xl: var(--shadow-3);
  --shadow-2xl: var(--shadow-3);
  --font-sans: var(--kit-font-body, ${SYSTEM_SANS});
  --font-heading: var(--kit-font-heading, var(--kit-font-body, ${SYSTEM_SANS}));
${ctx.colors.map((c) => `  --color-${c.name}: var(--${c.name});`).join('\n')}
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  /* The theme's heading font (--kit-font-heading, set by app/fonts.ts or a live theme). */
  h1, h2, h3, h4, [data-slot='card-title'] {
    font-family: var(--font-heading);
  }
  /* Lucide icons take the theme's stroke. */
  svg.lucide {
    stroke-width: var(--icon-stroke);
  }
}
`;
  return [{ path: options.out, contents }];
}
