import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';

type Props = {
  children: string;
  /** Trailing link — "Learn more", "Read the terms". */
  action?: { label: string; onPress: () => void };
  className?: string;
};

/** Small print at the foot of a screen — disclosures, legal copy, data notes. */
export function Footnote({ children, action, className }: Props) {
  return (
    <View className={cn('gap-2', className)}>
      <Text className="text-muted-foreground text-xs leading-5">{children}</Text>
      {action ? (
        <Pressable
          onPress={action.onPress}
          hitSlop={8}
          accessibilityRole="link"
          className="min-h-11 justify-center">
          <Text className="text-xs font-semibold underline">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
