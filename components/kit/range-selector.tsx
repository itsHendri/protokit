import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Trackless range picker for a chart — 1D · 1W · 1M · 1Y · ALL.
 *
 * No track and no sliding thumb: the selected option is a filled disc. Use
 * `SegmentedControl` instead when the options switch content rather than a time window.
 */
export function RangeSelector<T extends string>({ options, value, onChange, className }: Props<T>) {
  return (
    <View className={cn('flex-row items-center justify-between', className)} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              haptic('selection');
              onChange(option.value);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            className={cn(
              'min-h-11 min-w-11 items-center justify-center rounded-full px-3 active:opacity-70',
              selected && 'bg-foreground'
            )}>
            <Text className={cn('text-sm font-semibold', selected ? 'text-background' : 'text-muted-foreground')}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
