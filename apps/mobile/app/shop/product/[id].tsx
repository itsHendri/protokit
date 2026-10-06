import { ImageTile } from '@/components/kit/image-tile';
import { QuantityStepper } from '@/components/kit/quantity-stepper';
import { SegmentedControl } from '@/components/kit/segmented-control';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { useToast } from '@/components/kit/toast';
import { iconFor, money, productById, PRODUCTS, shop } from '@/components/shop/store';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StarIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const COLOURS = [
  { value: 'sand', label: 'Sand' },
  { value: 'slate', label: 'Slate' },
  { value: 'moss', label: 'Moss' },
] as const;

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const p = productById(id) ?? PRODUCTS[0];
  const [qty, setQty] = React.useState(1);
  const [colour, setColour] = React.useState<(typeof COLOURS)[number]['value']>('sand');

  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: p.name }} />
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32">
        <ImageTile seed={p.seed} fallbackIcon={iconFor(p)} ratio={4 / 3} />
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <Badge variant="secondary">
              <Text>{p.category}</Text>
            </Badge>
            <View className="flex-row items-center gap-1">
              <Icon as={StarIcon} size={14} className="text-warning" />
              <Text className="text-muted-foreground text-sm">{p.rating} · 120 reviews</Text>
            </View>
          </View>
          <Text variant="h3">{p.name}</Text>
          <Text className="text-2xl font-semibold">{money(p.price)}</Text>
          <Text className="text-muted-foreground">{p.blurb}</Text>
        </View>
        <View className="gap-2">
          <Text className="font-medium">Colour</Text>
          <SegmentedControl segments={COLOURS} value={colour} onChange={setColour} />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-medium">Quantity</Text>
          <QuantityStepper value={qty} onChange={setQty} min={1} max={9} />
        </View>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>
              <Text>Details</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Made from responsibly sourced materials. Two-year warranty included.</Text>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>
              <Text>Shipping and returns</Text>
            </AccordionTrigger>
            <AccordionContent>
              <Text>Free standard delivery over $40. 30-day returns, no questions asked.</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollView>
      <StickyBottomBar>
        <Button
          onPress={() => {
            shop.add(p.id, qty);
            toast.success(`Added ${qty} to your cart`);
            router.back();
          }}>
          <Text>Add to cart · {money(p.price * qty)}</Text>
        </Button>
      </StickyBottomBar>
    </View>
  );
}
