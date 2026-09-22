import { EmptyState } from '@/components/kit/empty-state';
import { IconCircle } from '@/components/kit/icon-circle';
import { ListRow } from '@/components/kit/list-row';
import { cartCount, money, useShop } from '@/components/shop/store';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { PackageIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

const TONE = { processing: 'bg-warning', shipped: 'bg-info', delivered: 'bg-success' } as const;
const TONE_FG = { processing: 'text-warning-foreground', shipped: 'text-info-foreground', delivered: 'text-success-foreground' } as const;

export default function Orders() {
  const router = useRouter();
  const { orders } = useShop();
  if (orders.length === 0) {
    return (
      <View className="bg-background flex-1 justify-center">
        <EmptyState icon={PackageIcon} title="No orders yet" subtitle="Your orders and their delivery status will appear here." />
      </View>
    );
  }
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-4 p-5 pb-16">
      <Card className="w-full gap-0 px-4 py-0">
        {orders.map((o, i) => (
          <ListRow
            key={o.id}
            leading={<IconCircle as={PackageIcon} />}
            title={`Order ${o.id}`}
            subtitle={`${o.placedAt} · ${cartCount(o.items)} item${cartCount(o.items) === 1 ? '' : 's'} · ${money(o.total)}`}
            trailing={
              <Badge className={TONE[o.status]}>
                <Text className={TONE_FG[o.status]}>{o.status}</Text>
              </Badge>
            }
            chevron
            onPress={() => router.push({ pathname: '/(shop)/order/[id]', params: { id: o.id } })}
            last={i === orders.length - 1}
          />
        ))}
      </Card>
    </ScrollView>
  );
}
