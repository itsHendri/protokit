'use client';
import { CalendarIcon } from 'lucide-react';
import { cn } from 'cn';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  /** Shown when nothing is picked: say what the date is for ("Pick a due date"). */
  placeholder?: string;
  /** For a `<Label htmlFor>`. */
  id?: string;
  /** Days that cannot be picked, e.g. `(d) => d < today`. */
  disabled?: (date: Date) => boolean;
  'aria-invalid'?: boolean;
  className?: string;
};

const format = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** One date in a form: a field-styled button that opens a Calendar, and closes when a day is picked. */
export function DatePicker({ value, onChange, placeholder = 'Pick a date', id, disabled, className, ...rest }: Props) {
  const [open, setOpen] = React.useState(false);
  // A <Label htmlFor> becomes the button's name, which hides the date itself from screen readers; the
  // value is attached as the description instead ("Due date, button, 24 Jul 2026").
  const valueId = React.useId();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          aria-invalid={rest['aria-invalid']}
          aria-describedby={valueId}
          className={cn('w-full justify-start font-normal sm:w-60', !value && 'text-muted-foreground', className)}>
          <CalendarIcon aria-hidden />
          <span id={valueId}>{value ? format(value) : placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          disabled={disabled}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
