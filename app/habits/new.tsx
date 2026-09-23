import { SegmentedControl } from '@/components/kit/segmented-control';
import { StickyBottomBar } from '@/components/kit/sticky-bottom-bar';
import { useToast } from '@/components/kit/toast';
import { habits } from '@/components/habits/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const KINDS = [
  { value: 'once', label: 'Once a day' },
  { value: 'count', label: 'Count' },
] as const;

export default function NewHabit() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = React.useState('');
  const [kind, setKind] = React.useState<'once' | 'count'>('once');
  const [goal, setGoal] = React.useState('8');
  const [unit, setUnit] = React.useState('times');
  const valid = name.trim().length > 1 && (kind === 'once' || Number(goal) > 0);
  return (
    <View className="bg-background flex-1">
      <ScrollView contentContainerClassName="gap-5 p-5 pb-32" keyboardShouldPersistTaps="handled">
        <View className="gap-2">
          <Label htmlFor="nh-name">Habit</Label>
          <Input id="nh-name" value={name} onChangeText={setName} placeholder="Meditate" autoFocus />
        </View>
        <View className="gap-2">
          <Label>Type</Label>
          <SegmentedControl segments={KINDS} value={kind} onChange={setKind} />
        </View>
        {kind === 'count' ? (
          <View className="flex-row gap-3">
            <View className="flex-1 gap-2">
              <Label htmlFor="nh-goal">Daily goal</Label>
              <Input id="nh-goal" value={goal} onChangeText={setGoal} keyboardType="number-pad" />
            </View>
            <View className="flex-1 gap-2">
              <Label htmlFor="nh-unit">Unit</Label>
              <Input id="nh-unit" value={unit} onChangeText={setUnit} placeholder="glasses" />
            </View>
          </View>
        ) : null}
      </ScrollView>
      <StickyBottomBar>
        <Button
          disabled={!valid}
          onPress={() => {
            habits.add(name.trim(), kind === 'once' ? 1 : Number(goal), kind === 'once' ? 'session' : unit || 'times');
            toast.success(`Added ${name.trim()}`);
            router.back();
          }}>
          <Text>Add habit</Text>
        </Button>
      </StickyBottomBar>
    </View>
  );
}
