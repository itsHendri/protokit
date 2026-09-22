import { Icon } from '@/components/ui/icon';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

/** Tone-tinted alert surfaces: background, border and icon share the semantic colour. */
const alertVariants = cva('relative w-full rounded-lg border px-4 py-4', {
  variants: {
    variant: {
      default: 'bg-card border-border',
      info: 'bg-info/10 border-info/40',
      success: 'bg-success/10 border-success/40',
      warning: 'bg-warning/15 border-warning/50',
      destructive: 'bg-destructive/10 border-destructive/40',
    },
  },
  defaultVariants: { variant: 'default' },
});

const ICON_TONE: Record<NonNullable<VariantProps<typeof alertVariants>['variant']>, string> = {
  default: 'text-foreground',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

function Alert({
  className,
  variant = 'default',
  children,
  icon,
  iconClassName,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> &
  VariantProps<typeof alertVariants> & {
    icon: LucideIcon;
    iconClassName?: string;
  }) {
  const tone = variant ?? 'default';
  return (
    <TextClassContext.Provider value="text-foreground">
      <View role="alert" className={cn(alertVariants({ variant: tone }), className)} {...props}>
        <View className="absolute left-4 top-4">
          <Icon as={icon} className={cn('size-5', ICON_TONE[tone], iconClassName)} size={20} />
        </View>
        {children}
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('mb-1 min-h-5 pl-8 text-base font-semibold leading-5', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-muted-foreground pl-8 text-sm leading-relaxed', className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
