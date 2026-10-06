import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';

const dotVariants = cva('rounded-full', {
  variants: {
    tone: {
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      info: 'bg-info',
      primary: 'bg-primary',
      muted: 'bg-muted-foreground',
    },
    size: { sm: 'size-2', md: 'size-2.5', lg: 'size-3' },
  },
  defaultVariants: { tone: 'success', size: 'md' },
});

type Props = React.ComponentProps<typeof View> & VariantProps<typeof dotVariants>;

/** Small semantic status indicator (online, pending, error). */
export function StatusDot({ tone, size, className, ...props }: Props) {
  return <View className={cn(dotVariants({ tone, size }), className)} {...props} />;
}
