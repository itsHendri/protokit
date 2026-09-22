import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

type Props = Omit<ActivityIndicatorProps, 'color'> & {
  tone?: 'primary' | 'foreground' | 'muted';
};

/** Themed ActivityIndicator. Use inside buttons, cards and loading screens. */
export function Spinner({ tone = 'primary', size = 'small', ...props }: Props) {
  const { scheme } = useKitTheme();
  const colors = THEME[scheme];
  const color = tone === 'primary' ? colors.primary : tone === 'foreground' ? colors.foreground : colors.mutedForeground;
  return <ActivityIndicator size={size} color={color} {...props} />;
}
