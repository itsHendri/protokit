import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
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

export const KIT_LAYOUT_SECTIONS: ComponentSection[] = [
  { id: 'sticky-bottom-bar', title: 'Sticky bottom bar', category: 'layout', aliases: ['cta bar', 'footer actions', 'safe area'], api: '<StickyBottomBar transparent?>{buttons}</StickyBottomBar>', caption: 'Render after the ScrollView; give the scroll content pb-32. Children share the width equally.', Demo: StickyBottomBarDemo },
];
