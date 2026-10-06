import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { DeleteIcon } from 'lucide-react-native';
import * as React from 'react';
import { type LayoutChangeEvent, Pressable, View } from 'react-native';

type Props = {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  allowDecimal?: boolean;
  disabled?: boolean;
  className?: string;
};

const GAP = 10;
const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
] as const;

/**
 * In-app 3×4 keypad for full-screen amount entry (pair with AmountInput editable={false}).
 * Keys get an explicit measured width: three flex children in a gapped row don't distribute
 * reliably on iOS.
 */
export function NumericKeypad({ value, onChange, maxLength = 12, allowDecimal = true, disabled, className }: Props) {
  const [rowW, setRowW] = React.useState(0);
  const keyW = rowW > 0 ? (rowW - GAP * 2) / 3 : 0;

  const digit = (d: string) => {
    if (disabled || value.length >= maxLength) return;
    haptic('selection');
    onChange(value === '0' ? d : value + d);
  };
  const decimal = () => {
    if (disabled || !allowDecimal || value.includes('.') || value.length >= maxLength) return;
    haptic('selection');
    onChange(value === '' ? '0.' : value + '.');
  };
  const backspace = () => {
    if (disabled || value === '') return;
    haptic('light');
    onChange(value.slice(0, -1));
  };
  const clear = () => {
    if (disabled) return;
    haptic('medium');
    onChange('');
  };
  const onRowLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== rowW) setRowW(w);
  };

  return (
    <View className={cn('self-stretch', disabled && 'opacity-50', className)} style={{ gap: GAP }}>
      {ROWS.map((row, i) => (
        <View key={i} onLayout={i === 0 ? onRowLayout : undefined} className="flex-row justify-between">
          {row.map((d) => (
            <Key key={d} label={d} width={keyW} onPress={() => digit(d)} />
          ))}
        </View>
      ))}
      <View className="flex-row justify-between">
        {allowDecimal ? <Key label="." width={keyW} onPress={decimal} /> : <View style={{ width: keyW || undefined, flex: keyW ? undefined : 1 }} />}
        <Key label="0" width={keyW} onPress={() => digit('0')} />
        <Key width={keyW} onPress={backspace} onLongPress={clear} accessibilityLabel="Backspace">
          <Icon as={DeleteIcon} size={22} />
        </Key>
      </View>
    </View>
  );
}

function Key({
  label,
  width,
  onPress,
  onLongPress,
  accessibilityLabel,
  children,
}: {
  label?: string;
  width: number;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-muted h-14 items-center justify-center rounded-lg active:opacity-60"
      style={{ width: width || undefined, flex: width ? undefined : 1 }}>
      {children ?? <Text className="text-2xl font-medium">{label}</Text>}
    </Pressable>
  );
}
