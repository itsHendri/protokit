import { FAB } from '@/components/kit/fab';
import { SwipeToConfirm } from '@/components/kit/swipe-to-confirm';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { PlusIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function FABDemo() {
  return (
    <View className="flex-row flex-wrap items-center gap-4">
      <FAB icon={PlusIcon} accessibilityLabel="Add" />
      <FAB icon={PlusIcon} label="New item" />
      <FAB icon={PlusIcon} label="Secondary" variant="secondary" />
    </View>
  );
}

function SwipeToConfirmDemo() {
  const [count, setCount] = React.useState(0);
  const [key, setKey] = React.useState(0);
  return (
    <View className="w-full gap-3">
      <SwipeToConfirm key={key} label="Slide to send $120.50" onConfirm={() => setCount((c) => c + 1)} />
      <SwipeToConfirm key={key + 1000} label="Slide to delete" confirmLabel="Deleted" tone="destructive" onConfirm={() => setCount((c) => c + 1)} />
      <View className="flex-row items-center gap-3">
        <Button size="sm" variant="outline" onPress={() => setKey((k) => k + 1)}>
          <Text>Reset</Text>
        </Button>
        <Text className="text-muted-foreground text-sm">Confirmed {count}×</Text>
      </View>
    </View>
  );
}

export const KIT_ACTIONS_SECTIONS: ComponentSection[] = [
  {
    id: 'fab',
    title: 'FAB',
    category: 'actions',
    aliases: ['floating action button', 'plus', 'extended'],
    api: '<FAB icon label? variant="primary|secondary" position="inline|bottom-right|bottom-center" />',
    caption: 'One per screen, for the single most important action.',
    Demo: FABDemo,
  },
  {
    id: 'swipe-to-confirm',
    title: 'Swipe to confirm',
    category: 'actions',
    aliases: ['slide', 'drag', 'commit', 'high stakes'],
    api: '<SwipeToConfirm label onConfirm confirmLabel? tone="primary|destructive" />',
    caption: 'For irreversible actions (send money, delete account). Reset by changing its key.',
    Demo: SwipeToConfirmDemo,
  },
];
