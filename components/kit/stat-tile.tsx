import { PercentChange } from '@/components/kit/percent-change';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = {
  label: string;
  value: string;
  /** Percentage delta shown under the value. */
  delta?: number;
  icon?: LucideIcon;
  className?: string;
};

/** Compact KPI tile for dashboards. Put 2–3 in a row with gap-3. */
export function StatTile({ label, value, delta, icon, className }: Props) {
  return (
    <View className={cn('bg-card border-border flex-1 gap-1 rounded-lg border p-4', className)}>
      <View className="flex-row items-center justify-between">
        <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</Text>
        {icon ? <Icon as={icon} size={16} className="text-muted-foreground" /> : null}
      </View>
      <Text className="text-2xl font-semibold">{value}</Text>
      {delta !== undefined ? <PercentChange value={delta} /> : null}
    </View>
  );
}
