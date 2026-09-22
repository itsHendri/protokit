import '@/global.css';

import { NotifyProvider } from '@/components/kit/notify';
import { ToastProvider } from '@/components/kit/toast';
import { NativeModeProvider } from '@/lib/native-context';
import { KitThemeProvider, useKitTheme } from '@/lib/theme-context';
import { NAV_THEME } from '@/lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider as NavThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KitThemeProvider>
        <NativeModeProvider>
          <AppShell />
        </NativeModeProvider>
      </KitThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppShell() {
  const { scheme } = useKitTheme();

  return (
    <NavThemeProvider value={NAV_THEME[scheme]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ToastProvider>
        <NotifyProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(kit)" />
            <Stack.Screen name="(shop)" />
            <Stack.Screen name="(habits)" />
          </Stack>
          <PortalHost />
        </NotifyProvider>
      </ToastProvider>
    </NavThemeProvider>
  );
}
