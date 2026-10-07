/**
 * lib/theme.ts — semantic colours as hex per scheme, non-colour primitives, and (for Expo Router apps)
 * the React Navigation theme.
 *   options: { out: 'lib/theme.ts', navTheme?: 'expo-router/react-navigation' | false }
 */
import { camel, group } from '../lib/resolve.mjs';
import { presetById, sameRecipe, themeStatus } from '../lib/theme/index.mjs';

/** The applied theme, for a read-only summary in the app (Foundations). */
function themeInfo(source) {
  const status = themeStatus(source);
  if (!status.applied) return 'null';
  const preset = presetById(status.recipe.preset ?? '');
  const name = preset && sameRecipe(preset.recipe, status.recipe) ? preset.name : 'Custom';
  return JSON.stringify({ code: status.code, name, edited: status.drift.length > 0, recipe: status.recipe }, null, 2);
}

function colorObject(colors, mode) {
  return colors.map((c) => `    ${camel(c.name)}: '${c[mode]}',`).join('\n');
}

function primitiveGroup(prim, prefix) {
  return group(prim, prefix)
    .map(({ key, value }) => `    ${/^[a-z_$][\w$]*$/i.test(key) ? key : `'${key}'`}: ${JSON.stringify(value)},`)
    .join('\n');
}

const navTheme = (scheme, base) => `  ${scheme}: {
    ...${base},
    colors: {
      background: THEME.${scheme}.background,
      border: THEME.${scheme}.border,
      card: THEME.${scheme}.card,
      notification: THEME.${scheme}.destructive,
      primary: THEME.${scheme}.primary,
      text: THEME.${scheme}.foreground,
    },
  },`;

export default function tsTheme(ctx, options) {
  const nav = options.navTheme;
  const contents = `// ${ctx.header}
${nav ? `import { DarkTheme, DefaultTheme, type Theme } from '${nav}';\n` : ''}
/**
 * Semantic colours as hex, per scheme. Use ONLY where a className cannot reach:
 * SVG fills, chart strokes, canvas, platform props (a StatusBar, gradient stops). Everything
 * else styles with Tailwind classes (bg-primary, text-muted-foreground, …).
 */
export const THEME = {
  light: {
${colorObject(ctx.colors, 'light')}
  },
  dark: {
${colorObject(ctx.colors, 'dark')}
  },
} as const;

export type ThemeColors = typeof THEME.light;
export type ThemeColorName = keyof ThemeColors;

/** Non-colour primitives (px / ms) for the rare inline-style or Reanimated use. */
export const TOKENS = {
  space: {
${primitiveGroup(ctx.prim, ['space'])}
  },
  radius: {
${primitiveGroup(ctx.prim, ['radius'])}
    base: ${ctx.radius.base},
  },
  fontSize: {
${primitiveGroup(ctx.prim, ['font', 'size'])}
  },
  fontFamily: {
${primitiveGroup(ctx.prim, ['font', 'family'])}
  },
  duration: {
${primitiveGroup(ctx.prim, ['duration'])}
  },
  easing: {
${primitiveGroup(ctx.prim, ['easing'])}
  },
} as const;

/** The theme tokens.json was generated from (\`kit-tokens theme apply\`), or null. \`edited\`: theme tokens
 *  were changed by hand since. */
export const THEME_INFO: ThemeInfo | null = ${themeInfo(ctx.source)};

export type ThemeInfo = {
  code: string;
  name: string;
  edited: boolean;
  recipe: {
    v: number;
    brand: string;
    neutral: string;
    radius: string;
    controls: string;
    font: { heading: string; body: string };
    stroke: string;
    depth: string;
    density: string;
    border: string;
    preset?: string;
  };
};
${
  nav
    ? `
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
${navTheme('light', 'DefaultTheme')}
${navTheme('dark', 'DarkTheme')}
};
`
    : ''
}`;
  return [{ path: options.out, contents }];
}
