import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Pressable, View } from 'react-native';

type Props = {
  title: string;
  /** Optional trailing text action ("See all"). */
  action?: string;
  onAction?: () => void;
  className?: string;
};

/** Section title with optional action. Sits OUTSIDE the card it introduces. */
export function SectionHeader({ title, action, onAction, className }: Props) {
  return (
    <View className={cn('flex-row items-end justify-between', className)}>
      <Text variant="large">{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button" className="min-h-11 justify-center">
          <Text className="text-primary text-sm font-medium">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
