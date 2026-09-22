import { AmountInput } from '@/components/kit/amount-input';
import { Calendar } from '@/components/kit/calendar';
import { DatePicker } from '@/components/kit/date-picker';
import { FilterChip, FilterChipRow } from '@/components/kit/filter-chip';
import { NumericKeypad } from '@/components/kit/numeric-keypad';
import { OtpInput } from '@/components/kit/otp-input';
import { QuantityStepper } from '@/components/kit/quantity-stepper';
import { SearchField } from '@/components/kit/search-field';
import { SegmentedControl } from '@/components/kit/segmented-control';
import { Slider } from '@/components/kit/slider';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { StarIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function FilterChipDemo() {
  const [sel, setSel] = React.useState<string[]>(['all']);
  const toggle = (v: string) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  return (
    <View className="-mx-5 w-[calc(100%+40px)]">
      <FilterChipRow>
        {['all', 'favourites', 'recent', 'archived', 'shared'].map((v) => (
          <FilterChip key={v} label={v[0].toUpperCase() + v.slice(1)} selected={sel.includes(v)} onPress={() => toggle(v)} icon={v === 'favourites' ? StarIcon : undefined} />
        ))}
        <FilterChip label="Disabled" disabled />
      </FilterChipRow>
    </View>
  );
}

const SEGMENTS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const;

function SegmentedControlDemo() {
  const [v, setV] = React.useState<'day' | 'week' | 'month'>('week');
  return <SegmentedControl segments={SEGMENTS} value={v} onChange={setV} className="w-full" />;
}

function SearchFieldDemo() {
  const [q, setQ] = React.useState('');
  return <SearchField value={q} onChangeText={setQ} placeholder="Search" containerClassName="w-full" />;
}

function QuantityStepperDemo() {
  const [n, setN] = React.useState(1);
  return (
    <View className="flex-row items-center gap-4">
      <QuantityStepper value={n} onChange={setN} min={0} max={10} />
      <Text className="text-muted-foreground text-sm">0–10</Text>
    </View>
  );
}

function AmountInputDemo() {
  const [v, setV] = React.useState('');
  return (
    <AmountInput value={v} onChangeText={setV} symbol="$" helper="≈ 0.0021 BTC · Balance $1,240.00" onMax={() => setV('1240')} onToggleCurrency={() => {}} className="w-full" />
  );
}

function NumericKeypadDemo() {
  const [v, setV] = React.useState('');
  return (
    <View className="w-full gap-4">
      <AmountInput value={v} onChangeText={setV} symbol="€" editable={false} placeholder="0" className="w-full" />
      <NumericKeypad value={v} onChange={setV} />
    </View>
  );
}

function OtpInputDemo() {
  const [code, setCode] = React.useState('');
  return <OtpInput value={code} onChange={setCode} autoFocus={false} error={code.length === 6 && code !== '123456' ? 'That code is not right' : undefined} />;
}

function SliderDemo() {
  const [a, setA] = React.useState(0.4);
  const [b, setB] = React.useState(3);
  return (
    <View className="w-full gap-2">
      <Slider value={a} onChange={setA} />
      <Text className="text-muted-foreground text-sm">Continuous · {Math.round(a * 100)}%</Text>
      <Slider value={b} onChange={setB} min={0} max={10} step={1} tone="warning" />
      <Text className="text-muted-foreground text-sm">Stepped 0–10 · {b}</Text>
    </View>
  );
}

function DatePickerDemo() {
  const [d, setD] = React.useState<Date | undefined>();
  return <DatePicker value={d} onChange={setD} className="w-full" />;
}

function CalendarDemo() {
  const [d, setD] = React.useState<Date | undefined>(new Date());
  return <Calendar value={d} onChange={setD} className="w-full" />;
}

export const KIT_INPUTS_SECTIONS: ComponentSection[] = [
  { id: 'filter-chip', title: 'Filter chip', category: 'inputs', aliases: ['chip', 'tag filter', 'pill'], api: '<FilterChipRow><FilterChip label selected onPress icon? /></FilterChipRow>', caption: 'Selected state is inverted neutral, never the brand colour.', Demo: FilterChipDemo },
  { id: 'segmented-control', title: 'Segmented control', category: 'inputs', aliases: ['segment', 'ios', 'switcher'], api: '<SegmentedControl segments={[{value,label}]} value onChange />', caption: '2–4 mutually exclusive options. For content panes use Tabs.', Demo: SegmentedControlDemo },
  { id: 'search-field', title: 'Search field', category: 'inputs', aliases: ['search bar', 'find'], api: '<SearchField value onChangeText placeholder />', Demo: SearchFieldDemo },
  { id: 'quantity-stepper', title: 'Quantity stepper', category: 'inputs', aliases: ['plus minus', 'counter', 'increment'], api: '<QuantityStepper value onChange min max step />', Demo: QuantityStepperDemo },
  { id: 'amount-input', title: 'Amount input', category: 'inputs', aliases: ['money', 'currency', 'hero field', 'send'], api: '<AmountInput value onChangeText symbol helper? onMax? onToggleCurrency? error? editable? />', caption: 'Hero numeric entry. Set editable={false} when a NumericKeypad drives it.', Demo: AmountInputDemo },
  { id: 'numeric-keypad', title: 'Numeric keypad', category: 'inputs', aliases: ['keypad', 'pin pad', 'digits'], api: '<NumericKeypad value onChange maxLength? allowDecimal? />', caption: 'Replaces the system keyboard on full-screen amount entry. Long-press ⌫ clears.', Demo: NumericKeypadDemo },
  { id: 'otp-input', title: 'OTP input', category: 'inputs', aliases: ['code', 'verification', 'pin', '2fa', 'passcode'], api: '<OtpInput length value onChange onComplete error? />', caption: 'Try 123456. Handles paste and backspace across cells.', Demo: OtpInputDemo },
  { id: 'slider', title: 'Slider', category: 'inputs', aliases: ['range', 'drag', 'percentage'], api: '<Slider value onChange min max step? tone? onChangeComplete? />', Demo: SliderDemo },
  { id: 'date-picker', title: 'Date picker', category: 'inputs', aliases: ['date', 'calendar field'], api: '<DatePicker value onChange placeholder? />', caption: 'Input-shaped trigger that opens a Calendar in a Sheet.', Demo: DatePickerDemo },
  { id: 'calendar', title: 'Calendar', category: 'inputs', aliases: ['month', 'day grid'], api: '<Calendar value onChange />', Demo: CalendarDemo },
];
