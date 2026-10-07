import { FONT_FAMILY } from '@/lib/fonts';
import { useLiveFonts } from '@/lib/palette-context';
import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-center text-4xl font-extrabold tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' })
        ),
        h2: cn(
          'text-3xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20 first:mt-0' })
        ),
        h3: cn('text-2xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h4: cn('text-xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        p: 'mt-3 leading-7 sm:mt-6',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
        ),
        lead: 'text-muted-foreground text-xl',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-muted-foreground text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

const WEIGHT: Record<string, number> = {
  'font-thin': 100,
  'font-extralight': 200,
  'font-light': 300,
  'font-normal': 400,
  'font-medium': 500,
  'font-semibold': 600,
  'font-bold': 700,
  'font-extrabold': 800,
  'font-black': 900,
};
const HEADINGS = new Set<TextVariant>(['h1', 'h2', 'h3', 'h4']);
const SYSTEM_STACK = 'ui-sans-serif, system-ui, -apple-system, sans-serif';

/**
 * The theme's font for this text (lib/fonts.ts). Headings (h1–h4, or a `font-heading` class) take the
 * heading font, everything else the body font; `font-mono` keeps the mono font. A custom font is one
 * family per weight on native (Android ignores fontWeight for it), so the weight in the classes picks the
 * family and fontWeight is reset. A live theme from the docs picker (web only) uses its Google font.
 */
function useFontStyle(classes: string, variant: TextVariant = 'default') {
  const live = useLiveFonts();
  if (/(^|\s)font-mono(\s|$)/.test(classes)) return undefined;
  const role = HEADINGS.has(variant) || /(^|\s)font-heading(\s|$)/.test(classes) ? 'heading' : 'body';
  const families = FONT_FAMILY[role];
  if (live) {
    // A live theme decides every role: its font, or the system font over a committed custom one.
    const family = live[role];
    if (family) return { fontFamily: `"${family}", ${SYSTEM_STACK}` };
    return families ? { fontFamily: SYSTEM_STACK } : undefined;
  }
  if (!families) return undefined;
  const weight = classes.split(/\s+/).reduce((w, c) => WEIGHT[c] ?? w, 400);
  const loaded = Object.keys(families).map(Number);
  const nearest = loaded.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), loaded[0]);
  return { fontFamily: families[nearest], fontWeight: 'normal' as const };
}

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  const classes = cn(textVariants({ variant }), textClass, className);
  const font = useFontStyle(classes, variant ?? 'default');
  return (
    <Component
      className={classes}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
      style={font ? [font, props.style] : props.style}
    />
  );
}

export { Text, TextClassContext, useFontStyle };
