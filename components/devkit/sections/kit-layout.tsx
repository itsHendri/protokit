import { Footnote } from '@/components/kit/footnote';
import { PromoCard } from '@/components/kit/promo-card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import type { ComponentType } from 'react';
import { View } from 'react-native';

function StickyBottomBarDemo() {
  return (
    <View className="border-border w-full gap-3 overflow-hidden rounded-lg border">
      <View className="bg-muted/40 h-16 items-center justify-center">
        <Text className="text-muted-foreground text-sm">scrolling content</Text>
      </View>
      <StickyBottomBar className="pb-3">
        <Button variant="outline">
          <Text>Sell</Text>
        </Button>
        <Button>
          <Text>Buy</Text>
        </Button>
      </StickyBottomBar>
    </View>
  );
}


function PromoCardDemo() {
  const [dismissed, setDismissed] = React.useState(false);
  return (
    <View className="w-full gap-3">
      {dismissed ? (
        <Button size="sm" variant="outline" onPress={() => setDismissed(false)}>
          <Text>Bring it back</Text>
        </Button>
      ) : (
        <PromoCard
          title="Earn more on your everyday balance"
          body="Set up a direct deposit and unlock a higher rate. Terms apply."
          action={{ label: 'Learn about the higher rate', onPress: () => {} }}
          onDismiss={() => setDismissed(true)}
          seed="promo-rate"
        />
      )}
      <PromoCard title="Your statement is ready" body="March 2026 is available to download." tone="muted" seed="promo-statement" />
    </View>
  );
}

function FootnoteDemo() {
  return (
    <Footnote action={{ label: 'Learn more', onPress: () => {} }}>
      Rates shown are indicative and may change. This is a prototype — nothing here is a real financial product.
    </Footnote>
  );
}

/** Kitchen Sink demos, keyed by the component id in registry/components.ts. */
export const KIT_LAYOUT_DEMOS: Record<string, ComponentType> = {
  'sticky-bottom-bar': StickyBottomBarDemo,
  'promo-card': PromoCardDemo,
  'footnote': FootnoteDemo,
};
