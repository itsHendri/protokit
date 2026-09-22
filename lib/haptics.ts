import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticKind = 'selection' | 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/** Fire-and-forget haptic. No-op on web and never throws. */
export function haptic(kind: HapticKind = 'selection') {
  if (Platform.OS === 'web') return;
  const run = (): Promise<void> => {
    switch (kind) {
      case 'light':
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case 'medium':
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case 'heavy':
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      case 'success':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      case 'warning':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      case 'error':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      default:
        return Haptics.selectionAsync();
    }
  };
  run().catch(() => {});
}
