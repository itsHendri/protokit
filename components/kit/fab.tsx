import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

type Props = React.ComponentProps<typeof Pressable> & {
  icon: LucideIcon;
  /** Adds a label → extended pill FAB. */
  label?: string;
  variant?: 'primary' | 'secondary';
  /** `inline` renders in flow; the others pin to the screen corner/centre (parent must be relative/full-screen). */
  position?: 'inline' | 'bottom-right' | 'bottom-center';
};

/** Floating action button — the single most important action on a screen. One per screen. */
export function FAB({ icon, label, variant = 'primary', position = 'inline', className, ...props }: Props) {
  const primary = variant === 'primary';
  const fg = primary ? 'text-primary-foreground' : 'text-secondary-foreground';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cn(
        'h-14 flex-row items-center justify-center gap-2 rounded-full shadow-lg shadow-black/20 active:opacity-90',
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
