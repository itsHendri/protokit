import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, CheckIcon } from 'lucide-react-native';
import * as React from 'react';
import { Animated, Easing, type LayoutChangeEvent, PanResponder, View } from 'react-native';

type Props = {
  label: string;
  onConfirm: () => void;
  confirmLabel?: string;
  tone?: 'primary' | 'destructive';
  disabled?: boolean;
  className?: string;
};

const THUMB = 56;
const TRACK_H = 64;
const COMMIT_RATIO = 0.85;

/**
 * Drag-to-confirm for high-stakes actions. Past 85% commits (success haptic), otherwise
 * springs back. Does not reset itself: change its `key` to reset.
 */
export function SwipeToConfirm({ label, onConfirm, confirmLabel = 'Confirmed', tone = 'primary', disabled, className }: Props) {
  const [trackW, setTrackW] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const [translateX] = React.useState(() => new Animated.Value(0));
  const maxX = Math.max(0, trackW - THUMB);

  const latest = React.useRef({ maxX, disabled, completed, onConfirm });
  React.useEffect(() => {
    latest.current = { maxX, disabled, completed, onConfirm };
  });

  // Gesture callbacks run at event time, not during render; the ref reads inside are safe.
  /* eslint-disable react-hooks/refs */
  const responder = React.useMemo(
    () =>
      PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled && !latest.current.completed,
      onMoveShouldSetPanResponder: () => !latest.current.disabled && !latest.current.completed,
      onPanResponderMove: (_, g) => translateX.setValue(Math.max(0, Math.min(g.dx, latest.current.maxX))),
      onPanResponderRelease: (_, g) => {
        const { maxX, onConfirm } = latest.current;
        const clamped = Math.max(0, Math.min(g.dx, maxX));
        if (maxX > 0 && clamped / maxX >= COMMIT_RATIO) {
          haptic('success');
          setCompleted(true);
          Animated.timing(translateX, { toValue: maxX, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => onConfirm());
        } else {
          Animated.spring(translateX, { toValue: 0, friction: 7, tension: 60, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminate: () => Animated.spring(translateX, { toValue: 0, friction: 7, tension: 60, useNativeDriver: false }).start(),
    }),
    [translateX]
  );  /* eslint-enable react-hooks/refs */


  const promptOpacity = maxX > 0 ? translateX.interpolate({ inputRange: [0, maxX * 0.5], outputRange: [1, 0], extrapolate: 'clamp' }) : 1;
  const fillWidth = Animated.add(translateX, new Animated.Value(THUMB + (TRACK_H - THUMB) / 2));
  const bg = tone === 'destructive' ? 'bg-destructive' : 'bg-primary';
  const fg = tone === 'destructive' ? 'text-destructive-foreground' : 'text-primary-foreground';

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width)}
      className={cn('bg-muted justify-center overflow-hidden rounded-full', disabled && 'opacity-50', className)}
      style={{ height: TRACK_H }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Swipe right to confirm">
      <Animated.View
        pointerEvents="none"
        className={cn('absolute bottom-0 left-0 top-0 rounded-full', tone === 'destructive' ? 'bg-destructive/15' : 'bg-primary/15')}
        style={{ width: fillWidth }}
      />
      <Animated.View pointerEvents="none" className="absolute left-0 right-0 items-center" style={{ opacity: completed ? 0 : promptOpacity }}>
        <Text className="text-muted-foreground font-semibold">{label}</Text>
      </Animated.View>
      {completed ? (
        <View pointerEvents="none" className="absolute left-0 right-0 items-center">
          <Text className={cn('font-semibold', tone === 'destructive' ? 'text-destructive' : 'text-primary')}>{confirmLabel}</Text>
        </View>
      ) : null}
      <Animated.View
        {...responder.panHandlers}
        className={cn('items-center justify-center rounded-full', bg)}
        style={{ width: THUMB, height: THUMB, marginLeft: (TRACK_H - THUMB) / 2, transform: [{ translateX }] }}>
        <Icon as={completed ? CheckIcon : ArrowRightIcon} size={24} className={fg} />
      </Animated.View>
    </View>
  );
}
