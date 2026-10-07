import { useEmbedMessage } from '@/lib/embed';
import { applyEmbedTokens, cachedEmbedTokens, parseEmbedTokens, reportApplied, type EmbedTokens } from '@/lib/embed-theme';
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
 * them at runtime; only the docs site's theme picker sets one, in an embedded session (lib/embed-theme.ts),
 * together with the CSS variables behind the classNames, so both stay in step.
 */
export type Palette = Record<ThemeColorName, string>;
export type PaletteOverride = Partial<Record<ColorScheme, Partial<Palette>>>;

const PaletteContext = React.createContext<Palette | null>(null);
/** The code of a live theme from the docs picker, when one is showing (embedded web only). */
const LiveCodeContext = React.createContext<string | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const { scheme } = useKitTheme();
  const [override, setOverride] = React.useState<PaletteOverride | null>(() => cachedEmbedTokens()?.hex ?? null);
  const [liveCode, setLiveCode] = React.useState<string | null>(() => cachedEmbedTokens()?.code ?? null);

  // The docs picker's live theme (web export in a phone frame only).
  const onTokens = React.useCallback((data: unknown, origin: string) => {
    const tokens: EmbedTokens | null = parseEmbedTokens(data);
    if (!tokens) return;
    applyEmbedTokens(tokens);
    setOverride(tokens.code === null ? null : (tokens.hex ?? null));
    setLiveCode(tokens.code);
    reportApplied(tokens.code, origin);
  }, []);
  useEmbedMessage('kit:tokens', onTokens);

  const palette = React.useMemo<Palette>(
    () => ({ ...THEME[scheme], ...override?.[scheme] }),
    [scheme, override]
  );
  return (
    <PaletteContext.Provider value={palette}>
      <LiveCodeContext.Provider value={liveCode}>{children}</LiveCodeContext.Provider>
    </PaletteContext.Provider>
  );
}

/** Semantic colours as hex for the scheme on screen, override included. */
export function usePalette(): Palette {
  const palette = React.useContext(PaletteContext);
  if (!palette) throw new Error('usePalette must be used inside <PaletteProvider>');
  return palette;
}

/** The code of the docs picker's live theme, if one is on screen instead of the committed theme. */
export const useLiveThemeCode = () => React.useContext(LiveCodeContext);

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
