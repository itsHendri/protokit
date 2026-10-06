import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

export type Bar = { label: string; value: number; /** Tailwind bg class, default bg-primary. */ className?: string };

type Props = { data: Bar[]; height?: number; showValues?: boolean; className?: string };

/** Vertical bar chart from plain Views. Bars scale to the max value. */
export function BarChart({ data, height = 160, showValues = false, className }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <View className={cn('flex-row items-end gap-2', className)} style={{ height: height + 28 }}>
      {data.map((d, i) => (
        <View key={`${d.label}-${i}`} className="flex-1 items-center">
          {showValues ? <Text className="text-muted-foreground mb-1 text-xs">{d.value}</Text> : null}
          <View className={cn('w-[70%] rounded-t-sm', d.className ?? 'bg-primary')} style={{ height: Math.max(2, (d.value / max) * height) }} />
          <Text className="text-muted-foreground mt-1 text-xs" numberOfLines={1}>
            {d.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
