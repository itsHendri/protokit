import { Footnote } from '@/components/kit/footnote';
import { PromoCard } from '@/components/kit/promo-card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import type { ComponentSection } from '../types';
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

export const KIT_LAYOUT_SECTIONS: ComponentSection[] = [
  { id: 'sticky-bottom-bar', title: 'Sticky bottom bar', category: 'layout', aliases: ['cta bar', 'footer actions', 'safe area'], api: '<StickyBottomBar transparent?>{buttons}</StickyBottomBar>', caption: 'Render after the ScrollView; give the scroll content pb-32. Children share the width equally.', Demo: StickyBottomBarDemo },
  { id: 'promo-card', title: 'Promo card', category: 'layout', aliases: ['banner', 'upsell', 'announcement', 'offer', 'nudge'], api: '<PromoCard title body? action? onDismiss? tone? seed? icon? />', caption: 'At most one per screen, and dismissible whenever it is promotional rather than required. The art is generated from the seed, so it needs no asset.', Demo: PromoCardDemo },
  { id: 'footnote', title: 'Footnote', category: 'layout', aliases: ['small print', 'legal', 'disclosure', 'terms', 'learn more'], api: '<Footnote action?>{copy}</Footnote>', caption: 'Disclosures at the foot of a screen. Keep it last in the scroll, after the final section.', Demo: FootnoteDemo },
];
