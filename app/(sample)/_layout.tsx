import { Stack } from 'expo-router';

/**
 * The sample app: a worked example of assembling screens from the kit.
 * Delete app/(sample) and components/sample when starting a real project.
 */
export default function SampleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="activity/[id]" options={{ headerShown: true, title: 'Transaction' }} />
      <Stack.Screen name="send" options={{ presentation: 'modal', headerShown: true, title: 'Send money' }} />
    </Stack>
  );
}
