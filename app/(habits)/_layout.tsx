import { KitChip } from '@/components/kit/kit-chip';
import { Stack } from 'expo-router';

/** Habit tracker sample. Delete app/(habits) and components/habits when starting a real project. */
export default function HabitsLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="habit/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="new" options={{ presentation: 'modal', headerShown: true, title: 'New habit' }} />
      </Stack>
      <KitChip />
    </>
  );
}
