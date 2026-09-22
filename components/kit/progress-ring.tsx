import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  /** Centre content, e.g. a percentage Text. */
  children?: React.ReactNode;
  className?: string;
};

/** Circular determinate progress — goals, storage, step completion. */
export function ProgressRing({ value, size = 64, strokeWidth = 6, tone = 'primary', children, className }: Props) {
  const { scheme } = useKitTheme();
  const colors = THEME[scheme];
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View className={cn('items-center justify-center', className)} style={{ width: size, height: size }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.muted} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}
