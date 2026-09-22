import { TabIcon } from '@/components/kit/tab-icon';
import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { Tabs } from 'expo-router';
import { HouseIcon, ListIcon, SettingsIcon } from 'lucide-react-native';

export default function SampleTabs() {
  const { scheme } = useKitTheme();
  const colors = THEME[scheme];
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: (p) => <TabIcon {...p} icon={HouseIcon} /> }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: (p) => <TabIcon {...p} icon={ListIcon} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: (p) => <TabIcon {...p} icon={SettingsIcon} /> }} />
    </Tabs>
  );
}
