import { Placeholder } from '@/components/kit/placeholder';
import { Spot } from '@/components/kit/spot';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { BellIcon, LockIcon, ShieldCheckIcon, UserIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import type { ComponentSection } from '../types';

function PlaceholderDemo() {
  const [round, setRound] = React.useState(0);
  const seeds = ['arc lamp', 'headphones', 'tote bag', 'planter'].map((s) => `${s}-${round}`);
  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">
        {seeds.slice(0, 3).map((seed) => (
          <View key={seed} className="flex-1">
            <Placeholder seed={seed} />
          </View>
        ))}
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Placeholder seed={seeds[3]} ratio={16 / 9} palette="mono" />
        </View>
        <View className="flex-1">
          <Placeholder seed={seeds[0]} ratio={16 / 9} palette="primary" />
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <Button size="sm" variant="outline" onPress={() => setRound((r) => r + 1)}>
          <Text>New seeds</Text>
        </Button>
        <Text className="text-muted-foreground text-sm">The same seed always draws the same art.</Text>
      </View>
    </View>
  );
}

function SpotDemo() {
  return (
    <View className="w-full gap-4">
      <View className="flex-row flex-wrap items-center gap-4">
        <Spot icon={BellIcon} size="md" />
        <Spot icon={LockIcon} size="md" shape="square" />
        <Spot icon={ShieldCheckIcon} size="md" tone="success" />
        <Spot icon={UserIcon} size="md" tone="info" />
      </View>
      <View className="flex-row flex-wrap items-center gap-4">
        <Spot icon={BellIcon} size="lg" tone="warning" />
        <Spot icon={ShieldCheckIcon} size="md" tone="primary" ring />
      </View>
    </View>
  );
}

export const KIT_MEDIA_SECTIONS: ComponentSection[] = [
  {
    id: 'placeholder',
    title: 'Placeholder',
    category: 'media',
    aliases: ['generated art', 'stand-in image', 'seeded', 'mock image', 'abstract'],
    api: '<Placeholder seed ratio? palette="chart|mono|primary" icon? />',
    caption: 'Stand-in imagery that never 404s. Drawn from theme colours, so it follows light/dark and re-brands with the tokens — use it instead of shipping placeholder files.',
    Demo: PlaceholderDemo,
  },
  {
    id: 'spot',
    title: 'Spot',
    category: 'media',
    aliases: ['illustration', 'icon well', 'hero icon', 'empty state art'],
    api: '<Spot icon size="md|lg|xl" tone? shape="circle|square" ring? />',
    caption: 'The whole illustration vocabulary: an icon at display scale. EmptyState, SuccessScreen and PermissionPrimer all render one. For a row’s leading slot use IconCircle — the boundary is 44px.',
    Demo: SpotDemo,
  },
];
