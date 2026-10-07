import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** 0 = continuous. */
  step?: number;
  tone?: 'primary' | 'destructive' | 'warning';
  disabled?: boolean;
  onChangeComplete?: (final: number) => void;
  /** What it sets, e.g. "Daily goal". A slider has no visible name of its own. */
  accessibilityLabel: string;
  className?: string;
};

const THUMB = 28;

/**
 * Continuous or stepped slider on a native pan gesture, so horizontal drags are claimed
 * by the slider instead of the navigator's swipe-back or a parent ScrollView.
 */
export function Slider({ value, onChange, min = 0, max = 1, step = 0, tone = 'primary', disabled, onChangeComplete, accessibilityLabel, className }: Props) {
  const [width, setWidth] = React.useState(0);
  const range = max - min;
  const usableW = Math.max(0, width - THUMB);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const snap = (v: number) => (step > 0 ? Math.round(v / step) * step : v);
  const ratio = range === 0 ? 0 : (clamp(value) - min) / range;
  const thumbX = ratio * usableW;

  const latest = React.useRef({ value, min, max, range, usableW, step, onChange, onChangeComplete, startX: 0 });
  React.useEffect(() => {
    latest.current = { ...latest.current, value, min, max, range, usableW, step, onChange, onChangeComplete };
  });

  // Gesture callbacks run at event time; the ref reads inside are safe.
  /* eslint-disable react-hooks/refs */
  const pan = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .runOnJS(true)
        .activeOffsetX([-4, 4])
        .failOffsetY([-12, 12])
        .onBegin((e) => {
          const L = latest.current;
          // Jump to the touch point, then drag from there.
          if (L.usableW <= 0) return;
          const x = Math.max(0, Math.min(e.x - THUMB / 2, L.usableW));
          L.startX = x;
          const raw = L.min + (x / L.usableW) * L.range;
          const next = Math.max(L.min, Math.min(L.max, L.step > 0 ? Math.round(raw / L.step) * L.step : raw));
          if (next !== L.value) L.onChange(next);
        })
        .onUpdate((e) => {
          const L = latest.current;
          if (L.usableW <= 0) return;
          const x = Math.max(0, Math.min(L.startX + e.translationX, L.usableW));
          const raw = L.min + (x / L.usableW) * L.range;
          const next = Math.max(L.min, Math.min(L.max, L.step > 0 ? Math.round(raw / L.step) * L.step : raw));
          if (next !== L.value) {
            if (L.step > 0) haptic('selection');
            L.onChange(next);
          }
        })
        .onFinalize(() => {
          const L = latest.current;
          if (L.onChangeComplete) L.onChangeComplete(L.value);
          else haptic('selection');
        }),
    [disabled]
  );  /* eslint-enable react-hooks/refs */


  const adjustBy = (dir: 1 | -1) => {
    if (disabled) return;
    const inc = step > 0 ? step : range / 20;
    const next = clamp(snap(value + dir * inc));
    if (next !== value) {
      onChange(next);
      onChangeComplete?.(next);
    }
  };

  const fill = tone === 'destructive' ? 'bg-destructive' : tone === 'warning' ? 'bg-warning' : 'bg-primary';
  const ring = tone === 'destructive' ? 'border-destructive' : tone === 'warning' ? 'border-warning' : 'border-primary';

  return (
    <GestureDetector gesture={pan}>
      <View
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        accessibilityRole="adjustable"
        aria-label={accessibilityLabel}
        aria-disabled={disabled}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuetext={`${clamp(value)}`}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'increment' ? adjustBy(1) : adjustBy(-1))}
        className={cn('h-12 justify-center', disabled && 'opacity-50', className)}>
        <View style={{ height: THUMB }} className="justify-center">
          <View className="bg-muted absolute left-0 right-0 h-1.5 rounded-full" />
          <View className={cn('absolute left-0 h-1.5 rounded-full', fill)} style={{ width: thumbX + THUMB / 2 }} />
          <View className={cn('bg-card absolute rounded-full border-2 shadow-sm shadow-black/25', ring)} style={{ left: thumbX, width: THUMB, height: THUMB }} />
        </View>
      </View>
    </GestureDetector>
  );
}
