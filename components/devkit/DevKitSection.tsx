import type { Section } from './types';
import { Text, TextClassContext } from '@/components/ui/text';
import { View } from 'react-native';

/**
 * One labelled preview: uppercase title, then the demo.
 * `api` and `caption` stay in the registry data for the docs and for agents reading the
 * registry — the preview shows the component, not prose about it.
 */
export function DevKitSection({ section }: { section: Section }) {
  const { Demo } = section;
  return (
    <View className="border-border gap-3 border-t px-5 py-5">
      <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">{section.title}</Text>
      <TextClassContext.Provider value={undefined}>
        <View className="items-stretch">
          <Demo />
        </View>
      </TextClassContext.Provider>
    </View>
  );
}
