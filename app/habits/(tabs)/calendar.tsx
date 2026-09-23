import { Calendar } from '@/components/kit/calendar';
import { StatusDot } from '@/components/kit/status-dot';
import { COMPLETED_DAYS } from '@/components/habits/store';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function HabitCalendar() {
  const [day, setDay] = React.useState<Date | undefined>(new Date());
  const complete = day ? COMPLETED_DAYS.includes(day.getDate()) : false;
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-5 p-5 pb-16">
      <Card className="w-full px-4 py-4">
        <Calendar value={day} onChange={setDay} />
      </Card>
      {day ? (
        <Card className="w-full flex-row items-center gap-3 px-4 py-4">
          <StatusDot tone={complete ? 'success' : 'muted'} size="lg" />
          <View className="flex-1">
            <Text className="font-medium">{day.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            <Text className="text-muted-foreground text-sm">{complete ? 'All habits completed' : 'Some habits missed'}</Text>
          </View>
        </Card>
      ) : null}
      <Text className="text-muted-foreground text-xs">{COMPLETED_DAYS.length} perfect days this month.</Text>
    </ScrollView>
  );
}
