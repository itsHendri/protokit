import { EMBED, useEmbedBridge } from '@/lib/embed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, useColorScheme as useSystemColorScheme } from 'react-native';

/**
 * Kit theme mode. `system` follows the OS appearance; `light`/`dark` pin it.
 * The choice is persisted so it survives reloads and app restarts, except in an embedded or `?theme=`
 * session (see lib/embed.ts), which starts from the URL and leaves the saved choice alone.
 *
 * Colours themselves live in tokens/tokens.json → global.css (CSS variables) and are
 * switched by NativeWind's colour scheme, so `bg-primary`, `text-muted-foreground`, etc.
 * follow the theme at runtime. Nothing here holds colour values.
 */
export type ThemeMode = 'system' | 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'kit.theme-mode';
/** Embedded in the docs, or opened with ?theme=: the theme comes from the host, not from storage. */
const EPHEMERAL = EMBED.embedded || EMBED.theme !== undefined;
/**
 * On web the kit, not NativeWind, decides the scheme and puts the `dark` class (tailwind.config.js
 * `darkMode: 'class'`) on <html>, which is what switches the global.css variables. NativeWind's web
 * `setColorScheme('system')` removes that class and never adds it back, and its system listener drops
 * appearance changes while the tab is hidden; on a dark OS the navigation header went dark over light
 * surfaces. Native still goes through NativeWind, which handles both.
 */
const WEB = Platform.OS === 'web';

type ThemeContextValue = {
  /** What the user chose. */
  mode: ThemeMode;
  /** What is actually rendered right now. */
  scheme: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  /** Flip between light and dark (leaves `system`). */
  toggle: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function KitThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme: nativewindScheme, setColorScheme: setNativewindScheme } = useColorScheme();
  // react-native-web: prefers-color-scheme via matchMedia, live.
  const systemScheme = useSystemColorScheme();
  const setColorScheme = React.useCallback(
    (next: ThemeMode) => {
      if (!WEB) setNativewindScheme(next);
    },
    [setNativewindScheme]
  );
  const [mode, setModeState] = React.useState<ThemeMode>(EMBED.theme ?? 'system');
  // NativeWind hands out a new setColorScheme on every render, so this effect re-runs; the start-up
  // theme must be applied once, or it would undo every later change (the embed bridge's included).
  const started = React.useRef(false);

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (EPHEMERAL) {
      if (EMBED.theme) setColorScheme(EMBED.theme);
      return;
    }
    // No cancel-on-cleanup: with the once-guard, a cancelled load would never be retried.
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!isThemeMode(stored)) return;
        setModeState(stored);
        setColorScheme(stored);
      })
      .catch(() => {
        /* storage unavailable (e.g. private web session) — stay on system */
      });
  }, [setColorScheme]);

  const setMode = React.useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      setColorScheme(next);
      if (!EPHEMERAL) AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
    },
    [setColorScheme]
  );

  useEmbedBridge(setMode);

  const rendered = WEB ? (mode === 'system' ? systemScheme : mode) : nativewindScheme;
  const scheme: ColorScheme = rendered === 'dark' ? 'dark' : 'light';

  // A layout effect, so the class is in place before the frame that needs it is painted.
  React.useLayoutEffect(() => {
    if (!WEB || typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', scheme === 'dark');
  }, [scheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      setMode,
      toggle: () => setMode(scheme === 'dark' ? 'light' : 'dark'),
    }),
    [mode, scheme, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useKitTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useKitTheme must be used inside <KitThemeProvider>');
  return ctx;
}
