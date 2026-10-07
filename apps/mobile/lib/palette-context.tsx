import { NAV_THEME, THEME, type ThemeColorName } from '@/lib/theme';
import { useKitTheme, type ColorScheme } from '@/lib/theme-context';
import type { Theme } from 'expo-router/react-navigation';
import * as React from 'react';

/**
 * Semantic colours as hex for the current scheme: the ones a className cannot reach (SVG fills, chart
 * strokes, the navigation theme). Read them with `usePalette()`, never `THEME[scheme]`, so an override
 * reaches every consumer.
 *
 * The values default to the generated THEME (tokens/tokens.json). An override replaces some or all of
 * them at runtime; only the docs site's theme picker sets one, in an embedded session (lib/embed.ts).
 * The CSS variables behind the classNames are overridden separately, so both stay in step.
 */
export type Palette = Record<ThemeColorName, string>;
export type PaletteOverride = Partial<Record<ColorScheme, Partial<Palette>>>;

type PaletteContextValue = {
  palette: Palette;
  setOverride: (override: PaletteOverride | null) => void;
};

const PaletteContext = React.createContext<PaletteContextValue | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const { scheme } = useKitTheme();
  const [override, setOverride] = React.useState<PaletteOverride | null>(null);
  const palette = React.useMemo<Palette>(
    () => ({ ...THEME[scheme], ...override?.[scheme] }),
    [scheme, override]
  );
  const value = React.useMemo(() => ({ palette, setOverride }), [palette]);
  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>;
}

function usePaletteContext(): PaletteContextValue {
  const ctx = React.useContext(PaletteContext);
  if (!ctx) throw new Error('usePalette must be used inside <PaletteProvider>');
  return ctx;
}

/** Semantic colours as hex for the scheme on screen, override included. */
export function usePalette(): Palette {
  return usePaletteContext().palette;
}

/** Replace the runtime override (null clears it). */
export function useSetPaletteOverride(): PaletteContextValue['setOverride'] {
  return usePaletteContext().setOverride;
}

/** The React Navigation theme, built from the palette so headers and tab bars follow an override. */
export function useNavTheme(): Theme {
  const { scheme } = useKitTheme();
  const palette = usePalette();
  return React.useMemo(
    () => ({
      ...NAV_THEME[scheme],
      colors: {
        background: palette.background,
        border: palette.border,
        card: palette.card,
        notification: palette.destructive,
        primary: palette.primary,
        text: palette.foreground,
      },
    }),
    [scheme, palette]
  );
}
