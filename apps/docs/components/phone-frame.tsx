'use client';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { kitWebUrl } from '@/lib/kit';

/** The phone's logical viewport (iPhone 16/17), rendered at this size and scaled down to fit. */
const VIEWPORT = { width: 390, height: 844 };

type Props = {
  /** A kit route with its query, e.g. `/kitchen-sink?section=list-row` or `/shop`. */
  path: string;
  /** Accessible name for the iframe ("List row preview"). */
  title: string;
  /** Rendered width in px; the height follows the phone's aspect ratio. */
  width?: number;
  /** Show only the top part of the screen (in viewport px), for single components. */
  viewportHeight?: number;
  className?: string;
};

/**
 * The real kit, live: an iframe of the kit's web export in embed mode (no tab bar, header or KitChip),
 * scaled into a phone outline. The theme follows the site: the first load passes `theme=`, later changes
 * go over postMessage (`kit:theme`) once the kit has said `kit:ready`, so toggling never reloads it.
 */
export function PhoneFrame({ path, title, width = 300, viewportHeight = VIEWPORT.height, className }: Props) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const frame = React.useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  // Build the URL once, on the client, with whatever theme the site has by then.
  React.useEffect(() => {
    if (src || !resolvedTheme) return;
    const sep = path.includes('?') ? '&' : '?';
    setSrc(`${kitWebUrl}${path}${sep}embed=1&theme=${theme}`);
  }, [path, resolvedTheme, src, theme]);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === frame.current?.contentWindow && event.data?.type === 'kit:ready') setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  React.useEffect(() => {
    const target = frame.current?.contentWindow;
    if (!ready || !target) return;
    target.postMessage({ type: 'kit:theme', value: theme }, new URL(kitWebUrl, window.location.href).origin);
  }, [ready, theme]);

  const scale = width / VIEWPORT.width;
  const bezel = 10;

  return (
    <div
      className={`border-border bg-foreground/90 inline-block shrink-0 rounded-[2.75rem] border shadow-xl ${className ?? ''}`}
      style={{ padding: bezel, width: width + bezel * 2 }}>
      <div
        className="bg-background relative overflow-hidden rounded-[2.1rem]"
        style={{ width, height: viewportHeight * scale }}>
        {src ? (
          <iframe
            ref={frame}
            src={src}
            title={title}
            loading="lazy"
            className="absolute left-0 top-0 origin-top-left border-0"
            style={{ width: VIEWPORT.width, height: viewportHeight, transform: `scale(${scale})` }}
          />
        ) : (
          <div className="bg-muted absolute inset-0 animate-pulse" aria-hidden />
        )}
      </div>
    </div>
  );
}
