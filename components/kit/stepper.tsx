import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

type Props = {
  /** 1-indexed current step. */
  current: number;
  total: number;
  /** Optional labels; must have `total` entries to render. */
  labels?: string[];
  variant?: 'numbered' | 'compact';
  className?: string;
};

/** Progress for multi-step flows (onboarding, checkout). Distinct from PagerDots. */
export function Stepper({ current, total, labels, variant = 'numbered', className }: Props) {
  const step = Math.max(1, Math.min(current, total));

  if (variant === 'compact') {
    return (
      <View className={cn('gap-2', className)} accessibilityLabel={`Step ${step} of ${total}`}>
        <View className="bg-muted h-1 overflow-hidden rounded-full">
          <View className="bg-primary h-full rounded-full" style={{ width: `${(step / total) * 100}%` }} />
        </View>
        <Text className="text-muted-foreground text-sm">
          Step {step} of {total}
        </Text>
      </View>
    );
  }

  return (
    <View className={className} accessibilityLabel={`Step ${step} of ${total}`}>
      <View className="flex-row items-center">
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <View key={n} className={cn('flex-row items-center', i < total - 1 && 'flex-1')}>
              <View
                className={cn(
                  'size-6 items-center justify-center rounded-full',
                  done ? 'bg-primary' : active ? 'bg-primary/20 border-primary border' : 'bg-muted'
                )}>
                <Text className={cn('text-xs font-semibold', done ? 'text-primary-foreground' : active ? 'text-primary' : 'text-muted-foreground')}>
                  {n}
                </Text>
              </View>
              {i < total - 1 ? <View className={cn('mx-1 h-0.5 flex-1 rounded-full', done ? 'bg-primary' : 'bg-border')} /> : null}
            </View>
          );
        })}
      </View>
      {labels && labels.length === total ? (
        <View className="mt-2 flex-row">
          {labels.map((label, i) => (
            <Text
              key={`${label}-${i}`}
              numberOfLines={1}
              className={cn('flex-1 text-xs', i + 1 === step ? 'text-foreground font-medium' : 'text-muted-foreground', i === 0 ? 'text-left' : i === total - 1 ? 'text-right' : 'text-center')}>
              {label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
