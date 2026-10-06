import {
  blockedReason,
  resolve,
  requestPermission,
  type Capability,
  type CapabilityId,
  type CapabilityState,
} from '@/lib/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';

/**
 * Kit-wide device behaviour. `auto` uses the real thing wherever it works; `simulate`
 * forces every capability onto its fallback — useful for demos, screenshots and the
 * web preview. Persisted, so it survives reloads.
 *
 * Mirrors lib/theme-context.tsx. Toggled from the kit Settings screen.
 */
export type NativeMode = 'auto' | 'simulate';

const STORAGE_KEY = 'kit.native-mode';

type NativeContextValue = {
  mode: NativeMode;
  setMode: (mode: NativeMode) => void;
  /** Live permission results, filled in only by user-triggered requests. */
  permissions: Partial<Record<CapabilityId, CapabilityState>>;
  setPermission: (id: CapabilityId, state: CapabilityState) => void;
};

const NativeContext = React.createContext<NativeContextValue | null>(null);

export function NativeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<NativeMode>('auto');
  const [permissions, setPermissions] = React.useState<Partial<Record<CapabilityId, CapabilityState>>>({});

  React.useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled || (stored !== 'auto' && stored !== 'simulate')) return;
        setModeState(stored);
      })
      .catch(() => {
        /* storage unavailable (e.g. private web session) — stay on auto */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = React.useCallback((next: NativeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const setPermission = React.useCallback((id: CapabilityId, state: CapabilityState) => {
    setPermissions((prev) => (prev[id] === state ? prev : { ...prev, [id]: state }));
  }, []);

  const value = React.useMemo<NativeContextValue>(
    () => ({ mode, setMode, permissions, setPermission }),
    [mode, setMode, permissions, setPermission]
  );

  return <NativeContext.Provider value={value}>{children}</NativeContext.Provider>;
}

export function useNativeMode() {
  const ctx = React.useContext(NativeContext);
  if (!ctx) throw new Error('useNativeMode must be used inside <NativeModeProvider>');
  return { mode: ctx.mode, setMode: ctx.setMode };
}

/**
 * The one hook every capability component calls.
 *
 * `force` is the component's own `simulate` prop — `undefined` follows the kit setting.
 * There is deliberately no way to force the real thing: nothing good comes of a prototype
 * insisting on hardware that is not there.
 *
 * Resolution happens during render and is pure. Permission state enters only through
 * `request()`, which must be called from a user gesture.
 */
export function useCapability(id: CapabilityId, force?: boolean) {
  const ctx = React.useContext(NativeContext);
  if (!ctx) throw new Error('useCapability must be used inside <NativeModeProvider>');
  const { permissions, setPermission } = ctx;
  const forced = force === true || ctx.mode === 'simulate';
  const state = permissions[id] ?? 'prompt';

  const cap = React.useMemo<Capability>(
    () => (forced ? resolve(id, state, 'forced') : resolve(id, state, blockedReason(id))),
    [id, state, forced]
  );

  const request = React.useCallback(async (): Promise<Capability> => {
    if (forced) return cap;
    const next = await requestPermission(id);
    setPermission(id, next);
    return resolve(id, next, blockedReason(id));
  }, [id, forced, cap, setPermission]);

  return { cap, request };
}
