import { Spot } from '@/components/kit/spot';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
  /** `default` is the full-section hero; `compact` fits inside a card. */
  variant?: 'default' | 'compact';
  className?: string;
};

/** Standard empty state: icon, title, subtitle, optional action. */
export function EmptyState({ icon, title, subtitle, action, variant = 'default', className }: Props) {
  if (variant === 'compact') {
    return (
      <View className={cn('items-center px-5 py-6', className)}>
        {icon ? <Icon as={icon} size={28} className="text-muted-foreground mb-2" /> : null}
        <Text className="text-muted-foreground text-center text-sm font-medium">{title}</Text>
        {subtitle ? <Text className="text-muted-foreground mt-1 text-center text-sm">{subtitle}</Text> : null}
        {action ? (
          <Pressable onPress={action.onPress} accessibilityRole="button" className="mt-3 min-h-8 justify-center">
            <Text className="text-primary text-sm font-semibold">{action.label}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }
  return (
    <View className={cn('items-center justify-center px-6 py-12', className)}>
      {icon ? <Spot icon={icon} size="lg" className="mb-6" /> : null}
      <View className="w-full max-w-xs items-center gap-2">
        <Text variant="h4" className="text-center">
          {title}
        </Text>
        {subtitle ? <Text className="text-muted-foreground text-center">{subtitle}</Text> : null}
        {action ? (
          <Button onPress={action.onPress} className="mt-4 w-full">
            <Text>{action.label}</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}
