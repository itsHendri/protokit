import { HorizontalPager } from '@/components/kit/horizontal-pager';
import { PagerDots } from '@/components/kit/pager-dots';
import { SectionHeader } from '@/components/kit/section-header';
import { Stepper } from '@/components/kit/stepper';
import { TabBarItem, tabIcon } from '@/components/kit/tab-bar';
import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { HouseIcon, ListIcon, SettingsIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

function TabBarDemo() {
  const { scheme } = useKitTheme();
  const c = THEME[scheme];
  const [active, setActive] = React.useState(0);
  const tabs = [
    { label: "Home", icon: HouseIcon },
    { label: "Activity", icon: ListIcon },
    { label: "Settings", icon: SettingsIcon },
  ];
  return (
    <View className="bg-background border-border w-full flex-row overflow-hidden rounded-lg border">
      {tabs.map((t, i) => {
        const focused = i === active;
        const color = focused ? c.primary : c.mutedForeground;
        return <TabBarItem key={t.label} label={t.label} focused={focused} color={color} icon={tabIcon(t.icon)({ focused, color, size: 24 })} onPress={() => setActive(i)} />;
      })}
    </View>
  );
}

function StepperDemo() {
  return (
    <View className="w-full gap-6">
      <Stepper current={2} total={4} labels={['Details', 'Verify', 'Review', 'Done']} />
      <Stepper current={3} total={5} variant="compact" />
    </View>
  );
}

function SectionHeaderDemo() {
  return (
    <View className="w-full gap-4">
      <SectionHeader title="Recent activity" action="See all" onAction={() => {}} />
      <SectionHeader title="Without action" />
    </View>
  );
}

function PagerDotsDemo() {
  const [i, setI] = React.useState(0);
  const slides = ['Welcome', 'Set up your profile', 'Invite your team', 'Done'];
  return (
    <View className="w-full items-center gap-3">
      <Pressable accessibilityRole="button" accessibilityLabel="Next slide" onPress={() => setI((n) => (n + 1) % slides.length)} className="bg-card border-border h-28 w-full items-center justify-center rounded-xl border active:opacity-80">
        <Text className="text-lg font-semibold">{slides[i]}</Text>
        <Text className="text-muted-foreground text-sm">Tap to advance · {i + 1} of {slides.length}</Text>
      </Pressable>
      <PagerDots count={slides.length} activeIndex={i} />
    </View>
  );
}

function HorizontalPagerDemo() {
  return (
    <View className="-mx-5">
      <HorizontalPager itemWidth={280}>
        {['Welcome', 'Track spending', 'Set goals'].map((t, i) => (
          <View key={t} className="bg-card border-border h-36 justify-end rounded-xl border p-4">
            <Text className="text-muted-foreground text-xs">Slide {i + 1}</Text>
            <Text className="text-lg font-semibold">{t}</Text>
          </View>
        ))}
      </HorizontalPager>
    </View>
  );
}

export const KIT_NAVIGATION_SECTIONS: ComponentSection[] = [
  { id: 'tab-bar', title: 'Tab bar', category: 'navigation', aliases: ['bottom tabs', 'tab bar', 'active dot', 'navigation bar', 'tab icon'], api: '<Tabs tabBar={(p) => <TabBar {...p} />}><Tabs.Screen options={{ title, tabBarIcon: tabIcon(HouseIcon) }} /></Tabs>', caption: 'The kit tab bar: opaque tints, label, and an active dot under the label so selection is not colour-only. TabBarItem is exported for custom bars.', Demo: TabBarDemo },
  { id: 'stepper', title: 'Stepper', category: 'navigation', aliases: ['progress steps', 'wizard', 'onboarding progress'], api: '<Stepper current total labels? variant="numbered|compact" />', Demo: StepperDemo },
  { id: 'section-header', title: 'Section header', category: 'navigation', aliases: ['title', 'see all', 'heading row'], api: '<SectionHeader title action? onAction? />', caption: 'Sits outside the card it introduces.', Demo: SectionHeaderDemo },
  { id: 'pager-dots', title: 'Pager dots', category: 'navigation', aliases: ['page indicator', 'carousel dots'], api: '<PagerDots count activeIndex />', Demo: PagerDotsDemo },
  { id: 'horizontal-pager', title: 'Horizontal pager', category: 'navigation', aliases: ['carousel', 'swipe', 'slides', 'banner'], api: '<HorizontalPager itemWidth gap? showDots? onIndexChange?>{cards}</HorizontalPager>', Demo: HorizontalPagerDemo },
];
