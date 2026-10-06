'use client';
import { useTheme } from 'next-themes';
import * as React from 'react';

/**
 * Where each kit's web build lives. Production: /m and /w on this site (same origin, built by
 * scripts/build-docs.mjs). Dev: point the env vars at running kits and let them accept this origin:
 *   NEXT_PUBLIC_KIT_WEB_URL=http://localhost:8090   (mobile: `npm run web`, EXPO_PUBLIC_EMBED_ORIGINS=http://localhost:3000)
 *   NEXT_PUBLIC_WEB_KIT_URL=http://localhost:3100   (web: `npm run dev`, NEXT_PUBLIC_EMBED_ORIGINS=http://localhost:3000)
 */
export const frameBase = {
  mobile: (process.env.NEXT_PUBLIC_KIT_WEB_URL ?? '/m').replace(/\/$/, ''),
  web: (process.env.NEXT_PUBLIC_WEB_KIT_URL ?? '/w').replace(/\/$/, ''),
};

/**
 * An embedded kit page whose theme follows this site. The first load passes `theme=` in the URL; later
 * changes go over postMessage (`kit:theme`) once the kit has said `kit:ready`, so toggling never reloads
 * it. Both kits speak the same protocol.
 */
export function useKitFrame(base: string, path: string) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  // Build the URL once, on the client, with whatever theme the site has by then.
  React.useEffect(() => {
    if (src || !resolvedTheme) return;
    const sep = path.includes('?') ? '&' : '?';
    setSrc(`${base}${path}${sep}embed=1&theme=${theme}`);
  }, [base, path, resolvedTheme, src, theme]);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === ref.current?.contentWindow && event.data?.type === 'kit:ready') setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  React.useEffect(() => {
    const target = ref.current?.contentWindow;
    if (!ready || !target) return;
    target.postMessage({ type: 'kit:theme', value: theme }, new URL(base, window.location.href).origin);
  }, [base, ready, theme]);

  return { ref, src };
}
