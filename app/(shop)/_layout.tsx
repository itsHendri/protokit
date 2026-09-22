import { KitChip } from '@/components/kit/kit-chip';
import { Stack } from 'expo-router';

/** Shop and orders sample. Delete app/(shop) and components/shop when starting a real project. */
export default function ShopLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: true, title: 'Order' }} />
        <Stack.Screen name="checkout" options={{ presentation: 'modal', headerShown: true, title: 'Checkout' }} />
      </Stack>
      <KitChip />
    </>
  );
}
