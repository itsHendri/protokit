import { ActionGrid } from '@/components/kit/action-grid';
import { FloatingButton } from '@/components/kit/floating-button';
import { IconBadge } from '@/components/kit/icon-badge';
import { SwipeToConfirm } from '@/components/kit/swipe-to-confirm';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ArrowUpRightIcon, BellIcon, EllipsisIcon, FileTextIcon, MailIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react-native';
import type { ComponentSection } from '../types';
import * as React from 'react';
import { View } from 'react-native';

function FloatingButtonDemo() {
  return (
    <View className="flex-row flex-wrap items-center gap-4">
      <FloatingButton icon={PlusIcon} accessibilityLabel="Add" />
      <FloatingButton icon={PlusIcon} label="New item" />
      <FloatingButton icon={PlusIcon} label="Secondary" variant="secondary" />
    </View>
  );
}

function IconBadgeDemo() {
  return (
    <View className="flex-row items-center gap-2">
      <IconBadge icon={BellIcon} count={3} accessibilityLabel="Notifications" />
      <IconBadge icon={MailIcon} count={120} accessibilityLabel="Inbox" />
      <IconBadge icon={ShoppingCartIcon} dot accessibilityLabel="Cart" />
      <IconBadge icon={BellIcon} accessibilityLabel="Notifications, none" />
    </View>
  );
}

function SwipeToConfirmDemo() {
  const [key, setKey] = React.useState(0);
  return (
    <View className="w-full gap-3">
      <SwipeToConfirm key={key} label="Slide to proceed" onConfirm={() => {}} />
      <SwipeToConfirm key={key + 1000} label="Slide to delete" confirmLabel="Deleted" tone="destructive" onConfirm={() => {}} />
      <Button variant="outline" onPress={() => setKey((k) => k + 1)}>
        <Text>Reset</Text>
      </Button>
    </View>
  );
}


function ActionGridDemo() {
  const [last, setLast] = React.useState('nothing yet');
  return (
    <View className="w-full gap-3">
      <ActionGrid
        items={[
          { icon: PlusIcon, label: 'Add funds', onPress: () => setLast('Add funds') },
          { icon: FileTextIcon, label: 'Pay a bill', onPress: () => setLast('Pay a bill') },
          { icon: ArrowUpRightIcon, label: 'Send', onPress: () => setLast('Send') },
          { icon: EllipsisIcon, label: 'More', badge: true, onPress: () => setLast('More') },
        ]}
      />
      <Text className="text-muted-foreground text-sm">Tapped: {last}</Text>
    </View>
  );
}

export const KIT_ACTIONS_SECTIONS: ComponentSection[] = [
  {
    id: 'floating-button',
    title: 'Floating button',
    category: 'actions',
    aliases: ['fab', 'floating action button', 'plus', 'extended', 'add button'],
    api: '<FloatingButton icon label? variant="primary|secondary" position="inline|bottom-right|bottom-center" />',
    caption: 'Floats over the scroll instead of sitting in it, so the screen\u2019s one most important action stays reachable however far down you are. A Button flows with the content; this does not. Material calls it a FAB. One per screen.',
    Demo: FloatingButtonDemo,
  },
  {
    id: 'icon-badge',
    title: 'Icon badge',
    category: 'actions',
    aliases: ['notification', 'bell', 'cart', 'unread count', 'icon button'],
    api: '<IconBadge icon count? dot? accessibilityLabel />',
    caption: 'Header icon button with an unread count. The label announces the count for screen readers.',
    Demo: IconBadgeDemo,
  },
  {
    id: 'swipe-to-confirm',
    title: 'Swipe to confirm',
    category: 'actions',
    aliases: ['slide', 'drag', 'commit', 'high stakes'],
    api: '<SwipeToConfirm label onConfirm confirmLabel? tone="primary|destructive" />',
    caption: 'For irreversible actions (submit, delete, pay). Reset by changing its key.',
    Demo: SwipeToConfirmDemo,
  },
  { id: 'action-grid', title: 'Action grid', category: 'actions', aliases: ['quick actions', 'shortcuts', 'tiles', 'icon buttons'], api: '<ActionGrid items={[{icon,label,onPress,badge?}]} />', caption: 'The row of shortcuts under a screen hero. Keep it to one row — the last tile should be "More", not a second row.', Demo: ActionGridDemo },
];
