/**
 * A generated theme as CSS variables, in the format each app's build writes them, so a live override
 * matches what `tokens:build` would produce:
 *   'hsl'    NativeWind 4 / shadcn v3 triplets (`221.2 83.2% 53.3%`) — the mobile kit
 *   'oklch'  Tailwind 4 / shadcn web (`oklch(0.546 0.2152 262.88)`) — the web kit and the docs site
 */
import { hexToHslTriplet, hexToOklch } from '../color.mjs';
import { shadowCss } from './recipe.mjs';

export const rem = (px) => (px >= 9999 ? '9999px' : `${px / 16}rem`);

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** { light: { '--primary': '…', '--radius': '0.625rem' }, dark: { … } } */
export function themeVars(theme, format) {
  const convert = format === 'hsl' ? hexToHslTriplet : hexToOklch;
  const mode = (m) => {
    const vars = Object.fromEntries(Object.entries(theme.resolved[m]).map(([name, hex]) => [`--${name}`, convert(hex)]));
    if (m === 'light') {
      vars['--radius'] = rem(theme.radius);
      vars['--radius-control'] = rem(theme.radiusControl);
      vars['--border-width'] = `${theme.borderWidth}px`;
      vars['--icon-stroke'] = String(theme.stroke);
      vars['--density'] = String(theme.density.scale);
      for (const size of ['sm', 'md', 'lg', 'x']) vars[`--control-${size}`] = `${theme.density[size]}px`;
    }
    for (const [level, value] of Object.entries(theme.semantic.shadow)) vars[`--shadow-${level}`] = shadowCss(value[m]);
    return vars;
  };
  return { light: mode('light'), dark: mode('dark') };
}

/** { light: { primary: '#…', primaryForeground: '#…' }, dark: { … } } — the shape of the kit's THEME. */
export function themeHex(theme) {
  const mode = (m) => Object.fromEntries(Object.entries(theme.resolved[m]).map(([name, hex]) => [camel(name), hex]));
  return { light: mode('light'), dark: mode('dark') };
}

/** A stylesheet that applies the theme: `:root { … } <dark> { … }`. */
export function themeCss(theme, { format = 'oklch', light = ':root', dark = '.dark' } = {}) {
  const vars = themeVars(theme, format);
  const block = (selector, map) => `${selector} {\n${Object.entries(map).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;
  return `${block(light, vars.light)}\n${block(dark, vars.dark)}\n`;
}
