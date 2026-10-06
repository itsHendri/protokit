import * as React from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * The OS "Reduce Motion" setting, live.
 *
 * `components/ui` gets this free through reanimated's `ReduceMotion.System`, but the kit's
 * own animations use React Native's `Animated`, which has no equivalent — so anything that
 * slides, springs or moves reads this and collapses its duration to 0.
 *
 * Returns false on web and wherever the query fails; a missing setting should never break
 * the animation, only the other way round.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (alive) setReduced(value);
      })
      .catch(() => {
        /* not supported here — keep motion on */
      });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return reduced;
}

/**
 * A duration mapper: `motion(260)` is 260ms normally and 0 when the viewer asked for
 * reduced motion. The animation still runs, so completion callbacks still fire — it
 * just arrives instantly.
 */
export function useMotion(): (ms: number) => number {
  const reduced = useReducedMotion();
  return React.useCallback((ms: number) => (reduced ? 0 : ms), [reduced]);
}
