import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export type ActionTileItem = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  /** A count, or `true` for a bare dot. */
  badge?: number | boolean;
  disabled?: boolean;
};

type Props = {
  /** 3 or 4. They share the width equally; more than 4 gets cramped. */
  items: ActionTileItem[];
  className?: string;
};

/**
 * The row of primary shortcuts under a screen's hero — Add funds · Pay · Send · More.
 *
 * Keep to one row: the last tile should be "More" rather than a second row of tiles.
 */
export function ActionGrid({ items, className }: Props) {
  return (
    <View className={cn('flex-row gap-3', className)}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => {
            haptic('selection');
            item.onPress();
          }}
          disabled={item.disabled}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{ disabled: !!item.disabled }}
          className={cn('flex-1 items-center gap-2 active:opacity-70', item.disabled && 'opacity-50')}>
          <View className="bg-muted aspect-square w-full items-center justify-center rounded-2xl">
            <Icon as={item.icon} size={24} className="text-foreground" />
            {typeof item.badge === 'number' ? (
              <View className="bg-destructive border-background absolute right-1.5 top-1.5 min-w-5 items-center justify-center rounded-full border-2 px-1">
                <Text className="text-destructive-foreground text-xs font-bold leading-4">{item.badge}</Text>
              </View>
            ) : item.badge ? (
              <View className="bg-destructive border-background absolute right-2 top-2 size-3 rounded-full border-2" />
            ) : null}
          </View>
          <Text className="text-center text-xs font-medium" numberOfLines={2}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
