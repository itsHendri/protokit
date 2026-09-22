import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { type ColorValue, View } from 'react-native';

type Props = { icon: LucideIcon; color: ColorValue; size: number; focused: boolean };

/**
 * Tab bar icon with an active-state dot above it, so the selected tab is signalled by shape
 * as well as colour. Renders lucide directly with the opaque colour the tab bar passes in
 * (set tabBarActiveTintColor / tabBarInactiveTintColor explicitly — the default inactive
 * tint is the text colour at 50% alpha, which makes overlapping strokes look patchy).
 */
export function TabIcon({ icon: IconCmp, color, size, focused }: Props) {
  return (
    <View className="items-center">
      {/* Dot sits above the icon: the icon slot has no room below before the label. */}
      <View className={cn('mb-1 size-1 rounded-full', focused ? 'bg-primary' : 'bg-transparent')} accessibilityElementsHidden />
      <IconCmp color={String(color)} size={size} strokeWidth={focused ? 2.25 : 1.75} />
    </View>
  );
}
