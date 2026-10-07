import { IconCircle } from '@/components/kit/icon-circle';
import { ListRow } from '@/components/kit/list-row';
import { SectionHeader } from '@/components/kit/section-header';
import { OptionSheet } from '@/components/kit/sheet';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { BellIcon, CalendarIcon, MoonIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const WEEK_START = [
  { value: 'mon', label: 'Monday' },
  { value: 'sun', label: 'Sunday' },
] as const;

export default function HabitSettings() {
  const [reminders, setReminders] = React.useState(true);
  const [quiet, setQuiet] = React.useState(false);
  const [start, setStart] = React.useState<'mon' | 'sun'>('mon');
  const [open, setOpen] = React.useState(false);
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-5 p-5 pb-32">
      <View className="gap-3">
        <SectionHeader title="Preferences" />
        <Card className="w-full gap-0 px-4 py-0">
          <ListRow leading={<IconCircle as={BellIcon} />} title="Reminders" subtitle="Daily nudges for unfinished habits" trailing={<Switch aria-label="Reminders" checked={reminders} onCheckedChange={setReminders} />} />
          <ListRow leading={<IconCircle as={MoonIcon} />} title="Quiet hours" subtitle="No reminders after 21:00" trailing={<Switch aria-label="Quiet hours" checked={quiet} onCheckedChange={setQuiet} />} />
          <ListRow leading={<IconCircle as={CalendarIcon} />} title="Week starts on" value={WEEK_START.find((w) => w.value === start)?.label} chevron onPress={() => setOpen(true)} last />
        </Card>
      </View>
      <OptionSheet open={open} onClose={() => setOpen(false)} title="Week starts on" options={WEEK_START} value={start} onChange={setStart} />
    </ScrollView>
  );
}
