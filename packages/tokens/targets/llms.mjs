/**
 * The tokens section of llms.txt: a compact Markdown fragment that registry-build stitches into the
 * app's llms.txt (and the docs site into /llms.txt).
 *   options: { out: 'tokens/generated/llms-tokens.md' }
 */
import { group } from '../lib/resolve.mjs';
import { AA } from '../lib/contrast.mjs';

export default function llms(ctx, options) {
  const rows = ctx.colors.map((c) => `| \`${c.name}\` | ${c.light} | ${c.dark} |`).join('\n');
  const steps = (prefix, unit = 'px') =>
    group(ctx.prim, prefix)
      .map((t) => `${t.key} ${t.value}${unit}`)
      .join(' · ');
  const contents = `<!-- ${ctx.header} -->
## Tokens

Colours are semantic names only, used as Tailwind classes (\`bg-primary\`, \`text-muted-foreground\`,
\`border-border\`, \`bg-success/15\`). Never hex, never Tailwind palette colours. Both themes are
required; every fill/foreground pairing clears WCAG AA (${AA}:1), enforced by \`npm run tokens:build\`.

| Name | Light | Dark |
|---|---|---|
${rows}

- Spacing (4-pt grid, Tailwind numeric scale): ${steps(['space'])}
- Radius (\`rounded-*\`): ${steps(['radius'])}; base \`--radius\` = ${ctx.radius.base}px
- Font sizes (\`text-*\`): ${steps(['font', 'size'])}
- Durations: ${steps(['duration'], 'ms')}
`;
  return [{ path: options.out, contents }];
}
