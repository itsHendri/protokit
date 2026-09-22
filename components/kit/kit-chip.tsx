import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = { label?: string; className?: string };

/**
 * Floating "back to kit" pill that sits over a hosted prototype on every screen, whatever
 * chrome the prototype owns. Render it once in the prototype's root layout, after the Stack.
 * Delete it (or the whole kit shell) when the prototype becomes the product.
 */
export function KitChip({ label = 'Kit', className }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to the kit"
      onPress={() => {
        haptic('selection');
        router.replace('/(kit)');
      }}
      className={cn('bg-foreground/90 absolute right-4 h-9 flex-row items-center gap-1.5 rounded-full pl-2.5 pr-3.5 shadow-md shadow-black/20 active:opacity-80', className)}
      style={{ top: insets.top + 6 }}>
      <Icon as={ArrowLeftIcon} size={14} className="text-background" />
      <Text className="text-background text-xs font-semibold">{label}</Text>
    </Pressable>
  );
}
