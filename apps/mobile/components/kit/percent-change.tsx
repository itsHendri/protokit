import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  /** Percentage, e.g. 2.35 for +2.35%. */
  value: number;
  decimals?: number;
  showIcon?: boolean;
  className?: string;
};

/** Signed percentage with a trend icon, coloured by sign. */
export function PercentChange({ value, decimals = 2, showIcon = true, className }: Props) {
  const flat = value === 0;
  const up = value > 0;
  const tone = flat ? 'text-muted-foreground' : up ? 'text-success' : 'text-destructive';
  return (
    <View className={cn('flex-row items-center gap-1', className)}>
      {showIcon && !flat ? <Icon as={up ? TrendingUpIcon : TrendingDownIcon} size={14} className={tone} /> : null}
      <Text className={cn('text-sm font-medium', tone)}>
        {up ? '+' : ''}
        {value.toFixed(decimals)}%
      </Text>
    </View>
  );
}
