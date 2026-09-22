import { CATEGORIES, CATEGORY_LABEL, isCategoryId } from '@/components/devkit/categories';
import { DevKitSection } from '@/components/devkit/DevKitSection';
import { sectionsForCategory } from '@/components/devkit/registry';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

/** One category on its own page — the deep-link target (/kitchen-sink/inputs). */
export default function CategoryPage() {
  const { category } = useLocalSearchParams<{ category: string }>();
  if (!isCategoryId(category)) {
    return (
      <View className="bg-background flex-1 p-5">
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text className="text-muted-foreground">
          No category “{category}”. Try one of: {CATEGORIES.map((c) => c.id).join(', ')}.
        </Text>
      </View>
    );
  }
  const sections = sectionsForCategory(category);
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="pb-16" contentInsetAdjustmentBehavior="automatic">
      <Stack.Screen options={{ title: CATEGORY_LABEL[category] }} />
      {sections.map((s) => (
        <DevKitSection key={s.id} section={s} />
      ))}
    </ScrollView>
  );
}
