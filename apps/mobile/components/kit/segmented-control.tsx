import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { TOKENS } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useMotion } from '@/lib/reduced-motion';
import * as React from 'react';
import { Animated, Easing, type LayoutChangeEvent, Pressable, View } from 'react-native';

type Props<T extends string> = {
  segments: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

const INSET = 3;

/** iOS-style sliding segmented control for 2–4 mutually exclusive options. */
export function SegmentedControl<T extends string>({ segments, value, onChange, className }: Props<T>) {
  const [trackW, setTrackW] = React.useState(0);
  const activeIndex = Math.max(
    0,
    segments.findIndex((s) => s.value === value)
  );
  const [anim] = React.useState(() => new Animated.Value(activeIndex));
  const segW = trackW > 0 ? (trackW - INSET * 2) / segments.length : 0;
  const motion = useMotion();

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: activeIndex,
      duration: motion(TOKENS.duration.base),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, anim, motion]);

  const onLayout = (e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width);

  return (
    <View onLayout={onLayout} className={cn('bg-muted flex-row rounded-lg', className)} style={{ padding: INSET }}>
      {segW > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: INSET,
            bottom: INSET,
            left: INSET,
            width: segW,
            transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, segW] }) }],
          }}>
          {/* The surface lives on a plain View: NativeWind drops classNames on
              Animated.View on web, which left the thumb invisible in the preview. */}
          <View className="bg-card h-full w-full rounded-md shadow-sm shadow-black/10" />
        </Animated.View>
      ) : null}
      {segments.map((seg) => {
        const active = seg.value === value;
        return (
          <Pressable
            key={seg.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            // aria-pressed is web-only (react-native-web drops accessibilityState, and a button may not carry aria-selected).
            aria-pressed={active}
            onPress={() => {
              if (active) return;
              haptic('selection');
              onChange(seg.value);
            }}
            className="h-9 flex-1 items-center justify-center">
            <Text numberOfLines={1} className={cn('text-sm', active ? 'font-semibold' : 'text-muted-foreground')}>
              {seg.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
