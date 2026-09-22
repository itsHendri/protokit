import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type Props = { value?: Date; onChange: (date: Date) => void; className?: string };

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Month grid. Selected day is a primary disc; today has a primary ring. */
export function Calendar({ value, onChange, className }: Props) {
  const today = new Date();
  const [view, setView] = React.useState(() => {
    const base = value ?? today;
    return { year: base.getFullYear(), month: base.getMonth() };
  });
  const firstWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array.from({ length: firstWeekday }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const shift = (delta: number) =>
    setView((v) => {
      const m = v.month + delta;
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });

  return (
    <View className={className}>
      <View className="mb-3 flex-row items-center justify-between">
        <Pressable accessibilityRole="button" accessibilityLabel="Previous month" hitSlop={8} onPress={() => shift(-1)} className="size-9 items-center justify-center">
          <Icon as={ChevronLeftIcon} size={20} />
        </Pressable>
        <Text className="font-semibold">
          {MONTHS[view.month]} {view.year}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Next month" hitSlop={8} onPress={() => shift(1)} className="size-9 items-center justify-center">
          <Icon as={ChevronRightIcon} size={20} />
        </Pressable>
      </View>
      <View className="flex-row">
        {WEEKDAYS.map((d, i) => (
          <Text key={i} className="text-muted-foreground mb-1 flex-1 text-center text-xs">
            {d}
          </Text>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {cells.map((day, i) => {
          if (day === null) return <View key={`b${i}`} style={{ width: `${100 / 7}%` }} className="aspect-square" />;
          const date = new Date(view.year, view.month, day);
          const selected = value ? sameDay(date, value) : false;
          const isToday = sameDay(date, today);
          return (
            <View key={day} style={{ width: `${100 / 7}%` }} className="aspect-square p-0.5">
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={date.toDateString()}
                onPress={() => {
                  haptic('selection');
                  onChange(date);
                }}
                className={cn('flex-1 items-center justify-center rounded-full', selected ? 'bg-primary' : isToday ? 'border-primary border' : 'active:bg-accent')}>
                <Text className={cn(selected && 'text-primary-foreground font-semibold')}>{day}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
