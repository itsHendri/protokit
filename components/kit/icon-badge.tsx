import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = React.ComponentProps<typeof Pressable> & {
  icon: LucideIcon;
  /** Number shown in the badge; 0 hides it. Values over 99 show "99+". */
  count?: number;
  /** Show a plain dot instead of a count. */
  dot?: boolean;
  size?: number;
  accessibilityLabel: string;
};

/** Icon button with a notification badge (bell, cart, inbox). Always give it a label. */
export function IconBadge({ icon, count = 0, dot, size = 22, className, accessibilityLabel, ...props }: Props) {
  const showCount = !dot && count > 0;
  const label = showCount ? `${accessibilityLabel}, ${count} new` : accessibilityLabel;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} className={cn('size-11 items-center justify-center rounded-full active:bg-accent', className)} {...props}>
      <Icon as={icon} size={size} />
      {dot ? <View className="bg-destructive border-background absolute right-2 top-2 size-2.5 rounded-full border-2" /> : null}
      {showCount ? (
        <View className="bg-destructive border-background absolute -top-0.5 right-0 min-w-5 items-center justify-center rounded-full border-2 px-1 py-px">
          <Text className="text-destructive-foreground text-[10px] font-bold leading-3">{count > 99 ? '99+' : count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
