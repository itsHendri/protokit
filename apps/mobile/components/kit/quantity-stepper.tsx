import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { MinusIcon, PlusIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
};

/** − value + control for quantities, guests, tickets. */
export function QuantityStepper({ value, onChange, min = 0, max = Number.POSITIVE_INFINITY, step = 1, disabled, className }: Props) {
  const canDec = !disabled && value - step >= min;
  const canInc = !disabled && value + step <= max;
  const bump = (dir: 1 | -1) => {
    haptic('selection');
    onChange(value + dir * step);
  };
  return (
    <View className={cn('bg-muted h-10 flex-row items-center rounded-lg', disabled && 'opacity-50', className)}>
      <Pressable accessibilityRole="button" accessibilityLabel="Decrease" disabled={!canDec} onPress={() => bump(-1)} className={cn('h-10 w-10 items-center justify-center', !canDec && 'opacity-40')}>
        <Icon as={MinusIcon} size={16} />
      </Pressable>
      <Text className="min-w-8 text-center font-semibold">{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Increase" disabled={!canInc} onPress={() => bump(1)} className={cn('h-10 w-10 items-center justify-center', !canInc && 'opacity-40')}>
        <Icon as={PlusIcon} size={16} />
      </Pressable>
    </View>
  );
}
