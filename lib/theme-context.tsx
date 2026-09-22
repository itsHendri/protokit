import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import * as React from 'react';

/**
 * Kit theme mode. `system` follows the OS appearance; `light`/`dark` pin it.
 * The choice is persisted so it survives reloads and app restarts.
 *
 * Colours themselves live in tokens/tokens.json → global.css (CSS variables) and are
 * switched by NativeWind's colour scheme, so `bg-primary`, `text-muted-foreground`, etc.
 * follow the theme at runtime. Nothing here holds colour values.
 */
export type ThemeMode = 'system' | 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'kit.theme-mode';

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
  const { colorScheme, setColorScheme } = useColorScheme();
  const [mode, setModeState] = React.useState<ThemeMode>('system');

  React.useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled || !isThemeMode(stored)) return;
        setModeState(stored);
        setColorScheme(stored);
      })
      .catch(() => {
        /* storage unavailable (e.g. private web session) — stay on system */
      });
    return () => {
      cancelled = true;
    };
  }, [setColorScheme]);

  const setMode = React.useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      setColorScheme(next);
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
    },
    [setColorScheme]
  );

  const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';

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
