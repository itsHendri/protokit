import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  /** The hero figure, already formatted — "$60.00", "12,480 steps". */
  value: string;
  /** Small label above the value. */
  label?: string;
  /** Line under the value — a delta, a date, a status. */
  caption?: string;
  captionTone?: 'default' | 'positive' | 'negative';
  /** Offer the eye toggle that hides the value. */
  maskable?: boolean;
  /** Controlled mask state. Omit to let the component own it. */
  masked?: boolean;
  onMaskedChange?: (next: boolean) => void;
  align?: 'start' | 'center';
  className?: string;
};

const CAPTION: Record<NonNullable<Props['captionTone']>, string> = {
  default: 'text-muted-foreground',
  positive: 'text-success',
  negative: 'text-destructive',
};

/**
 * The hero number at the top of a screen — a balance, a total, a score.
 *
 * `maskable` adds the eye toggle that replaces the figure with dots, for anything
 * someone might not want visible over their shoulder.
 */
export function ValueHeader({
  value,
  label,
  caption,
  captionTone = 'default',
  maskable,
  masked,
  onMaskedChange,
  align = 'start',
  className,
}: Props) {
  const [ownMasked, setOwnMasked] = React.useState(false);
  const isMasked = masked ?? ownMasked;

  const toggle = () => {
    haptic('selection');
    const next = !isMasked;
    if (masked === undefined) setOwnMasked(next);
    onMaskedChange?.(next);
  };

  return (
    <View className={cn('gap-1', align === 'center' && 'items-center', className)}>
      {label ? <Text className="text-muted-foreground text-sm font-medium">{label}</Text> : null}
      <View className="flex-row items-center gap-3">
        <Text className="text-4xl font-bold tracking-tight" accessibilityLabel={isMasked ? 'Value hidden' : value}>
          {isMasked ? '••••••' : value}
        </Text>
        {maskable ? (
          <Pressable
            onPress={toggle}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isMasked ? 'Show value' : 'Hide value'}
            className="bg-muted size-8 items-center justify-center rounded-full active:opacity-70">
            <Icon as={isMasked ? EyeOffIcon : EyeIcon} size={16} className="text-muted-foreground" />
          </Pressable>
        ) : null}
      </View>
      {/* Kept mounted while masked so the block does not change height. */}
      {caption ? (
        <Text className={cn('text-sm font-medium', CAPTION[captionTone], isMasked && 'opacity-0')}>{caption}</Text>
      ) : null}
    </View>
  );
}
