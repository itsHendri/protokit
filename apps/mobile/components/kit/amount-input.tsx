import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ArrowUpDownIcon } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (next: string) => void;
  /** "$", "€", "BTC"… */
  symbol: string;
  symbolPosition?: 'leading' | 'trailing';
  /** Line under the field: conversion, balance. */
  helper?: string;
  onMax?: () => void;
  onToggleCurrency?: () => void;
  error?: string;
  placeholder?: string;
  /** Set false when a NumericKeypad drives the value (hides the system keyboard). */
  editable?: boolean;
  className?: string;
};

/** Hero amount field for send / trade / deposit screens. */
export function AmountInput({
  value,
  onChangeText,
  symbol,
  symbolPosition = 'leading',
  helper,
  onMax,
  onToggleCurrency,
  error,
  placeholder = '0',
  editable = true,
  className,
}: Props) {
  const symbolEl = <Text className="text-muted-foreground text-3xl font-semibold">{symbol}</Text>;
  return (
    <View className={className}>
      <View className={cn('bg-card flex-row items-center gap-2 rounded-lg border px-4 py-3', error ? 'border-destructive' : 'border-border')}>
        {symbolPosition === 'leading' ? symbolEl : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="decimal-pad"
          editable={editable}
          showSoftInputOnFocus={editable}
          accessibilityLabel="Amount"
          className="text-foreground placeholder:text-muted-foreground flex-1 p-0 text-3xl font-semibold"
        />
        {symbolPosition === 'trailing' ? symbolEl : null}
        {onToggleCurrency ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Switch currency" onPress={onToggleCurrency} hitSlop={8} className="bg-muted size-9 items-center justify-center rounded-full">
            <Icon as={ArrowUpDownIcon} size={16} />
          </Pressable>
        ) : null}
        {onMax ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use maximum"
            onPress={() => {
              haptic('selection');
              onMax();
            }}
            hitSlop={8}
            className="bg-muted h-8 justify-center rounded-full px-3">
            <Text className="text-primary text-xs font-bold">MAX</Text>
          </Pressable>
        ) : null}
      </View>
      {error || helper ? (
        <Text className={cn('mt-2 text-sm', error ? 'text-destructive' : 'text-muted-foreground text-right')}>
          {error ?? helper}
        </Text>
      ) : null}
    </View>
  );
}
