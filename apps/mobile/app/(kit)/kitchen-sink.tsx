import { CATEGORIES, isCategoryId } from '@/components/devkit/categories';
import { DevKitHub } from '@/components/devkit/DevKitHub';
import { SECTIONS } from '@/components/devkit/registry';
import { useLocalSearchParams } from 'expo-router';

/**
 * The Kitchen Sink: every component the kit ships, grouped by function, searchable.
 * Deep link: /kitchen-sink?open=inputs (or protokit://kitchen-sink?open=inputs) expands a category.
 */
export default function KitchenSink() {
  const { open } = useLocalSearchParams<{ open?: string }>();
  return (
    <DevKitHub
      key={open ?? 'default'}
      categories={CATEGORIES}
      sections={SECTIONS}
      searchPlaceholder="Search components"
      focus={isCategoryId(open) ? open : undefined}
    />
  );
}
