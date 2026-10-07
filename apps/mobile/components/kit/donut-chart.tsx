import { Text } from '@/components/ui/text';
import { usePalette } from '@/lib/palette-context';
import { type ThemeColorName } from '@/lib/theme';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export type DonutSlice = { label: string; value: number; /** Palette colour name; defaults cycle chart1..5. */ color?: ThemeColorName };

type Props = { data: DonutSlice[]; size?: number; strokeWidth?: number; children?: React.ReactNode; className?: string };

const PALETTE: ThemeColorName[] = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'];

/** Ring chart. Put a total in the centre via children; pair with ChartLegend. */
export function DonutChart({ data, size = 160, strokeWidth = 22, children, className }: Props) {
  const colors = usePalette();
  const total = data.reduce((n, d) => n + d.value, 0) || 1;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const half = size / 2;
  const offsets = data.reduce<number[]>((acc, d, i) => [...acc, (acc[i - 1] ?? 0) + (i > 0 ? data[i - 1].value : 0)], []).map((_, i) => data.slice(0, i).reduce((n, d) => n + d.value, 0));
  return (
    <View className={cn('items-center justify-center', className)} style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={half} cy={half} r={r} stroke={colors.muted} strokeWidth={strokeWidth} fill="none" />
        {data.map((d, i) => {
          const seg = (d.value / total) * c;
          const rotation = -90 + (offsets[i] / total) * 360;
          return (
            <Circle key={`${d.label}-${i}`} cx={half} cy={half} r={r} stroke={colors[d.color ?? PALETTE[i % PALETTE.length]]} strokeWidth={strokeWidth} fill="none" strokeDasharray={`${seg} ${c}`} transform={`rotate(${rotation} ${half} ${half})`} />
          );
        })}
      </Svg>
      {children}
    </View>
  );
}

/** Legend rows for a DonutChart (or any series). */
export function ChartLegend({ data, className }: { data: DonutSlice[]; className?: string }) {
  const colors = usePalette();
  const total = data.reduce((n, d) => n + d.value, 0) || 1;
  return (
    <View className={cn('gap-2', className)}>
      {data.map((d, i) => (
        <View key={`${d.label}-${i}`} className="flex-row items-center gap-2">
          <View className="size-2.5 rounded-full" style={{ backgroundColor: colors[d.color ?? PALETTE[i % PALETTE.length]] }} />
          <Text className="flex-1 text-sm">{d.label}</Text>
          <Text className="text-muted-foreground text-sm">{Math.round((d.value / total) * 100)}%</Text>
        </View>
      ))}
    </View>
  );
}
