import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

type Props = React.ComponentProps<typeof Pressable> & {
  icon: LucideIcon;
  /** Adds a label → an extended pill instead of a circle. */
  label?: string;
  variant?: 'primary' | 'secondary';
  /** `inline` renders in flow; the others pin to the screen corner/centre (parent must be relative/full-screen). */
  position?: 'inline' | 'bottom-right' | 'bottom-center';
};

/**
 * A button that floats OVER the scroll rather than sitting in it, so a screen's one
 * most important action stays reachable however far down you are — add, compose, new.
 *
 * Material calls this a FAB. Use an ordinary `Button` for anything that belongs in the
 * content flow. One per screen.
 */
export function FloatingButton({ icon, label, variant = 'primary', position = 'inline', className, ...props }: Props) {
  const primary = variant === 'primary';
  const fg = primary ? 'text-primary-foreground' : 'text-secondary-foreground';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cn(
        'h-14 flex-row items-center justify-center gap-2 rounded-control shadow-lg active:opacity-90',
        label ? 'px-5' : 'w-14',
        primary ? 'bg-primary' : 'bg-secondary',
        position === 'bottom-right' && 'absolute bottom-6 right-5',
        position === 'bottom-center' && 'absolute bottom-6 self-center',
        className
      )}
      {...props}>
      <Icon as={icon} size={22} className={fg} />
      {label ? <Text className={cn('font-semibold', fg)}>{label}</Text> : null}
    </Pressable>
  );
}
