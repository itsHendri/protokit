import { SummaryCard } from '@/components/kit/key-value-list';
import { StatusDot } from '@/components/kit/status-dot';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { useToast } from '@/components/kit/toast';
import { money, productById, useShop } from '@/components/shop/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

const STEPS = ['processing', 'shipped', 'delivered'] as const;
const LABEL = { processing: 'Order confirmed', shipped: 'On its way', delivered: 'Delivered' } as const;

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useShop();
  const toast = useToast();
  const o = orders.find((x) => x.id === id) ?? orders[0];
  const reached = STEPS.indexOf(o.status);
  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: `Order ${o.id}` }} />
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32">
        <Card className="w-full gap-4 px-4 py-4">
          <Text className="font-semibold">Status</Text>
          {STEPS.map((s, i) => (
            <View key={s} className="flex-row items-center gap-3">
              <StatusDot tone={i <= reached ? 'success' : 'muted'} size="lg" />
              <View className="flex-1">
                <Text className={i <= reached ? 'font-medium' : 'text-muted-foreground'}>{LABEL[s]}</Text>
                {i === reached ? <Text className="text-muted-foreground text-sm">{o.placedAt}</Text> : null}
              </View>
            </View>
          ))}
        </Card>
        <SummaryCard
          title="Items"
          rows={[
            ...o.items.map((l) => ({ label: `${productById(l.productId)?.name} × ${l.qty}`, value: money((productById(l.productId)?.price ?? 0) * l.qty) })),
            { label: 'Total', value: money(o.total) },
          ]}
        />
      </ScrollView>
      <StickyBottomBar>
        <Button variant="outline" onPress={() => toast.info('Support chat is not part of the sample')}>
          <Text>Get help</Text>
        </Button>
      </StickyBottomBar>
    </View>
  );
}
