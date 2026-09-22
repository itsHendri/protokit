import { EmptyState } from '@/components/kit/empty-state';
import { FilterChip, FilterChipRow } from '@/components/kit/filter-chip';
import { IconCircle } from '@/components/kit/icon-circle';
import { ListRow } from '@/components/kit/list-row';
import { SearchField } from '@/components/kit/search-field';
import { money, TRANSACTIONS, type Transaction } from '@/components/sample/data';
import { Card } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { ArrowDownLeftIcon, ArrowUpRightIcon, SearchXIcon, ShoppingBagIcon, TvIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const CATEGORY_ICON = { transfer: ArrowUpRightIcon, income: ArrowDownLeftIcon, shopping: ShoppingBagIcon, subscription: TvIcon } as const;
const FILTERS: { value: 'all' | Transaction['category']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'transfer', label: 'Transfers' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'income', label: 'Income' },
  { value: 'subscription', label: 'Subscriptions' },
];

export default function Activity() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]['value']>('all');
  const items = TRANSACTIONS.filter((t) => (filter === 'all' || t.category === filter) && t.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-4 pb-16 pt-4" keyboardShouldPersistTaps="handled">
      <View className="px-5">
        <SearchField value={query} onChangeText={setQuery} placeholder="Search activity" />
      </View>
      <FilterChipRow>
        {FILTERS.map((f) => (
          <FilterChip key={f.value} label={f.label} selected={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </FilterChipRow>
      <View className="px-5">
        {items.length ? (
          <Card className="w-full gap-0 px-4 py-0">
            {items.map((t, i) => (
              <ListRow
                key={t.id}
                leading={<IconCircle as={CATEGORY_ICON[t.category]} />}
                title={t.title}
                subtitle={t.subtitle}
                value={money(t.amount, true)}
                valueClassName={t.amount > 0 ? 'text-success' : undefined}
                chevron
                onPress={() => router.push({ pathname: '/(sample)/activity/[id]', params: { id: t.id } })}
                last={i === items.length - 1}
              />
            ))}
          </Card>
        ) : (
          <Card className="w-full py-0">
            <EmptyState variant="compact" icon={SearchXIcon} title="No matching activity" subtitle="Try another search or filter." action={{ label: 'Clear', onPress: () => { setQuery(''); setFilter('all'); } }} />
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
