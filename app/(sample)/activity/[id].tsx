import { IconCircle } from '@/components/kit/icon-circle';
import { SummaryCard } from '@/components/kit/key-value-list';
import { ActionSheet } from '@/components/kit/sheet';
import { StatusDot } from '@/components/kit/status-dot';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { useToast } from '@/components/kit/toast';
import { money, TRANSACTIONS } from '@/components/sample/data';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownLeftIcon, ArrowUpRightIcon, FlagIcon, RepeatIcon, ShareIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [menu, setMenu] = React.useState(false);
  const t = TRANSACTIONS.find((x) => x.id === id) ?? TRANSACTIONS[0];
  const tone = t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'destructive';

  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="items-center gap-5 p-5 pb-32">
        <IconCircle as={t.amount > 0 ? ArrowDownLeftIcon : ArrowUpRightIcon} size={64} className={t.amount > 0 ? 'bg-success/15' : 'bg-muted'} iconClassName={t.amount > 0 ? 'text-success' : undefined} />
        <View className="items-center gap-1">
          <Text className="text-3xl font-bold">{money(t.amount, true)}</Text>
          <Text className="text-muted-foreground">{t.title}</Text>
          <View className="flex-row items-center gap-2">
            <StatusDot tone={tone} />
            <Text className="text-sm capitalize">{t.status}</Text>
          </View>
        </View>
        <SummaryCard
          title="Details"
          rows={[
            { label: 'Date', value: t.subtitle },
            { label: 'Category', value: t.category },
            { label: 'Reference', value: `#${t.id.toUpperCase()}-2026` },
            { label: 'Fee', value: '$0.00', valueClassName: 'text-success' },
          ]}
        />
      </ScrollView>
      <StickyBottomBar>
        <Button variant="outline" onPress={() => setMenu(true)}>
          <Text>More</Text>
        </Button>
        <Button onPress={() => router.push('/(sample)/send')}>
          <Text>Send again</Text>
        </Button>
      </StickyBottomBar>
      <ActionSheet
        open={menu}
        onClose={() => setMenu(false)}
        title="Transaction"
        items={[
          { label: 'Share receipt', icon: ShareIcon, onPress: () => toast.success('Receipt shared') },
          { label: 'Repeat payment', icon: RepeatIcon, onPress: () => router.push('/(sample)/send') },
          { label: 'Report a problem', icon: FlagIcon, destructive: true, onPress: () => toast.info('Reported') },
        ]}
      />
    </View>
  );
}
