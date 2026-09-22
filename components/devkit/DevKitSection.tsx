import { Text } from '@/components/ui/text';
import type { Section } from './types';
import { View } from 'react-native';

/**
 * One labelled preview in the Kitchen Sink / Foundations: uppercase title, the demo,
 * an optional one-line API hint and a usage caption.
 */
export function DevKitSection({ section }: { section: Section }) {
  const { Demo } = section;
  return (
    <View className="gap-3 px-5 py-5">
      <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
        {section.title}
      </Text>
      <View className="items-start">
        <Demo />
      </View>
      {section.api ? (
        <View className="bg-muted rounded-md px-3 py-2">
          <Text className="text-muted-foreground font-mono text-xs">{section.api}</Text>
        </View>
      ) : null}
      {section.caption ? (
        <Text className="text-muted-foreground text-sm">{section.caption}</Text>
      ) : null}
    </View>
  );
}
