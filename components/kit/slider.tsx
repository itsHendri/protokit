import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { type LayoutChangeEvent, PanResponder, View } from 'react-native';

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
  className?: string;
};

const THUMB = 24;

/** Continuous or stepped slider. Gesture math reads a live ref so the responder never goes stale. */
export function Slider({ value, onChange, min = 0, max = 1, step = 0, tone = 'primary', disabled, onChangeComplete, className }: Props) {
  const [width, setWidth] = React.useState(0);
  const dragStart = React.useRef(0);
  const range = max - min;
  const usableW = Math.max(0, width - THUMB);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const snap = (v: number) => (step > 0 ? Math.round(v / step) * step : v);
  const ratio = range === 0 ? 0 : (clamp(value) - min) / range;
  const thumbX = ratio * usableW;

  const latest = React.useRef({ value, min, max, range, usableW, step, disabled, onChange, onChangeComplete });
  React.useEffect(() => {
    latest.current = { value, min, max, range, usableW, step, disabled, onChange, onChangeComplete };
  });

  // Gesture callbacks run at event time, not during render; the ref reads inside are safe.
  /* eslint-disable react-hooks/refs */
  const responder = React.useMemo(
    () =>
      PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled,
      onMoveShouldSetPanResponder: () => !latest.current.disabled,
      onPanResponderGrant: () => {
        const L = latest.current;
        const r = L.range === 0 ? 0 : (Math.max(L.min, Math.min(L.max, L.value)) - L.min) / L.range;
        dragStart.current = r * L.usableW;
      },
      onPanResponderMove: (_, g) => {
        const L = latest.current;
        if (L.usableW <= 0) return;
        const x = Math.max(0, Math.min(dragStart.current + g.dx, L.usableW));
        const raw = L.min + (x / L.usableW) * L.range;
        const snapped = L.step > 0 ? Math.round(raw / L.step) * L.step : raw;
        const next = Math.max(L.min, Math.min(L.max, snapped));
        if (next !== L.value) {
          if (L.step > 0) haptic('selection');
          L.onChange(next);
        }
      },
      onPanResponderRelease: () => {
        const L = latest.current;
        if (L.onChangeComplete) L.onChangeComplete(L.value);
        else haptic('selection');
      },
      onPanResponderTerminate: () => latest.current.onChangeComplete?.(latest.current.value),
    }),
    []
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
    <View
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      {...responder.panHandlers}
      accessibilityRole="adjustable"
      accessibilityState={{ disabled }}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100), text: `${clamp(value)}` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => (e.nativeEvent.actionName === 'increment' ? adjustBy(1) : adjustBy(-1))}
      className={cn('h-11 justify-center', disabled && 'opacity-50', className)}>
      <View style={{ height: THUMB }} className="justify-center">
        <View className="bg-muted absolute left-0 right-0 h-1 rounded-full" />
        <View className={cn('absolute left-0 h-1 rounded-full', fill)} style={{ width: thumbX + THUMB / 2 }} />
        <View
          className={cn('bg-background absolute rounded-full border-2 shadow-sm shadow-black/25', ring)}
          style={{ left: thumbX, width: THUMB, height: THUMB }}
        />
      </View>
    </View>
  );
}
