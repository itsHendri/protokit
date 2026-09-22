import { RangeSelector } from '@/components/kit/range-selector';
import { AmountInput } from '@/components/kit/amount-input';
import { Calendar } from '@/components/kit/calendar';
import { DatePicker } from '@/components/kit/date-picker';
import { FilterChip, FilterChipRow } from '@/components/kit/filter-chip';
import { NumericKeypad } from '@/components/kit/numeric-keypad';
import { OtpInput } from '@/components/kit/otp-input';
import { PasswordInput } from '@/components/kit/password-input';
import { QuantityStepper } from '@/components/kit/quantity-stepper';
import { SearchField } from '@/components/kit/search-field';
import { SegmentedControl } from '@/components/kit/segmented-control';
import { SelectableCard } from '@/components/kit/selectable-card';
import { Slider } from '@/components/kit/slider';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { StarIcon, TruckIcon, ZapIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function FilterChipDemo() {
  const [sel, setSel] = React.useState<string[]>(['all']);
  const toggle = (v: string) => setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  return (
    <View className="-mx-5 self-stretch">
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
    <AmountInput value={v} onChangeText={setV} symbol="$" helper="Up to $500.00 available" onMax={() => setV('500')} onToggleCurrency={() => {}} className="w-full" />
  );
}

function NumericKeypadDemo() {
  const [v, setV] = React.useState('');
  return (
    <View className="w-full gap-4">
      <AmountInput value={v} onChangeText={setV} symbol="min" symbolPosition="trailing" editable={false} placeholder="0" helper="How long did it take?" className="w-full" />
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

function PasswordInputDemo() {
  const [v, setV] = React.useState("hunter22");
  return (
    <View className="w-full gap-2">
      <Label htmlFor="ks-password">Password</Label>
      <PasswordInput id="ks-password" value={v} onChangeText={setV} />
    </View>
  );
}

function SelectableCardDemo() {
  const [plan, setPlan] = React.useState("standard");
  const [extras, setExtras] = React.useState<string[]>(["insurance"]);
  const toggle = (v: string) => setExtras((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  return (
    <View className="w-full gap-2">
      <SelectableCard icon={TruckIcon} title="Standard delivery" description="3–5 business days" detail="Free" selected={plan === "standard"} onPress={() => setPlan("standard")} />
      <SelectableCard icon={ZapIcon} title="Express delivery" description="Tomorrow before noon" detail="$9.90" selected={plan === "express"} onPress={() => setPlan("express")} />
      <SelectableCard mode="checkbox" title="Add insurance" description="Covers loss and damage" detail="$2.00" selected={extras.includes("insurance")} onPress={() => toggle("insurance")} />
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


const RANGES = [
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '1y', label: '1Y' },
  { value: 'all', label: 'ALL' },
] as const;

function RangeSelectorDemo() {
  const [range, setRange] = React.useState<(typeof RANGES)[number]['value']>('1m');
  return (
    <View className="w-full gap-3">
      <RangeSelector options={RANGES} value={range} onChange={setRange} />
      <Text className="text-muted-foreground text-sm">Showing: {range.toUpperCase()}</Text>
    </View>
  );
}

export const KIT_INPUTS_SECTIONS: ComponentSection[] = [
  { id: 'filter-chip', title: 'Filter chip', category: 'inputs', aliases: ['chip', 'tag filter', 'pill'], api: '<FilterChipRow><FilterChip label selected onPress icon? /></FilterChipRow>', caption: 'Selected state is inverted neutral, never the brand colour.', Demo: FilterChipDemo },
  { id: 'segmented-control', title: 'Segmented control', category: 'inputs', aliases: ['segment', 'ios', 'switcher'], api: '<SegmentedControl segments={[{value,label}]} value onChange />', caption: '2–4 mutually exclusive options. For content panes use Tabs.', Demo: SegmentedControlDemo },
  { id: 'search-field', title: 'Search field', category: 'inputs', aliases: ['search bar', 'find'], api: '<SearchField value onChangeText placeholder />', Demo: SearchFieldDemo },
  { id: 'quantity-stepper', title: 'Quantity stepper', category: 'inputs', aliases: ['plus minus', 'counter', 'increment'], api: '<QuantityStepper value onChange min max step />', Demo: QuantityStepperDemo },
  { id: 'amount-input', title: 'Amount input', category: 'inputs', aliases: ['money', 'currency', 'quantity', 'hero field', 'large number'], api: '<AmountInput value onChangeText symbol helper? onMax? onToggleCurrency? error? editable? />', caption: 'Hero numeric entry. Set editable={false} when a NumericKeypad drives it.', Demo: AmountInputDemo },
  { id: 'numeric-keypad', title: 'Numeric keypad', category: 'inputs', aliases: ['keypad', 'pin pad', 'digits'], api: '<NumericKeypad value onChange maxLength? allowDecimal? />', caption: 'Replaces the system keyboard on full-screen amount entry. Long-press ⌫ clears.', Demo: NumericKeypadDemo },
  { id: 'otp-input', title: 'OTP input', category: 'inputs', aliases: ['code', 'verification', 'pin', '2fa', 'passcode'], api: '<OtpInput length value onChange onComplete error? />', caption: 'Try 123456. Handles paste and backspace across cells.', Demo: OtpInputDemo },
  { id: 'password-input', title: 'Password input', category: 'inputs', aliases: ['secure', 'show hide', 'login'], api: '<PasswordInput value onChangeText />', Demo: PasswordInputDemo },
  { id: 'selectable-card', title: 'Selectable card', category: 'inputs', aliases: ['radio card', 'option card', 'plan', 'choice'], api: '<SelectableCard title description? icon? detail? selected onPress mode="radio|checkbox" />', caption: 'A whole card as a choice. Selection shows as a ring/check plus a tinted border, not colour alone.', Demo: SelectableCardDemo },
  { id: 'slider', title: 'Slider', category: 'inputs', aliases: ['range', 'drag', 'percentage'], api: '<Slider value onChange min max step? tone? onChangeComplete? />', Demo: SliderDemo },
  { id: 'date-picker', title: 'Date picker', category: 'inputs', aliases: ['date', 'calendar field'], api: '<DatePicker value onChange placeholder? />', caption: 'Input-shaped trigger that opens a Calendar in a Sheet.', Demo: DatePickerDemo },
  { id: 'calendar', title: 'Calendar', category: 'inputs', aliases: ['month', 'day grid'], api: '<Calendar value onChange />', Demo: CalendarDemo },
  { id: 'range-selector', title: 'Range selector', category: 'inputs', aliases: ['time range', 'chart range', '1D 1W 1M', 'period'], api: '<RangeSelector options value onChange />', caption: 'For the time window over a chart. Use SegmentedControl instead when the options switch content rather than a period.', Demo: RangeSelectorDemo },
];
