import * as Clipboard from 'expo-clipboard';
import * as React from 'react';

/**
 * Tap-to-copy for token tiles. Returns the key most recently copied (cleared after a
 * moment) so a tile can show a "Copied" state without a toast dependency.
 */
export function useCopy(timeoutMs = 1200) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = React.useCallback(
    (key: string, value: string) => {
      Clipboard.setStringAsync(value).catch(() => {});
      setCopied(key);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), timeoutMs);
    },
    [timeoutMs]
  );

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { copied, copy };
}
