import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { usePalette } from '@/lib/palette-context';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  /** 0 to `max`. Shown to the nearest half star. */
  value: number;
  /** Makes it an input: each star is a radio button, tapping one sets the rating. Omit to display. */
  onChange?: (value: number) => void;
  max?: number;
  /** Display only: the number beside the stars, and how many reviews (`4.6 · 120 reviews`). */
  showValue?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  /** What is being rated, for screen readers ("Rate your order"). Default "Rating". */
  accessibilityLabel?: string;
  className?: string;
};

const PX = { sm: 14, md: 18, lg: 28 } as const;

function Star({ px, fraction }: { px: number; fraction: number }) {
  const filled = usePalette().warning;
  return (
    <View style={{ width: px, height: px }}>
      <Icon as={StarIcon} size={px} className="text-muted-foreground" strokeWidth={1.75} />
      {fraction > 0 ? (
        <View className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: px * fraction }}>
          <Icon as={StarIcon} size={px} className="text-warning" fill={filled} strokeWidth={1.75} />
        </View>
      ) : null}
    </View>
  );
}

/**
 * Stars. Without `onChange` it shows a score (half stars, optional number and review count); with
 * `onChange` it is an input whose stars are 44pt radio buttons.
 */
export function Rating({ value, onChange, max = 5, showValue, count, size, accessibilityLabel = 'Rating', className }: Props) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const half = Math.round(value * 2) / 2;

  if (onChange) {
    const px = PX[size ?? 'lg'];
    return (
      <View role="radiogroup" aria-label={accessibilityLabel} className={cn('flex-row', className)}>
        {stars.map((n) => (
          <Pressable
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
            accessibilityState={{ checked: value === n }}
            onPress={() => {
              haptic('selection');
              onChange(n);
            }}
            hitSlop={4}
            className="size-11 items-center justify-center active:opacity-70">
            <Star px={px} fraction={n <= value ? 1 : 0} />
          </Pressable>
        ))}
      </View>
    );
  }

  const px = PX[size ?? 'sm'];
  const label = `Rated ${value} out of ${max}${count ? `, ${count} reviews` : ''}`;
  return (
    <View role="img" aria-label={label} accessible className={cn('flex-row items-center gap-1.5', className)}>
      <View className="flex-row gap-0.5">
        {stars.map((n) => (
          <Star key={n} px={px} fraction={Math.max(0, Math.min(1, half - (n - 1)))} />
        ))}
      </View>
      {showValue || count ? (
        <Text className={cn('text-muted-foreground', size === 'md' || size === 'lg' ? 'text-sm' : 'text-xs')}>
          {[showValue ? value.toFixed(1) : null, count ? `${count} reviews` : null].filter(Boolean).join(' · ')}
        </Text>
      ) : null}
    </View>
  );
}
