import { ThemeToggle } from '@/components/devkit/ThemeToggle';
import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
import { BlocksIcon, HouseIcon, SettingsIcon, SwatchBookIcon } from 'lucide-react-native';

/**
 * The kit shell. A real prototype replaces these tabs with its own navigation;
 * until then this is the designer-facing browser for everything the kit ships.
 */
export default function KitLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <ThemeToggle />,
        tabBarLabelStyle: { fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Kit',
          tabBarIcon: ({ color, size }) => <Icon as={HouseIcon} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="kitchen-sink"
        options={{
          title: 'Components',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon as={BlocksIcon} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="foundations"
        options={{
          title: 'Foundations',
          tabBarIcon: ({ color, size }) => <Icon as={SwatchBookIcon} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon as={SettingsIcon} color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
