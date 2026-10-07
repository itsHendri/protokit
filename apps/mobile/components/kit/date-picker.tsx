import { Calendar } from '@/components/kit/calendar';
import { Sheet } from '@/components/kit/sheet';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  title?: string;
  format?: (date: Date) => string;
  className?: string;
};

const defaultFormat = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/** Input-shaped trigger that opens a Calendar in a Sheet. Matches the Input container. */
export function DatePicker({ value, onChange, placeholder = 'Select a date', title = 'Pick a date', format = defaultFormat, className }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        className={cn('border-input bg-background h-control-sm flex-row items-center gap-2 rounded-md border px-3 active:bg-accent', className)}>
        <Icon as={CalendarIcon} size={16} className="text-muted-foreground" />
        <Text className={cn('flex-1', !value && 'text-muted-foreground')}>{value ? format(value) : placeholder}</Text>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} title={title}>
        <View className="px-5 pb-2">
          <Calendar
            value={value}
            onChange={(d) => {
              onChange(d);
              setOpen(false);
            }}
          />
        </View>
      </Sheet>
    </>
  );
}
