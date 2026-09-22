import { HorizontalPager } from '@/components/kit/horizontal-pager';
import { PagerDots } from '@/components/kit/pager-dots';
import { SectionHeader } from '@/components/kit/section-header';
import { Stepper } from '@/components/kit/stepper';
import { TabIcon } from '@/components/kit/tab-icon';
import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { HouseIcon, ListIcon, SettingsIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function TabIconDemo() {
  const { scheme } = useKitTheme();
  const c = THEME[scheme];
  return (
    <View className="bg-card border-border w-full flex-row justify-around rounded-lg border py-3">
      {[
        ['Home', HouseIcon, true],
        ['Activity', ListIcon, false],
        ['Settings', SettingsIcon, false],
      ].map(([label, icon, focused]) => (
        <View key={label as string} className="items-center gap-1">
          <TabIcon icon={icon as typeof HouseIcon} color={focused ? c.primary : c.mutedForeground} size={24} focused={focused as boolean} />
          <Text className={(focused ? "text-primary" : "text-muted-foreground") + " text-[11px] font-medium"}>{label as string}</Text>
        </View>
      ))}
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
  const [i, setI] = React.useState(1);
  return (
    <View className="items-center gap-3">
      <PagerDots count={4} activeIndex={i} />
      <Text className="text-muted-foreground text-sm" onPress={() => setI((n) => (n + 1) % 4)}>
        Tap to advance
      </Text>
    </View>
  );
}

function HorizontalPagerDemo() {
  return (
    <View className="-mx-5 w-[calc(100%+40px)]">
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
  { id: 'tab-icon', title: 'Tab bar icon', category: 'navigation', aliases: ['bottom tabs', 'tab bar', 'active dot', 'navigation bar'], api: '<Tabs.Screen options={{ tabBarIcon: (p) => <TabIcon {...p} icon={HouseIcon} /> }} />', caption: 'Use with Expo Router Tabs and explicit tabBarActiveTintColor / tabBarInactiveTintColor (see app/(kit)/_layout.tsx). The dot marks the active tab without relying on colour alone.', Demo: TabIconDemo },
  { id: 'stepper', title: 'Stepper', category: 'navigation', aliases: ['progress steps', 'wizard', 'onboarding progress'], api: '<Stepper current total labels? variant="numbered|compact" />', Demo: StepperDemo },
  { id: 'section-header', title: 'Section header', category: 'navigation', aliases: ['title', 'see all', 'heading row'], api: '<SectionHeader title action? onAction? />', caption: 'Sits outside the card it introduces.', Demo: SectionHeaderDemo },
  { id: 'pager-dots', title: 'Pager dots', category: 'navigation', aliases: ['page indicator', 'carousel dots'], api: '<PagerDots count activeIndex />', Demo: PagerDotsDemo },
  { id: 'horizontal-pager', title: 'Horizontal pager', category: 'navigation', aliases: ['carousel', 'swipe', 'slides', 'banner'], api: '<HorizontalPager itemWidth gap? showDots? onIndexChange?>{cards}</HorizontalPager>', Demo: HorizontalPagerDemo },
];
