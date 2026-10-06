import { BarChart } from '@/components/kit/bar-chart';
import { ChartLegend, DonutChart } from '@/components/kit/donut-chart';
import { LineChart } from '@/components/kit/line-chart';
import { SegmentedControl } from '@/components/kit/segmented-control';
import { StatTile } from '@/components/kit/stat-tile';
import { BY_CATEGORY, COMPLETION_30D, WEEK } from '@/components/habits/store';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const RANGES = [
  { value: 'w', label: 'Week' },
  { value: 'm', label: 'Month' },
] as const;

export default function Insights() {
  const [range, setRange] = React.useState<'w' | 'm'>('w');
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-5 p-5 pb-32">
      <SegmentedControl segments={RANGES} value={range} onChange={setRange} />
      <View className="flex-row gap-3">
        <StatTile label="Completion" value={range === 'w' ? '74%' : '82%'} delta={range === 'w' ? -3 : 4} />
        <StatTile label="Habits done" value={range === 'w' ? '26' : '118'} />
      </View>
      <Card className="w-full gap-3 px-4 py-4">
        <Text className="font-semibold">{range === 'w' ? 'Habits done per day' : 'Completion rate, last 30 days'}</Text>
        {range === 'w' ? <BarChart data={WEEK} height={140} showValues /> : <LineChart data={COMPLETION_30D} height={140} area domain={{ min: 0, max: 100 }} />}
      </Card>
      <Card className="w-full flex-row items-center gap-5 px-4 py-4">
        <DonutChart data={BY_CATEGORY} size={120} strokeWidth={16}>
          <Text className="font-semibold">100%</Text>
        </DonutChart>
        <ChartLegend data={BY_CATEGORY} className="flex-1" />
      </Card>
    </ScrollView>
  );
}
