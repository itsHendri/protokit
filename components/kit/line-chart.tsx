import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import * as React from 'react';
import { type LayoutChangeEvent, PanResponder, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

export type LinePoint = { x: number; y: number };
export type ChartTone = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'foreground';

type Props = {
  /** number[] → x = index. */
  data: number[] | LinePoint[];
  /** `sparkline` = no interaction; `interactive` = touch crosshair. */
  variant?: 'sparkline' | 'interactive';
  height?: number;
  width?: number;
  tone?: ChartTone;
  strokeWidth?: number;
  area?: boolean;
  /** Faint horizontal guides at 25/50/75%. Default true for interactive. */
  grid?: boolean;
  domain?: { min: number; max: number };
  onPointerChange?: (point: LinePoint | null) => void;
};

function toPoints(data: number[] | LinePoint[]): LinePoint[] {
  if (data.length === 0) return [];
  return typeof data[0] === 'number' ? (data as number[]).map((y, x) => ({ x, y })) : (data as LinePoint[]);
}

/** SVG line chart. Colours come from THEME (the one place hex is allowed: SVG props). */
export function LineChart({ data, variant = 'interactive', height = 160, width: widthProp, tone = 'primary', strokeWidth = 2.5, area = false, grid, domain, onPointerChange }: Props) {
  const { scheme } = useKitTheme();
  const colors = THEME[scheme];
  const color = colors[tone];
  const points = React.useMemo(() => toPoints(data), [data]);
  const [measuredW, setMeasuredW] = React.useState(widthProp ?? 0);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const W = widthProp ?? measuredW;
  const H = height;
  const gradId = React.useId().replace(/:/g, '');

  const { yMin, yMax } = React.useMemo(() => {
    if (domain) return { yMin: domain.min, yMax: domain.max };
    if (points.length === 0) return { yMin: 0, yMax: 1 };
    let mn = points[0].y;
    let mx = points[0].y;
    for (const p of points) {
      mn = Math.min(mn, p.y);
      mx = Math.max(mx, p.y);
    }
    const span = mx - mn || 1;
    return { yMin: mn - span * 0.06, yMax: mx + span * 0.06 };
  }, [points, domain]);

  const { xMin, xMax } = React.useMemo(() => {
    if (points.length === 0) return { xMin: 0, xMax: 1 };
    let mn = points[0].x;
    let mx = points[0].x;
    for (const p of points) {
      mn = Math.min(mn, p.x);
      mx = Math.max(mx, p.x);
    }
    return { xMin: mn, xMax: mn === mx ? mn + 1 : mx };
  }, [points]);

  const sx = React.useCallback((xv: number) => 1 + ((xv - xMin) / (xMax - xMin)) * (W - 2), [xMin, xMax, W]);
  const sy = React.useCallback((yv: number) => H - ((yv - yMin) / (yMax - yMin)) * H, [yMin, yMax, H]);

  const pathD = React.useMemo(() => {
    if (points.length === 0 || W === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x).toFixed(2)} ${sy(p.y).toFixed(2)}`).join(' ');
  }, [points, W, sx, sy]);

  const areaD = React.useMemo(() => {
    if (!area || !pathD) return '';
    return `${pathD} L ${sx(points[points.length - 1].x).toFixed(2)} ${H} L ${sx(points[0].x).toFixed(2)} ${H} Z`;
  }, [area, pathD, points, sx, H]);

  const latest = React.useRef({ variant, points, W, xMin, xMax, hoverIdx, onPointerChange });
  React.useEffect(() => {
    latest.current = { variant, points, W, xMin, xMax, hoverIdx, onPointerChange };
  });

  const responder = React.useMemo(() => {
    const handleMove = (locationX: number) => {
      const L = latest.current;
      if (L.variant !== 'interactive' || L.points.length === 0 || L.W === 0) return;
      const dataX = L.xMin + (locationX / L.W) * (L.xMax - L.xMin);
      let nearest = 0;
      let best = Number.POSITIVE_INFINITY;
      L.points.forEach((p, i) => {
        const d = Math.abs(p.x - dataX);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      if (nearest !== L.hoverIdx) {
        setHoverIdx(nearest);
        L.onPointerChange?.(L.points[nearest]);
      }
    };
    const release = () => {
      setHoverIdx(null);
      latest.current.onPointerChange?.(null);
    };
    // Gesture callbacks run at event time, not during render; the ref reads inside are safe.
    // eslint-disable-next-line react-hooks/refs
    return PanResponder.create({
      onStartShouldSetPanResponder: () => latest.current.variant === 'interactive',
      onMoveShouldSetPanResponder: () => latest.current.variant === 'interactive',
      onPanResponderGrant: (e) => handleMove(e.nativeEvent.locationX),
      onPanResponderMove: (e) => handleMove(e.nativeEvent.locationX),
      onPanResponderRelease: release,
      onPanResponderTerminate: release,
    });
  }, []);

  const hoverPt = hoverIdx != null ? points[hoverIdx] : null;

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => {
        if (!widthProp) setMeasuredW(e.nativeEvent.layout.width);
      }}
      {...(variant === 'interactive' ? responder.panHandlers : {})}
      style={{ width: widthProp ?? '100%', height: H }}>
      {W > 0 && points.length > 0 ? (
        <Svg width={W} height={H}>
          {(grid ?? variant === 'interactive')
            ? [0.25, 0.5, 0.75].map((f) => <Line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke={colors.border} strokeWidth={1} strokeDasharray="2 4" />)
            : null}
          {area ? (
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.28} />
                <Stop offset="1" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
          ) : null}
          {area ? <Path d={areaD} fill={`url(#${gradId})`} /> : null}
          <Path d={pathD} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
          {hoverPt ? (
            <>
              <Line x1={sx(hoverPt.x)} x2={sx(hoverPt.x)} y1={0} y2={H} stroke={colors.mutedForeground} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
              <Circle cx={sx(hoverPt.x)} cy={sy(hoverPt.y)} r={5} fill={color} stroke={colors.background} strokeWidth={2} />
            </>
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
}
