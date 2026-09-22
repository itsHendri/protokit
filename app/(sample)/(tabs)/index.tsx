import { IconCircle } from '@/components/kit/icon-circle';
import { LineChart } from '@/components/kit/line-chart';
import { ListRow } from '@/components/kit/list-row';
import { PercentChange } from '@/components/kit/percent-change';
import { SectionHeader } from '@/components/kit/section-header';
import { StatTile } from '@/components/kit/stat-tile';
import { BALANCE, BALANCE_SERIES, money, TRANSACTIONS } from '@/components/sample/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowDownLeftIcon, ArrowUpRightIcon, PlusIcon, ShoppingBagIcon, TvIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORY_ICON = { transfer: ArrowUpRightIcon, income: ArrowDownLeftIcon, shopping: ShoppingBagIcon, subscription: TvIcon } as const;

export default function SampleHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recent = TRANSACTIONS.slice(0, 4);
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-5 px-5 pb-16" contentContainerStyle={{ paddingTop: insets.top + 16 }}>
      <View className="gap-1">
        <Text className="text-muted-foreground text-sm">Total balance</Text>
        <View className="flex-row items-baseline gap-3">
          <Text className="text-4xl font-bold">{money(BALANCE)}</Text>
          <PercentChange value={3.4} />
        </View>
      </View>

      <Card className="w-full gap-3 py-4">
        <View className="px-4">
          <LineChart data={BALANCE_SERIES} variant="sparkline" height={72} area />
        </View>
        <Text className="text-muted-foreground px-4 text-xs">Last 14 days</Text>
      </Card>

      <View className="flex-row gap-3">
        <Button className="flex-1" onPress={() => router.push('/(sample)/send')}>
          <Icon as={ArrowUpRightIcon} className="text-primary-foreground" />
          <Text>Send</Text>
        </Button>
        <Button className="flex-1" variant="secondary">
          <Icon as={PlusIcon} />
          <Text>Add money</Text>
        </Button>
      </View>

      <View className="flex-row gap-3">
        <StatTile label="Spent" value="$1,180" delta={-4.2} />
        <StatTile label="Income" value="$3,200" delta={0} />
      </View>

      <View className="gap-3">
        <SectionHeader title="Recent activity" action="See all" onAction={() => router.push('/(sample)/(tabs)/activity')} />
        <Card className="w-full gap-0 px-4 py-0">
          {recent.map((t, i) => (
            <ListRow
              key={t.id}
              leading={<IconCircle as={CATEGORY_ICON[t.category]} className={t.amount > 0 ? 'bg-success/15' : undefined} iconClassName={t.amount > 0 ? 'text-success' : undefined} />}
              title={t.title}
              subtitle={t.subtitle}
              value={money(t.amount, true)}
              valueClassName={t.amount > 0 ? 'text-success' : undefined}
              sublabel={t.status === 'completed' ? undefined : t.status}
              sublabelClassName={t.status === 'failed' ? 'text-destructive' : 'text-warning'}
              onPress={() => router.push({ pathname: '/(sample)/activity/[id]', params: { id: t.id } })}
              last={i === recent.length - 1}
            />
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}
