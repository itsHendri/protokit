import { ThemeToggle } from '@/components/devkit/ThemeToggle';
import { THEME } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { Tabs } from 'expo-router';
import { TabIcon } from '@/components/kit/tab-icon';
import { BlocksIcon, HouseIcon, SettingsIcon, SwatchBookIcon } from 'lucide-react-native';

/**
 * The kit shell. A real prototype replaces these tabs with its own navigation;
 * until then this is the designer-facing browser for everything the kit ships.
 */
export default function KitLayout() {
  const { scheme } = useKitTheme();
  const colors = THEME[scheme];
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <ThemeToggle />,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        // Explicit, opaque tints: the default inactive tint is derived with alpha, which
        // shows as darker patches wherever icon strokes overlap.
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Kit', tabBarIcon: (p) => <TabIcon {...p} icon={HouseIcon} /> }} />
      <Tabs.Screen name="kitchen-sink" options={{ title: 'Components', tabBarIcon: (p) => <TabIcon {...p} icon={BlocksIcon} /> }} />
      <Tabs.Screen name="foundations" options={{ title: 'Foundations', tabBarIcon: (p) => <TabIcon {...p} icon={SwatchBookIcon} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: (p) => <TabIcon {...p} icon={SettingsIcon} /> }} />
    </Tabs>
  );
}

