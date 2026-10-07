import '@/global.css';

import { NotifyProvider } from '@/components/kit/notify';
import { ToastProvider } from '@/components/kit/toast';
import { NativeModeProvider } from '@/lib/native-context';
import { PaletteProvider, useNavTheme } from '@/lib/palette-context';
import { KitThemeProvider, useKitTheme } from '@/lib/theme-context';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider as NavThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

/**
 * The kit shell is home. Without this the sample groups also match "/" and one of
 * them wins, so scanning the QR drops you into a sample instead of the kit.
 */
export const unstable_settings = { initialRouteName: '(kit)' };

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KitThemeProvider>
        <PaletteProvider>
          <NativeModeProvider>
            <AppShell />
          </NativeModeProvider>
        </PaletteProvider>
      </KitThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppShell() {
  const { scheme } = useKitTheme();
  const navTheme = useNavTheme();

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ToastProvider>
        <NotifyProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(kit)" />
            <Stack.Screen name="shop" />
            <Stack.Screen name="habits" />
          </Stack>
          <PortalHost />
        </NotifyProvider>
      </ToastProvider>
    </NavThemeProvider>
  );
}
