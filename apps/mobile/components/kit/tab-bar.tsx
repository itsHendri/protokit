import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { useIconStroke, usePalette } from '@/lib/palette-context';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { type ColorValue, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Minimal structural view of what Expo Router's Tabs passes to `tabBar`. Kept local so the
 * kit does not deep-import react-navigation types.
 */
type Route = { key: string; name: string; params?: object };
type IconRender = (props: { focused: boolean; color: ColorValue; size: number }) => React.ReactNode;
export type TabBarProps = {
  state: { index: number; routes: Route[] };
  descriptors: Record<string, { options: { title?: string; tabBarIcon?: IconRender; tabBarAccessibilityLabel?: string; href?: string | null } }>;
  navigation: {
    emit: (e: { type: 'tabPress' | 'tabLongPress'; target: string; canPreventDefault?: boolean }) => unknown;
    navigate: (name: string, params?: object) => void;
  };
};

/**
 * The kit's bottom tab bar: icon, label, and an active dot UNDER the label so the selected
 * tab reads by shape as well as colour. Opaque tints from the theme (the default tab bar's
 * inactive tint is text at 50% alpha, which makes overlapping strokes look patchy).
 *
 *   <Tabs tabBar={(props) => <TabBar {...props} />}>
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = usePalette();
  return (
    <View className="bg-background border-border flex-row border-t" style={{ paddingBottom: Math.max(insets.bottom, 8) }} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        if (options.href === null) return null;
        const focused = state.index === index;
        const label = options.title ?? route.name;
        const color = focused ? colors.primary : colors.mutedForeground;
        const onPress = () => {
          const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }) as { defaultPrevented?: boolean };
          // The haptic lives in TabBarItem so custom bars get it too.
          if (!focused && !e.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <TabBarItem
            key={route.key}
            label={label}
            focused={focused}
            color={color}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            icon={options.tabBarIcon?.({ focused, color, size: 24 })}
          />
        );
      })}
    </View>
  );
}

type ItemProps = {
  label: string;
  focused: boolean;
  color: string;
  icon: React.ReactNode;
  accessibilityLabel?: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

/** One tab: icon, label, dot. Exported for previews and for custom tab bars. */
export function TabBarItem({ label, focused, color, icon, accessibilityLabel, onPress, onLongPress }: ItemProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      aria-selected={focused}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={
        onPress
          ? () => {
              haptic('selection');
              onPress();
            }
          : undefined
      }
      onLongPress={onLongPress}
      className="min-h-14 flex-1 items-center justify-center gap-1 pb-2 pt-2 active:opacity-70">
      {icon}
      <Text className="text-[11px] font-medium" style={{ color }} numberOfLines={1}>
        {label}
      </Text>
      <View className={cn('size-1 rounded-full', focused ? 'bg-primary' : 'bg-transparent')} accessibilityElementsHidden />
    </Pressable>
  );
}

/** Default icon renderer for `tabBarIcon`: a lucide icon whose stroke thickens when focused (and follows the theme's stroke). */
export function tabIcon(icon: LucideIcon): IconRender {
  // Called as a function by the tab bar, not rendered as a component, so the hook lives in TabIcon.
  function TabIconRender({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
    return <TabIcon icon={icon} focused={focused} color={color} size={size} />;
  }
  return TabIconRender;
}

function TabIcon({ icon: IconCmp, focused, color, size }: { icon: LucideIcon; focused: boolean; color: ColorValue; size: number }) {
  const stroke = useIconStroke();
  return <IconCmp color={String(color)} size={size} strokeWidth={((focused ? 2.25 : 1.75) * stroke) / 2} />;
}
