import { SearchField } from '@/components/kit/search-field';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { DevKitSection } from './DevKitSection';
import { matchesQuery } from './registry';
import type { CategoryDef, Section } from './types';
import { ChevronDownIcon } from 'lucide-react-native';
import * as React from 'react';
import { type LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';

type Props<Id extends string> = {
  categories: CategoryDef<Id>[];
  sections: Section<Id>[];
  searchPlaceholder: string;
  /** Category to open and scroll to on mount (deep links). Everything else starts collapsed. */
  focus?: Id;
};

/**
 * One scrollable page: search on top, one disclosure per category, only one open at a time.
 * Typing collapses everything into a flat result list. No nested screens, no layout animations
 * (long previews inside animated accordions made scrolling unreliable on device).
 */
export function DevKitHub<Id extends string>({ categories, sections, searchPlaceholder, focus }: Props<Id>) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState<Id | null>(focus ?? null);
  const scrollRef = React.useRef<ScrollView>(null);
  const offsets = React.useRef<Record<string, number>>({});
  const [pending, setPending] = React.useState<Id | null>(focus ?? null);
  const trimmed = query.trim();

  const results = React.useMemo(() => (trimmed ? sections.filter((s) => matchesQuery(s, trimmed)) : []), [sections, trimmed]);
  const byCategory = React.useMemo(() => {
    const map = new Map<Id, Section<Id>[]>();
    for (const s of sections) map.set(s.category, [...(map.get(s.category) ?? []), s]);
    return map;
  }, [sections]);

  const toggle = (id: Id) => {
    haptic('selection');
    setOpen((cur) => (cur === id ? null : id));
    // Scroll once the new layout is in, not on a timer: closing the previously open
    // category moves everything below it, so any offset read now is already stale.
    if (open !== id) setPending(id);
  };

  return (
    <ScrollView
      ref={scrollRef}
      className="bg-background flex-1"
      contentContainerClassName="pb-16"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentInsetAdjustmentBehavior="automatic">
      <View className="px-5 pb-3 pt-3">
        <SearchField value={query} onChangeText={setQuery} placeholder={searchPlaceholder} />
      </View>

      {trimmed ? (
        results.length ? (
          results.map((s) => <DevKitSection key={`${s.category}-${s.id}`} section={s} />)
        ) : (
          <Text className="text-muted-foreground p-5">No matches. Search covers titles and aliases.</Text>
        )
      ) : (
        categories.map((cat) => {
          const items = byCategory.get(cat.id) ?? [];
          const isOpen = open === cat.id;
          return (
            <View
              key={cat.id}
              onLayout={(e: LayoutChangeEvent) => {
                const y = e.nativeEvent.layout.y;
                offsets.current[cat.id] = y;
                if (pending === cat.id) {
                  scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
                  setPending(null);
                }
              }}
              className="border-border border-b">
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                onPress={() => toggle(cat.id)}
                className={cn('min-h-16 flex-row items-center gap-3 px-5 py-3 active:bg-accent', isOpen && 'bg-muted/40')}>
                <View className="bg-muted size-10 items-center justify-center rounded-lg">
                  <Icon as={cat.icon} size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold">{cat.label}</Text>
                  <Text className="text-muted-foreground text-sm">{cat.blurb}</Text>
                </View>
                <Badge variant="secondary">
                  <Text>{items.length}</Text>
                </Badge>
                <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                  <Icon as={ChevronDownIcon} size={18} className="text-muted-foreground" />
                </View>
              </Pressable>
              {isOpen ? items.map((s) => <DevKitSection key={s.id} section={s} />) : null}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
