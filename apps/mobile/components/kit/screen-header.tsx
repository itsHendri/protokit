import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  title: string;
  /** One or two sentences of intro under the title. */
  subtitle?: string;
  /** Trailing slot — an IconBadge, a Button, a Badge. */
  action?: ReactNode;
  /** `large` is the hero title on a landing screen. Default `default`. */
  size?: 'default' | 'large';
  className?: string;
};

/**
 * The page title inside the scroll, under a minimal nav bar.
 *
 * Use it once per screen, as the first child of the ScrollView. Section titles further
 * down the page are `SectionHeader`, not this.
 */
export function ScreenHeader({ title, subtitle, action, size = 'default', className }: Props) {
  return (
    <View className={cn('gap-2', className)}>
      <View className="flex-row items-start justify-between gap-3">
        <Text variant={size === 'large' ? 'h2' : 'h3'} className="flex-1">
          {title}
        </Text>
        {action ? <View className="pt-1">{action}</View> : null}
      </View>
      {subtitle ? <Text className="text-muted-foreground">{subtitle}</Text> : null}
    </View>
  );
}
