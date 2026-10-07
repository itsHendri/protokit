import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputInstance, type TextInputKeyPressEvent, View } from 'react-native';

type Props = {
  length?: number;
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
  className?: string;
};

/** N-digit one-time-code entry: auto-advances, handles paste, backspaces into the previous cell. */
export function OtpInput({ length = 6, value, onChange, onComplete, error, autoFocus = true, className }: Props) {
  const refs = React.useRef<(TextInputInstance | null)[]>([]);
  const [focusIdx, setFocusIdx] = React.useState(autoFocus ? 0 : -1);

  const digits = React.useMemo(() => {
    const clean = (value ?? '').replace(/\D/g, '').slice(0, length);
    return Array.from({ length }, (_, i) => clean[i] ?? '');
  }, [value, length]);

  React.useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => refs.current[0]?.focus(), 0);
    return () => clearTimeout(t);
  }, [autoFocus]);

  const commit = (next: string[]) => {
    const joined = next.join('');
    onChange(joined);
    if (joined.replace(/\D/g, '').length === length) onComplete?.(joined);
  };

  const setAt = (idx: number, ch: string) => {
    const clean = ch.replace(/\D/g, '');
    const next = [...digits];
    if (clean.length > 1) {
      for (let i = 0; i < clean.length && idx + i < length; i++) next[idx + i] = clean[i];
      commit(next);
      refs.current[Math.min(idx + clean.length, length - 1)]?.focus();
      return;
    }
    next[idx] = clean;
    commit(next);
    if (clean && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onKeyPress = (idx: number) => (e: TextInputKeyPressEvent) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
      const next = [...digits];
      next[idx - 1] = '';
      onChange(next.join(''));
      refs.current[idx - 1]?.focus();
    }
  };

  return (
    <View className={className}>
      <View className="flex-row gap-2">
        {digits.map((d, idx) => (
          <TextInput
            key={idx}
            ref={(r) => {
              refs.current[idx] = r;
            }}
            value={d}
            onChangeText={(ch) => setAt(idx, ch)}
            onKeyPress={onKeyPress(idx)}
            onFocus={() => setFocusIdx(idx)}
            onBlur={() => setFocusIdx((c) => (c === idx ? -1 : c))}
            keyboardType="number-pad"
            maxLength={idx === 0 ? length : 1}
            selectTextOnFocus
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            accessibilityLabel={`Digit ${idx + 1} of ${length}`}
            // textAlignVertical + no font padding: without these the digit rides high
            // in a fixed-height TextInput on Android.
            textAlignVertical="center"
            style={{ includeFontPadding: false }}
            className={cn(
              'bg-card text-foreground h-14 flex-1 rounded-lg border p-0 text-center text-2xl font-bold',
              error ? 'border-destructive' : focusIdx === idx ? 'border-primary' : 'border-border'
            )}
          />
        ))}
      </View>
      {error ? <Text className="text-destructive mt-2 text-center text-sm">{error}</Text> : null}
    </View>
  );
}
