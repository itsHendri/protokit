import { LineChart } from '@/components/kit/line-chart';
import { ProgressRing } from '@/components/kit/progress-ring';
import { QuantityStepper } from '@/components/kit/quantity-stepper';
import { ActionSheet } from '@/components/kit/sheet';
import { Slider } from '@/components/kit/slider';
import { StatTile } from '@/components/kit/stat-tile';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { useToast } from '@/components/kit/toast';
import { COMPLETION_30D, habits, isDone, useHabits } from '@/components/habits/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { PencilIcon, ShareIcon, Trash2Icon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const list = useHabits();
  const h = list.find((x) => x.id === id) ?? list[0];
  const [menu, setMenu] = React.useState(false);
  if (!h) return null;
  const pct = Math.round((h.today / h.goal) * 100);

  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: h.name }} />
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32">
        <Card className="w-full items-center gap-3 px-5 py-6">
          <ProgressRing value={pct} size={120} strokeWidth={10} tone={h.tone} accessibilityLabel={`${h.name} today`}>
            <Text className="text-2xl font-bold">{h.today}</Text>
            <Text className="text-muted-foreground text-xs">of {h.goal}</Text>
          </ProgressRing>
          <Text className="text-muted-foreground">{isDone(h) ? 'Done for today' : `${h.goal - h.today} ${h.unit} to go`}</Text>
          <QuantityStepper value={h.today} onChange={(v) => habits.bump(h.id, v - h.today)} min={0} max={h.goal} />
        </Card>
        <View className="flex-row gap-3">
          <StatTile label="Streak" value={`${h.streak} days`} />
          <StatTile label="30-day rate" value="82%" delta={4} />
        </View>
        <Card className="w-full gap-3 px-4 py-4">
          <Text className="font-semibold">Last 30 days</Text>
          <LineChart data={COMPLETION_30D} height={120} tone={h.tone} area domain={{ min: 0, max: 100 }} />
        </Card>
        <Card className="w-full gap-4 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-medium">Reminder</Text>
              <Text className="text-muted-foreground text-sm">Daily at 8:00</Text>
            </View>
            <Switch aria-label="Reminder" checked={h.reminder} onCheckedChange={(v) => habits.setReminder(h.id, v)} />
          </View>
          {h.goal > 1 ? (
            <View className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-medium">Daily goal</Text>
                <Text className="text-muted-foreground text-sm">
                  {h.goal} {h.unit}
                </Text>
              </View>
              <Slider value={h.goal} onChange={(v) => habits.setGoal(h.id, v)} min={1} max={30} step={1} tone="primary" accessibilityLabel="Daily goal" />
            </View>
          ) : null}
        </Card>
      </ScrollView>
      <StickyBottomBar>
        <Button variant="outline" onPress={() => setMenu(true)}>
          <Text>More</Text>
        </Button>
        <Button
          onPress={() => {
            habits.toggleDone(h.id);
            toast.success(isDone(h) ? 'Marked as not done' : 'Nice, done for today');
          }}>
          <Text>{isDone(h) ? 'Undo' : 'Mark done'}</Text>
        </Button>
      </StickyBottomBar>
      <ActionSheet
        open={menu}
        onClose={() => setMenu(false)}
        title={h.name}
        items={[
          { label: 'Share progress', icon: ShareIcon, onPress: () => toast.success('Progress shared') },
          { label: 'Rename', icon: PencilIcon, onPress: () => toast.info('Rename is not part of the sample') },
          {
            label: 'Delete habit',
            icon: Trash2Icon,
            destructive: true,
            onPress: () => {
              habits.remove(h.id);
              toast.info('Habit deleted');
              router.back();
            },
          },
        ]}
      />
    </View>
  );
}
