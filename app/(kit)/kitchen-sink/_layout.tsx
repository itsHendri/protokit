import { ThemeToggle } from '@/components/devkit/ThemeToggle';
import { Stack } from 'expo-router';

export default function KitchenSinkLayout() {
  return (
    <Stack screenOptions={{ headerRight: () => <ThemeToggle /> }}>
      <Stack.Screen name="index" options={{ title: 'Components' }} />
      <Stack.Screen name="[category]" options={{ title: '' }} />
    </Stack>
  );
}
