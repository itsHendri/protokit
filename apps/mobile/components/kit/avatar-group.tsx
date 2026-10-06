import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

export type AvatarGroupItem = { id: string; initials: string; uri?: string; alt?: string };

type Props = { items: AvatarGroupItem[]; max?: number; size?: number; className?: string };

/** Overlapping avatars with a "+N" overflow chip — participants, members, shared-with. */
export function AvatarGroup({ items, max = 4, size = 32, className }: Props) {
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <View className={cn('flex-row items-center', className)}>
      {shown.map((a, i) => (
        <Avatar key={a.id} alt={a.alt ?? a.initials} className="border-background border-2" style={{ width: size, height: size, marginLeft: i === 0 ? 0 : -size * 0.3 }}>
          {a.uri ? <AvatarImage source={{ uri: a.uri }} /> : null}
          <AvatarFallback>
            <Text className="text-xs">{a.initials}</Text>
          </AvatarFallback>
        </Avatar>
      ))}
      {rest > 0 ? (
        <View className="bg-muted border-background items-center justify-center rounded-full border-2" style={{ width: size, height: size, marginLeft: -size * 0.3 }}>
          <Text className="text-muted-foreground text-xs font-medium">+{rest}</Text>
        </View>
      ) : null}
    </View>
  );
}
