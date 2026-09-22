import '@/global.css';

import { KitThemeProvider, useKitTheme } from '@/lib/theme-context';
import { NAV_THEME } from '@/lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider as NavThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <KitThemeProvider>
      <AppShell />
    </KitThemeProvider>
  );
}

function AppShell() {
  const { scheme } = useKitTheme();

  return (
    <NavThemeProvider value={NAV_THEME[scheme]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(kit)" />
      </Stack>
      <PortalHost />
    </NavThemeProvider>
  );
}
