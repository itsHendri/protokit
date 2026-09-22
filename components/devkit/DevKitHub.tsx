import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { DevKitSection } from './DevKitSection';
import { matchesQuery } from './registry';
import type { CategoryDef, Section } from './types';
import { SearchIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

type Props<Id extends string> = {
  categories: CategoryDef<Id>[];
  sections: Section<Id>[];
  searchPlaceholder: string;
  /** Category ids to open on first render (e.g. from a deep link). */
  initialOpen?: Id[];
};

/**
 * A single scrollable page: search on top, one accordion per category below.
 * Typing collapses everything into a flat cross-category result list.
 */
export function DevKitHub<Id extends string>({
  categories,
  sections,
  searchPlaceholder,
  initialOpen = [],
}: Props<Id>) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState<string[]>(initialOpen);
  const trimmed = query.trim();

  const results = React.useMemo(
    () => (trimmed ? sections.filter((s) => matchesQuery(s, trimmed)) : []),
    [sections, trimmed]
  );

  const byCategory = React.useMemo(() => {
    const map = new Map<Id, Section<Id>[]>();
    for (const s of sections) map.set(s.category, [...(map.get(s.category) ?? []), s]);
    return map;
  }, [sections]);

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerClassName="pb-16"
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic">
      <View className="px-5 pb-2 pt-4">
        <View className="relative justify-center">
          <View className="absolute left-3 z-10">
            <Icon as={SearchIcon} className="text-muted-foreground" size={16} />
          </View>
          <Input
            className="pl-9"
            placeholder={searchPlaceholder}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
        {trimmed ? (
          <Text className="text-muted-foreground mt-2 text-sm">
            {results.length} match{results.length === 1 ? '' : 'es'} for “{trimmed}”
          </Text>
        ) : null}
      </View>

      {trimmed ? (
        results.length ? (
          results.map((s) => <DevKitSection key={`${s.category}-${s.id}`} section={s} />)
        ) : (
          <Text className="text-muted-foreground p-5">No matches. Try another term.</Text>
        )
      ) : (
        <Accordion type="multiple" value={open} onValueChange={setOpen} className="w-full">
          {categories.map((cat) => {
            const items = byCategory.get(cat.id) ?? [];
            return (
              <AccordionItem key={cat.id} value={cat.id} className="px-5">
                <AccordionTrigger>
                  <View className="flex-1 flex-row items-center gap-3">
                    <Icon as={cat.icon} className="text-primary" size={20} />
                    <View className="flex-1">
                      <Text className="font-semibold">{cat.label}</Text>
                      <Text className="text-muted-foreground text-sm">{cat.blurb}</Text>
                    </View>
                    <Text className="text-muted-foreground mr-2 text-sm font-medium">{items.length}</Text>
                  </View>
                </AccordionTrigger>
                <AccordionContent className="-mx-5">
                  {items.map((s) => (
                    <DevKitSection key={s.id} section={s} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </ScrollView>
  );
}
