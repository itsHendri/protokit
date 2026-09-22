import { useCopy } from './copy';
import type { Section } from './types';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

/**
 * One labelled preview: uppercase title (tap to copy the API line), the demo, the API hint,
 * and a usage caption.
 */
export function DevKitSection({ section }: { section: Section }) {
  const { Demo } = section;
  const { copied, copy } = useCopy();
  return (
    <View className="border-border gap-3 border-t px-5 py-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Copy ${section.title} usage`}
        disabled={!section.api}
        onPress={() => section.api && copy(section.id, section.api)}
        className="flex-row items-center justify-between">
        <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">{section.title}</Text>
        {section.api ? <Text className="text-primary text-xs">{copied === section.id ? 'Copied' : 'Copy API'}</Text> : null}
      </Pressable>
      <View className="items-start">
        <Demo />
      </View>
      {section.api ? (
        <View className="bg-muted rounded-md px-3 py-2">
          <Text className="text-muted-foreground font-mono text-xs">{section.api}</Text>
        </View>
      ) : null}
      {section.caption ? <Text className="text-muted-foreground text-sm">{section.caption}</Text> : null}
    </View>
  );
}
