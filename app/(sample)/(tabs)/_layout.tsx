import { TabBar, tabIcon } from '@/components/kit/tab-bar';
import { Tabs } from 'expo-router';
import { HouseIcon, ListIcon, SettingsIcon } from 'lucide-react-native';

export default function SampleTabs() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: tabIcon(HouseIcon) }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: tabIcon(ListIcon) }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: tabIcon(SettingsIcon) }} />
    </Tabs>
  );
}
