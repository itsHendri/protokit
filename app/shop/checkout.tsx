import { SummaryCard } from '@/components/kit/key-value-list';
import { SelectableCard } from '@/components/kit/selectable-card';
import { Stepper } from '@/components/kit/stepper';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { SuccessScreen } from '@/components/kit/success-screen';
import { SwipeToConfirm } from '@/components/kit/swipe-to-confirm';
import { cartTotal, DELIVERY, money, productById, shop, useShop } from '@/components/shop/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { TruckIcon, ZapIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

type Step = 'address' | 'delivery' | 'review' | 'done';

/** Multi-step checkout: one route, a Step state machine, one Stepper, one StickyBottomBar. */
export default function Checkout() {
  const router = useRouter();
  const { cart } = useShop();
  const [step, setStep] = React.useState<Step>('address');
  const [name, setName] = React.useState('Jane Doe');
  const [address, setAddress] = React.useState('12 Orchard Lane');
  const [city, setCity] = React.useState('Cape Town');
  const [delivery, setDelivery] = React.useState<(typeof DELIVERY)[number]['id']>('standard');
  const [orderId, setOrderId] = React.useState('');
  const subtotal = cartTotal(cart);
  const shipping = DELIVERY.find((d) => d.id === delivery)!;
  const total = subtotal + shipping.price;
  const stepIndex = ['address', 'delivery', 'review'].indexOf(step) + 1;

  if (step === 'done') {
    return (
      <View className="bg-background flex-1">
        <SuccessScreen title="Order placed" body={`Order ${orderId} is being prepared. We will let you know when it ships.`} />
        <StickyBottomBar transparent>
          <Button
            onPress={() => {
              router.back();
              router.push({ pathname: '/shop/order/[id]', params: { id: orderId } });
            }}>
            <Text>Track order</Text>
          </Button>
        </StickyBottomBar>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32" keyboardShouldPersistTaps="handled">
        <Stepper current={stepIndex} total={3} labels={['Address', 'Delivery', 'Review']} />
        {step === 'address' ? (
          <View className="gap-4">
            <View className="gap-2">
              <Label htmlFor="co-name">Full name</Label>
              <Input id="co-name" value={name} onChangeText={setName} textContentType="name" />
            </View>
            <View className="gap-2">
              <Label htmlFor="co-address">Street address</Label>
              <Input id="co-address" value={address} onChangeText={setAddress} textContentType="streetAddressLine1" />
            </View>
            <View className="gap-2">
              <Label htmlFor="co-city">City</Label>
              <Input id="co-city" value={city} onChangeText={setCity} textContentType="addressCity" />
            </View>
          </View>
        ) : null}
        {step === 'delivery' ? (
          <View className="gap-2">
            {DELIVERY.map((d) => (
              <SelectableCard key={d.id} icon={d.id === 'express' ? ZapIcon : TruckIcon} title={d.label} description={d.description} detail={d.price ? money(d.price) : 'Free'} selected={delivery === d.id} onPress={() => setDelivery(d.id)} />
            ))}
          </View>
        ) : null}
        {step === 'review' ? (
          <View className="gap-5">
            <SummaryCard
              title="Order summary"
              rows={[
                ...cart.map((l) => ({ label: `${productById(l.productId)?.name} × ${l.qty}`, value: money((productById(l.productId)?.price ?? 0) * l.qty) })),
                { label: shipping.label, value: shipping.price ? money(shipping.price) : 'Free', valueClassName: shipping.price ? undefined : 'text-success' },
                { label: 'Deliver to', value: `${name}, ${address}, ${city}` },
                { label: 'Total', value: money(total) },
              ]}
            />
            <SwipeToConfirm
              label={`Slide to pay ${money(total)}`}
              onConfirm={() => {
                const order = shop.placeOrder(shipping.price);
                setOrderId(order.id);
                setStep('done');
              }}
            />
          </View>
        ) : null}
      </ScrollView>
      {step !== 'review' ? (
        <StickyBottomBar>
          {step === 'delivery' ? (
            <Button variant="outline" onPress={() => setStep('address')}>
              <Text>Back</Text>
            </Button>
          ) : null}
          <Button disabled={step === 'address' && !(name && address && city)} onPress={() => setStep(step === 'address' ? 'delivery' : 'review')}>
            <Text>Continue</Text>
          </Button>
        </StickyBottomBar>
      ) : (
        <StickyBottomBar>
          <Button variant="outline" onPress={() => setStep('delivery')}>
            <Text>Back</Text>
          </Button>
        </StickyBottomBar>
      )}
    </View>
  );
}
