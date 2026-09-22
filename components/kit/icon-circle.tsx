import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

type Props = React.ComponentProps<typeof View> & {
  as: LucideIcon;
  /** Circle diameter. Default 36 (list rows). */
  size?: number;
  iconClassName?: string;
};

/** A lucide icon in a muted disc — the leading slot of a ListRow, a feature bullet. */
export function IconCircle({ as, size = 36, className, iconClassName, style, ...props }: Props) {
  return (
    <View
      className={cn('bg-muted items-center justify-center rounded-full', className)}
      style={[{ width: size, height: size }, style]}
      {...props}>
      <Icon as={as} size={Math.round(size * 0.5)} className={cn('text-foreground', iconClassName)} />
    </View>
  );
}
