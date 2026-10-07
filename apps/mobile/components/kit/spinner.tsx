import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

type Props = Omit<ActivityIndicatorProps, 'color'> & {
  /** `primary-foreground` is the one to use inside a filled Button. */
  tone?: 'primary' | 'primary-foreground' | 'foreground' | 'muted';
};

/**
 * Themed ActivityIndicator. Use inside buttons, cards and loading screens. Announced as "Loading"
 * (a named progressbar on web); pass `accessibilityLabel` to say what is loading.
 */
export function Spinner({ tone = 'primary', size = 'small', accessibilityLabel = 'Loading', ...props }: Props) {
  const { scheme } = useKitTheme();
  const colors = THEME[scheme];
  const color =
    tone === 'primary'
      ? colors.primary
      : tone === 'primary-foreground'
        ? colors.primaryForeground
        : tone === 'foreground'
          ? colors.foreground
          : colors.mutedForeground;
  return <ActivityIndicator size={size} color={color} aria-label={accessibilityLabel} {...props} />;
}
