import { SummaryCard } from '@/components/kit/key-value-list';
import { Rating } from '@/components/kit/rating';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { Timeline, type TimelineItem } from '@/components/kit/timeline';
import { useToast } from '@/components/kit/toast';
import { money, productById, useShop } from '@/components/shop/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const STEPS = ['processing', 'shipped', 'delivered'] as const;
const LABEL = { processing: 'Order confirmed', shipped: 'On its way', delivered: 'Delivered' } as const;
/** Mock times per step; a real app gets these from the order. */
const WHEN = { processing: 'Placed', shipped: 'With the courier', delivered: 'Left at the front door' } as const;

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useShop();
  const toast = useToast();
  const o = orders.find((x) => x.id === id) ?? orders[0];
  const reached = STEPS.indexOf(o.status);
  const [stars, setStars] = React.useState(0);
  const steps: TimelineItem[] = STEPS.map((s, i) => ({
    title: LABEL[s],
    time: i === 0 ? `${WHEN[s]} ${o.placedAt}` : i <= reached ? WHEN[s] : i === reached + 1 ? 'Next' : undefined,
    state: i < reached || (i === reached && s === 'delivered') ? 'done' : i === reached ? 'current' : 'upcoming',
  }));
  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: `Order ${o.id}` }} />
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32">
        <Card className="w-full gap-4 px-4 py-4">
          <Text className="font-semibold">Status</Text>
          <Timeline items={steps} />
        </Card>
        {o.status === 'delivered' ? (
          <Card className="w-full gap-2 px-4 py-4">
            <Text className="font-semibold">How was your order?</Text>
            <Rating
              value={stars}
              accessibilityLabel="Rate your order"
              onChange={(n) => {
                setStars(n);
                toast.success(`Thanks, you rated it ${n} of 5`);
              }}
            />
          </Card>
        ) : null}
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
