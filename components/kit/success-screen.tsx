import { Spinner } from '@/components/kit/spinner';
import { Spot } from '@/components/kit/spot';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type Props = {
  title: string;
  body?: string;
  /** Big primary-coloured amount between title and body. */
  amount?: string;
  amountSubtitle?: string;
  /** Spinner instead of the check; hides text — for in-flight operations. */
  loading?: boolean;
  /** Extra content under the body (SummaryCard, buttons…). */
  children?: React.ReactNode;
  className?: string;
};

/** The one success template. Centred check, title, optional amount, body. Actions go in a StickyBottomBar. */
export function SuccessScreen({ title, body, amount, amountSubtitle, loading, children, className }: Props) {
  return (
    <View className={cn('flex-1 items-center justify-center px-6', className)}>
      {loading ? (
        <View className="bg-primary/15 mb-7 size-24 items-center justify-center rounded-full">
          <Spinner size="large" />
        </View>
      ) : (
        <Spot icon={CheckIcon} size="md" tone="primary" ring className="mb-7" />
      )}
      {!loading ? (
        <View className="w-full max-w-xs items-center gap-2">
          <Text variant="h3" className="text-center">
            {title}
          </Text>
          {amount ? <Text className="text-primary text-center text-4xl font-bold">{amount}</Text> : null}
          {amountSubtitle ? <Text className="text-muted-foreground text-center">{amountSubtitle}</Text> : null}
          {body ? <Text className="text-muted-foreground text-center">{body}</Text> : null}
          {children ? <View className="mt-4 w-full">{children}</View> : null}
        </View>
      ) : null}
    </View>
  );
}
