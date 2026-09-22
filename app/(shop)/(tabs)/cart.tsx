import { EmptyState } from '@/components/kit/empty-state';
import { ImageTile } from '@/components/kit/image-tile';
import { KeyValueList } from '@/components/kit/key-value-list';
import { QuantityStepper } from '@/components/kit/quantity-stepper';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { cartTotal, iconFor, money, productById, shop, useShop } from '@/components/shop/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ShoppingCartIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

export default function Cart() {
  const router = useRouter();
  const { cart } = useShop();
  const subtotal = cartTotal(cart);

  if (cart.length === 0) {
    return (
      <View className="bg-background flex-1 justify-center">
        <EmptyState icon={ShoppingCartIcon} title="Your cart is empty" subtitle="Anything you add from the shop shows up here." action={{ label: 'Browse the shop', onPress: () => router.navigate('/(shop)/(tabs)') }} />
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32">
        <Card className="w-full gap-0 px-4 py-0">
          {cart.map((line, i) => {
            const p = productById(line.productId);
            if (!p) return null;
            return (
              <View key={line.productId} className={i < cart.length - 1 ? 'border-border flex-row items-center gap-3 border-b py-3' : 'flex-row items-center gap-3 py-3'}>
                <ImageTile fallbackIcon={iconFor(p)} ratio={1} className="w-16" />
                <View className="flex-1">
                  <Text className="font-medium" numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text className="text-muted-foreground text-sm">{money(p.price)} each</Text>
                </View>
                <QuantityStepper value={line.qty} onChange={(q) => shop.setQty(p.id, q)} min={0} max={9} />
              </View>
            );
          })}
        </Card>
        <Card className="w-full px-4 py-4">
          <KeyValueList
            rows={[
              { label: 'Subtotal', value: money(subtotal) },
              { label: 'Delivery', value: subtotal >= 40 ? 'Free' : money(4.9), valueClassName: subtotal >= 40 ? 'text-success' : undefined },
              { label: 'Total', value: money(subtotal + (subtotal >= 40 ? 0 : 4.9)) },
            ]}
          />
        </Card>
      </ScrollView>
      <StickyBottomBar>
        <Button onPress={() => router.push('/(shop)/checkout')}>
          <Text>Checkout</Text>
        </Button>
      </StickyBottomBar>
    </View>
  );
}
