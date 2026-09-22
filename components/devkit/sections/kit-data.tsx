import { AvatarGroup } from '@/components/kit/avatar-group';
import { BarChart } from '@/components/kit/bar-chart';
import { ChartLegend, DonutChart } from '@/components/kit/donut-chart';
import { IconCircle } from '@/components/kit/icon-circle';
import { KeyValueList, SummaryCard } from '@/components/kit/key-value-list';
import { LineChart } from '@/components/kit/line-chart';
import { ListRow } from '@/components/kit/list-row';
import { PercentChange } from '@/components/kit/percent-change';
import { ProgressRing } from '@/components/kit/progress-ring';
import { StatTile } from '@/components/kit/stat-tile';
import { StatusDot } from '@/components/kit/status-dot';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { BellIcon, CreditCardIcon, FolderIcon, ShoppingCartIcon, UsersIcon, WalletIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

const PRICES = [42, 44, 43, 47, 49, 46, 51, 55, 53, 58, 57, 61, 60, 64, 63, 68, 66, 70, 72, 71, 69, 74, 73, 77, 75, 80, 78, 83, 82, 86];

function ListRowDemo() {
  return (
    <Card className="w-full gap-0 px-4 py-0">
      <ListRow leading={<IconCircle as={BellIcon} />} title="Notifications" subtitle="Push and email" value="On" />
      <ListRow leading={<IconCircle as={UsersIcon} />} title="Members" subtitle="3 pending invites" value="12" sublabel="+2 this week" sublabelClassName="text-success" />
      <ListRow leading={<IconCircle as={CreditCardIcon} />} title="Plan" subtitle="Renews on 1 October" chevron onPress={() => {}} />
      <ListRow leading={<IconCircle as={FolderIcon} />} title="Shared folder" trailing={<Badge variant="secondary"><Text>New</Text></Badge>} last onPress={() => {}} />
    </Card>
  );
}

function IconCircleDemo() {
  return (
    <View className="gap-4">
      <View className="flex-row items-end gap-4">
        {[32, 40, 48, 56, 64].map((s) => (
          <View key={s} className="items-center gap-1">
            <IconCircle as={WalletIcon} size={s} />
            <Text className="text-muted-foreground text-xs">{s}</Text>
          </View>
        ))}
      </View>
      <View className="flex-row items-center gap-4">
        <IconCircle as={WalletIcon} size={48} />
        <IconCircle as={WalletIcon} size={48} className="bg-primary/15" iconClassName="text-primary" />
        <IconCircle as={ShoppingCartIcon} size={48} className="bg-success/15" iconClassName="text-success" />
        <IconCircle as={ShoppingCartIcon} size={48} className="bg-warning/15" iconClassName="text-warning" />
        <IconCircle as={ShoppingCartIcon} size={48} className="bg-destructive/15" iconClassName="text-destructive" />
      </View>
    </View>
  );
}

function SummaryDemo() {
  const rows = [
    { label: 'Date', value: 'Fri 3 Oct' },
    { label: 'Time', value: '10:30 – 11:15' },
    { label: 'Guests', value: '2' },
    { label: 'Status', value: 'Confirmed', valueClassName: 'text-success' },
  ];
  return (
    <View className="w-full gap-4">
      <SummaryCard title="Booking summary" rows={rows} />
      <KeyValueList rows={rows.slice(0, 2)} />
    </View>
  );
}

function StatTileDemo() {
  return (
    <View className="w-full flex-row gap-3">
      <StatTile label="Active users" value="1,284" delta={4.2} icon={UsersIcon} />
      <StatTile label="Sessions" value="318" delta={-1.8} icon={ShoppingCartIcon} />
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

function AvatarGroupDemo() {
  const people = [
    { id: "1", initials: "AR" },
    { id: "2", initials: "SO", uri: "https://github.com/expo.png" },
    { id: "3", initials: "JL" },
    { id: "4", initials: "MT" },
    { id: "5", initials: "KP" },
    { id: "6", initials: "DN" },
  ];
  return (
    <View className="gap-4">
      <AvatarGroup items={people} />
      <AvatarGroup items={people.slice(0, 3)} size={40} />
    </View>
  );
}

function ProgressRingDemo() {
  return (
    <View className="flex-row items-center gap-6">
      <ProgressRing value={72}>
        <Text className="text-sm font-semibold">72%</Text>
      </ProgressRing>
      <ProgressRing value={35} tone="warning" size={48} strokeWidth={5} />
      <ProgressRing value={100} tone="success" size={40} strokeWidth={4} />
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
        <Text className="text-2xl font-semibold">{pt ? pt.y : PRICES[PRICES.length - 1]}</Text>
        <Text className="text-muted-foreground text-sm">{pt ? `Day ${pt.x + 1}` : 'Active users · drag to scrub'}</Text>
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
    { label: 'Design', value: 40 },
    { label: 'Research', value: 25 },
    { label: 'Build', value: 20 },
    { label: 'Review', value: 15 },
  ];
  return (
    <View className="w-full flex-row items-center gap-6">
      <DonutChart data={data} size={140}>
        <Text className="text-xl font-semibold">42h</Text>
        <Text className="text-muted-foreground text-xs">this week</Text>
      </DonutChart>
      <ChartLegend data={data} className="flex-1" />
    </View>
  );
}

export const KIT_DATA_SECTIONS: ComponentSection[] = [
  { id: 'list-row', title: 'List row', category: 'data', aliases: ['row', 'cell', 'setting', 'menu item', 'list item'], api: '<ListRow leading title subtitle? value? sublabel? trailing? chevron? onPress? last? />', caption: 'The canonical row. Put rows inside a Card with px-4 py-0; mark the last one `last`.', Demo: ListRowDemo },
  { id: 'icon-circle', title: 'Icon circle', category: 'data', aliases: ['icon well', 'avatar icon', 'leading icon'], api: '<IconCircle as size? className? iconClassName? />', caption: 'Sizes 32–64 in neutral; tone with bg-<tone>/15 + text-<tone> (brand, success, warning, destructive).', Demo: IconCircleDemo },
  { id: 'summary-card', title: 'Summary card', category: 'data', aliases: ['key value', 'receipt', 'details', 'summary', 'confirmation'], api: '<SummaryCard title? rows={[{label,value}]} /> · <KeyValueList rows />', Demo: SummaryDemo },
  { id: 'stat-tile', title: 'Stat tile', category: 'data', aliases: ['kpi', 'metric', 'dashboard'], api: '<StatTile label value delta? icon? />', Demo: StatTileDemo },
  { id: 'percent-change', title: 'Percent change', category: 'data', aliases: ['delta', 'trend', 'up down'], api: '<PercentChange value decimals? showIcon? />', Demo: PercentChangeDemo },
  { id: 'avatar-group', after: 'avatar', title: 'Avatar group', category: 'data', aliases: ['members', 'participants', 'stack', '+n'], api: '<AvatarGroup items={[{id,initials,uri?}]} max? size? />', Demo: AvatarGroupDemo },
  { id: 'progress-ring', title: 'Progress ring', category: 'data', aliases: ['circular progress', 'goal', 'percent', 'donut'], api: '<ProgressRing value size? tone?>{centre}</ProgressRing>', Demo: ProgressRingDemo },
  { id: 'status-dot', title: 'Status dot', category: 'data', aliases: ['indicator', 'online', 'presence'], api: '<StatusDot tone size />', Demo: StatusDotDemo },
  { id: 'line-chart', title: 'Line chart', category: 'data', aliases: ['sparkline', 'trend', 'time series', 'graph'], api: '<LineChart data variant="interactive|sparkline" height tone area? onPointerChange? />', caption: 'Interactive variant reports the scrubbed point; render your own header from it.', Demo: LineChartDemo },
  { id: 'bar-chart', title: 'Bar chart', category: 'data', aliases: ['bars', 'histogram', 'weekly'], api: '<BarChart data={[{label,value,className?}]} height showValues? />', Demo: BarChartDemo },
  { id: 'donut-chart', title: 'Donut chart', category: 'data', aliases: ['pie', 'ring', 'allocation', 'breakdown'], api: '<DonutChart data size>{centre}</DonutChart> + <ChartLegend data />', Demo: DonutChartDemo },
];
