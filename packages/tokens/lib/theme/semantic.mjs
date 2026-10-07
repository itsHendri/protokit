/**
 * The semantic colour map a theme writes: shadcn names (plus success/warning/info) → primitive
 * references per mode. With a curated seed this is exactly the kit's original map; a generated seed
 * moves the brand steps to wherever the seed landed (its anchor).
 */
const n = (step) => `{primitive.color.neutral.${step}}`;
const b = (step) => `{primitive.color.brand.${step}}`;
const p = (ramp, step) => `{primitive.color.${ramp}.${step}}`;

/** The brand step for dark mode: light seeds stay, darker ones lift so they read on a dark page. */
const DARK_STEP = { 600: '500', 700: '400', 800: '300', 900: '200', 950: '100' };
export const darkStep = (anchor) => DARK_STEP[anchor] ?? anchor;

/** { name: { light: ref, dark: ref } } in the order the kit's tokens.json lists them. */
export function semanticColors(anchor = '600') {
  const brand = { light: b(anchor), dark: b(darkStep(anchor)) };
  const onDark = { light: n(0), dark: n(950) };
  return {
    background: { light: n(0), dark: n(950) },
    foreground: { light: n(950), dark: n(50) },
    card: { light: n(0), dark: n(900) },
    'card-foreground': { light: n(950), dark: n(50) },
    popover: { light: n(0), dark: n(900) },
    'popover-foreground': { light: n(950), dark: n(50) },
    primary: brand,
    'primary-foreground': onDark,
    secondary: { light: n(100), dark: n(800) },
    'secondary-foreground': { light: n(900), dark: n(50) },
    muted: { light: n(100), dark: n(800) },
    'muted-foreground': { light: n(600), dark: n(400) },
    accent: { light: n(100), dark: n(800) },
    'accent-foreground': { light: n(900), dark: n(50) },
    destructive: { light: p('danger', 600), dark: p('danger', 500) },
    'destructive-foreground': onDark,
    success: { light: p('success', 700), dark: p('success', 500) },
    'success-foreground': onDark,
    warning: { light: p('warning', 700), dark: p('warning', 400) },
    'warning-foreground': onDark,
    info: { light: p('info', 700), dark: p('info', 500) },
    'info-foreground': onDark,
    border: { light: n(200), dark: n(800) },
    input: { light: n(200), dark: n(800) },
    ring: brand,
    sidebar: { light: n(50), dark: n(900) },
    'sidebar-foreground': { light: n(950), dark: n(50) },
    'sidebar-primary': brand,
    'sidebar-primary-foreground': onDark,
    'sidebar-accent': { light: n(100), dark: n(800) },
    'sidebar-accent-foreground': { light: n(900), dark: n(50) },
    'sidebar-border': { light: n(200), dark: n(800) },
    'sidebar-ring': brand,
    'chart-1': { light: b(500), dark: b(400) },
    'chart-2': { light: p('success', 500), dark: p('success', 400) },
    'chart-3': { light: p('warning', 500), dark: p('warning', 400) },
    'chart-4': { light: p('danger', 500), dark: p('danger', 400) },
    'chart-5': { light: p('info', 500), dark: p('info', 400) },
  };
}

/** Tokens that share the brand step; when the fixer moves `primary`, these move with it. */
export const BRAND_LINKED = ['ring', 'sidebar-primary', 'sidebar-ring'];

/** The neutral steps a foreground can flip between. */
export const FOREGROUND_CHOICES = [n(0), n(950)];
