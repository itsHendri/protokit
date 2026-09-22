import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

export type KeyValueRow = { label: string; value: string; valueClassName?: string };

type ListProps = { rows: KeyValueRow[]; className?: string };

/** Label/value rows (order summaries, details). */
export function KeyValueList({ rows, className }: ListProps) {
  return (
    <View className={cn('gap-3', className)}>
      {rows.map((r, i) => (
        <View key={`${r.label}-${i}`} className="flex-row items-start justify-between gap-4">
          <Text className="text-muted-foreground text-sm">{r.label}</Text>
          <Text className={cn('flex-shrink text-right text-sm font-medium', r.valueClassName)}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

type CardProps = ListProps & { title?: string };

/** KeyValueList inside a Card — confirmations, receipts, loan details. */
export function SummaryCard({ title, rows, className }: CardProps) {
  return (
    <Card className={cn('w-full gap-4 py-4', className)}>
      {title ? (
        <CardHeader className="px-4">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="px-4">
        <KeyValueList rows={rows} />
      </CardContent>
    </Card>
  );
}
