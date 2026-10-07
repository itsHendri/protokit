import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
};

/** Neutral-active filter chip. Selected = inverted (foreground on background), never the brand colour. */
export function FilterChip({ label, selected, onPress, icon, disabled, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      // aria-pressed is web-only (react-native-web drops accessibilityState, and a button may not carry aria-selected).
      aria-pressed={!!selected}
      disabled={disabled}
      onPress={() => {
        haptic('selection');
        onPress?.();
      }}
      className={cn(
        'h-9 flex-row items-center gap-1.5 rounded-control border px-3.5',
        selected ? 'bg-foreground border-foreground' : 'bg-background border-border active:bg-accent',
        disabled && 'opacity-50',
        className
      )}>
      {icon ? <Icon as={icon} size={14} className={selected ? 'text-background' : 'text-foreground'} /> : null}
      <Text className={cn('text-sm font-medium', selected ? 'text-background' : 'text-foreground')}>{label}</Text>
    </Pressable>
  );
}

type RowProps = { children: React.ReactNode; className?: string };

/** Horizontal, scrollable row of FilterChips. */
export function FilterChipRow({ children, className }: RowProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className={cn('flex-grow-0 self-stretch', className)} contentContainerClassName="gap-2 px-5">
      <View className="flex-row gap-2">{children}</View>
    </ScrollView>
  );
}
