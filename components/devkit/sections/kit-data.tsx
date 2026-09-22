import { BarChart } from '@/components/kit/bar-chart';
import { ChartLegend, DonutChart } from '@/components/kit/donut-chart';
import { IconCircle } from '@/components/kit/icon-circle';
import { KeyValueList, SummaryCard } from '@/components/kit/key-value-list';
import { LineChart } from '@/components/kit/line-chart';
import { ListRow } from '@/components/kit/list-row';
import { PercentChange } from '@/components/kit/percent-change';
import { StatTile } from '@/components/kit/stat-tile';
import { StatusDot } from '@/components/kit/status-dot';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { ArrowDownLeftIcon, ArrowUpRightIcon, CreditCardIcon, ShoppingCartIcon, UsersIcon, WalletIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

const PRICES = [42, 44, 43, 47, 49, 46, 51, 55, 53, 58, 57, 61, 60, 64, 63, 68, 66, 70, 72, 71];

function ListRowDemo() {
  return (
    <Card className="w-full gap-0 px-4 py-0">
      <ListRow leading={<IconCircle as={ArrowUpRightIcon} />} title="Sent to Alex" subtitle="Today, 09:41" value="−$120.00" sublabel="Completed" />
      <ListRow leading={<IconCircle as={ArrowDownLeftIcon} />} title="Salary" subtitle="Yesterday" value="+$3,200.00" valueClassName="text-success" sublabel="Completed" />
      <ListRow leading={<IconCircle as={CreditCardIcon} />} title="Cards" subtitle="2 active" chevron onPress={() => {}} />
      <ListRow leading={<IconCircle as={UsersIcon} />} title="Shared account" trailing={<Badge variant="secondary"><Text>New</Text></Badge>} last onPress={() => {}} />
    </Card>
  );
}

function IconCircleDemo() {
  return (
    <View className="flex-row items-center gap-4">
      <IconCircle as={WalletIcon} />
      <IconCircle as={WalletIcon} size={48} className="bg-primary/15" iconClassName="text-primary" />
      <IconCircle as={ShoppingCartIcon} size={56} className="bg-success/15" iconClassName="text-success" />
    </View>
  );
}

function SummaryDemo() {
  const rows = [
    { label: 'Amount', value: '$120.00' },
    { label: 'Fee', value: '$0.00', valueClassName: 'text-success' },
    { label: 'Arrives', value: 'Instantly' },
    { label: 'Total', value: '$120.00' },
  ];
  return (
    <View className="w-full gap-4">
      <SummaryCard title="Order summary" rows={rows} />
      <KeyValueList rows={rows.slice(0, 2)} />
    </View>
  );
}

function StatTileDemo() {
  return (
    <View className="w-full flex-row gap-3">
      <StatTile label="Revenue" value="$12.4k" delta={4.2} icon={WalletIcon} />
      <StatTile label="Orders" value="318" delta={-1.8} icon={ShoppingCartIcon} />
    </View>
  );
}

function PercentChangeDemo() {
  return (
    <View className="flex-row gap-6">
      <PercentChange value={2.35} />
      <PercentChange value={-0.8} />
      <PercentChange value={0} />
      <PercentChange value={12} decimals={0} showIcon={false} />
    </View>
  );
}

function StatusDotDemo() {
  return (
    <View className="flex-row items-center gap-4">
      {(['success', 'warning', 'destructive', 'info', 'primary', 'muted'] as const).map((t) => (
        <View key={t} className="items-center gap-1">
          <StatusDot tone={t} />
          <Text className="text-muted-foreground text-xs">{t}</Text>
        </View>
      ))}
    </View>
  );
}

function LineChartDemo() {
  const [pt, setPt] = React.useState<{ x: number; y: number } | null>(null);
  return (
    <View className="w-full gap-3">
      <View className="flex-row items-baseline justify-between">
        <Text className="text-2xl font-semibold">${pt ? pt.y : PRICES[PRICES.length - 1]}.00</Text>
        <Text className="text-muted-foreground text-sm">{pt ? `Point ${pt.x + 1}` : 'Drag to scrub'}</Text>
      </View>
      <LineChart data={PRICES} height={140} area onPointerChange={setPt} />
      <View className="flex-row gap-4">
        <LineChart variant="sparkline" data={PRICES} height={36} width={100} tone="success" area />
        <LineChart variant="sparkline" data={[...PRICES].reverse()} height={36} width={100} tone="destructive" />
      </View>
    </View>
  );
}

function BarChartDemo() {
  return (
    <BarChart
      className="w-full"
      showValues
      data={[
        { label: 'Mon', value: 12 },
        { label: 'Tue', value: 18 },
        { label: 'Wed', value: 9 },
        { label: 'Thu', value: 22, className: 'bg-success' },
        { label: 'Fri', value: 15 },
        { label: 'Sat', value: 6, className: 'bg-muted-foreground' },
        { label: 'Sun', value: 4, className: 'bg-muted-foreground' },
      ]}
    />
  );
}

function DonutChartDemo() {
  const data = [
    { label: 'Housing', value: 1200 },
    { label: 'Food', value: 480 },
    { label: 'Transport', value: 220 },
    { label: 'Fun', value: 300 },
  ];
  return (
    <View className="w-full flex-row items-center gap-6">
      <DonutChart data={data} size={140}>
        <Text className="text-xl font-semibold">$2.2k</Text>
        <Text className="text-muted-foreground text-xs">this month</Text>
      </DonutChart>
      <ChartLegend data={data} className="flex-1" />
    </View>
  );
}

export const KIT_DATA_SECTIONS: ComponentSection[] = [
  { id: 'list-row', title: 'List row', category: 'data', aliases: ['row', 'cell', 'transaction', 'menu item'], api: '<ListRow leading title subtitle? value? sublabel? trailing? chevron? onPress? last? />', caption: 'The canonical row. Put rows inside a Card with px-4 py-0; mark the last one `last`.', Demo: ListRowDemo },
  { id: 'icon-circle', title: 'Icon circle', category: 'data', aliases: ['icon well', 'avatar icon', 'leading icon'], api: '<IconCircle as size? className? iconClassName? />', caption: 'Tint with bg-<tone>/15 + text-<tone>.', Demo: IconCircleDemo },
  { id: 'summary-card', title: 'Summary card', category: 'data', aliases: ['key value', 'receipt', 'details', 'order summary'], api: '<SummaryCard title? rows={[{label,value}]} /> · <KeyValueList rows />', Demo: SummaryDemo },
  { id: 'stat-tile', title: 'Stat tile', category: 'data', aliases: ['kpi', 'metric', 'dashboard'], api: '<StatTile label value delta? icon? />', Demo: StatTileDemo },
  { id: 'percent-change', title: 'Percent change', category: 'data', aliases: ['delta', 'trend', 'up down'], api: '<PercentChange value decimals? showIcon? />', Demo: PercentChangeDemo },
  { id: 'status-dot', title: 'Status dot', category: 'data', aliases: ['indicator', 'online', 'presence'], api: '<StatusDot tone size />', Demo: StatusDotDemo },
  { id: 'line-chart', title: 'Line chart', category: 'data', aliases: ['sparkline', 'price', 'time series', 'graph'], api: '<LineChart data variant="interactive|sparkline" height tone area? onPointerChange? />', caption: 'Interactive variant reports the scrubbed point; render your own header from it.', Demo: LineChartDemo },
  { id: 'bar-chart', title: 'Bar chart', category: 'data', aliases: ['bars', 'histogram', 'weekly'], api: '<BarChart data={[{label,value,className?}]} height showValues? />', Demo: BarChartDemo },
  { id: 'donut-chart', title: 'Donut chart', category: 'data', aliases: ['pie', 'ring', 'allocation', 'breakdown'], api: '<DonutChart data size>{centre}</DonutChart> + <ChartLegend data />', Demo: DonutChartDemo },
];
