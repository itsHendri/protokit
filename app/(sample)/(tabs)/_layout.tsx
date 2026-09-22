import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
import { HouseIcon, ListIcon, SettingsIcon } from 'lucide-react-native';

export default function SampleTabs() {
  return (
    <Tabs screenOptions={{ tabBarLabelStyle: { fontSize: 11 } }}>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarIcon: ({ color, size }) => <Icon as={HouseIcon} color={color} size={size} /> }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: ({ color, size }) => <Icon as={ListIcon} color={color} size={size} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Icon as={SettingsIcon} color={color} size={size} /> }} />
    </Tabs>
  );
}
