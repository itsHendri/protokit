import { useToast } from '@/components/kit/toast';
import { haptic } from '@/lib/haptics';
import * as Clipboard from 'expo-clipboard';
import * as React from 'react';
import { Share } from 'react-native';

export type SharePayload = { message?: string; url?: string; title?: string };
export type ShareResult = 'shared' | 'dismissed' | 'copied' | 'failed';

/**
 * The OS share sheet, falling back to a clipboard copy on the web preview.
 *
 * A hook rather than a component, like `useToast` — sharing is a one-shot action with
 * no resting visual state, so the trigger is an ordinary Button.
 */
export function useShare() {
  const toast = useToast();

  const share = React.useCallback(
    async (payload: SharePayload): Promise<ShareResult> => {
      const text = [payload.message, payload.url].filter(Boolean).join(' ');
      try {
        haptic('selection');
        const result = await Share.share(
          { message: payload.message ?? payload.url ?? '', url: payload.url, title: payload.title },
          { dialogTitle: payload.title }
        );
        return result.action === Share.sharedAction ? 'shared' : 'dismissed';
      } catch {
        // react-native-web rejects when navigator.share is missing — copy instead,
        // which is still a real, satisfying interaction in the browser preview.
        try {
          await Clipboard.setStringAsync(text);
          toast.success('Copied to the clipboard');
          return 'copied';
        } catch {
          toast.error('Could not share that');
          return 'failed';
        }
      }
    },
    [toast]
  );

  return { share };
}
