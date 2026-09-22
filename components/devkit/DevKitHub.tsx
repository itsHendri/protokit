import { SearchField } from '@/components/kit/search-field';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DevKitSection } from './DevKitSection';
import { matchesQuery } from './registry';
import type { CategoryDef, Section } from './types';
import * as React from 'react';
import { type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';

type Props<Id extends string> = {
  categories: CategoryDef<Id>[];
  sections: Section<Id>[];
  searchPlaceholder: string;
  /** Category ids open on first render. */
  initialOpen?: Id[];
  /** Category to scroll into view on mount (deep links). */
  focus?: Id;
};

/**
 * One scrollable page: search on top, one accordion per category. Typing collapses everything
 * into a flat result list. This is the whole browsing model — no nested screens.
 */
export function DevKitHub<Id extends string>({ categories, sections, searchPlaceholder, initialOpen = [], focus }: Props<Id>) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState<string[]>(initialOpen);
  const scrollRef = React.useRef<ScrollView>(null);
  const offsets = React.useRef<Record<string, number>>({});
  const trimmed = query.trim();
  const allOpen = open.length === categories.length;

  // The caller remounts the hub (key) when `focus` changes, so initialOpen already holds it;
  // this effect only scrolls the focused category into view once layout has settled.
  React.useEffect(() => {
    if (!focus) return;
    const t = setTimeout(() => {
      const y = offsets.current[focus];
      if (y != null) scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    }, 250);
    return () => clearTimeout(t);
  }, [focus]);

  const results = React.useMemo(() => (trimmed ? sections.filter((s) => matchesQuery(s, trimmed)) : []), [sections, trimmed]);

  const byCategory = React.useMemo(() => {
    const map = new Map<Id, Section<Id>[]>();
    for (const s of sections) map.set(s.category, [...(map.get(s.category) ?? []), s]);
    return map;
  }, [sections]);

  return (
    <ScrollView
      ref={scrollRef}
      className="bg-background flex-1"
      contentContainerClassName="pb-16"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentInsetAdjustmentBehavior="automatic">
      <View className="gap-2 px-5 pb-1 pt-3">
        <SearchField value={query} onChangeText={setQuery} placeholder={searchPlaceholder} />
        <View className="h-6 flex-row items-center justify-between">
          <Text className="text-muted-foreground text-xs">
            {trimmed ? `${results.length} match${results.length === 1 ? '' : 'es'} for “${trimmed}”` : `${sections.length} items in ${categories.length} categories`}
          </Text>
          {!trimmed ? (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setOpen(allOpen ? [] : categories.map((c) => c.id))}>
              <Text className="text-primary text-xs font-medium">{allOpen ? 'Collapse all' : 'Expand all'}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {trimmed ? (
        results.length ? (
          results.map((s) => <DevKitSection key={`${s.category}-${s.id}`} section={s} />)
        ) : (
          <Text className="text-muted-foreground p-5">No matches. Try a different word — search covers titles and aliases.</Text>
        )
      ) : (
        <Accordion type="multiple" value={open} onValueChange={setOpen} className="w-full">
          {categories.map((cat) => {
            const items = byCategory.get(cat.id) ?? [];
            const isOpen = open.includes(cat.id);
            return (
              <View key={cat.id} onLayout={(e: LayoutChangeEvent) => (offsets.current[cat.id] = e.nativeEvent.layout.y)}>
                <AccordionItem value={cat.id} className="px-5">
                  <AccordionTrigger>
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className={isOpen ? 'bg-primary/15 size-9 items-center justify-center rounded-lg' : 'bg-muted size-9 items-center justify-center rounded-lg'}>
                        <Icon as={cat.icon} className={isOpen ? 'text-primary' : 'text-foreground'} size={18} />
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold">{cat.label}</Text>
                        <Text className="text-muted-foreground text-sm">{cat.blurb}</Text>
                      </View>
                      <Text className="text-muted-foreground mr-2 text-sm">{items.length}</Text>
                    </View>
                  </AccordionTrigger>
                  <AccordionContent className="-mx-5">
                    {items.map((s) => (
                      <DevKitSection key={s.id} section={s} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </View>
            );
          })}
        </Accordion>
      )}
    </ScrollView>
  );
}
