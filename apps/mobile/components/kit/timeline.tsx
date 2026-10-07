import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react-native';
import { View } from 'react-native';

export type TimelineItem = {
  title: string;
  /** When it happened, or is expected: "12 Jun, 10:02", "Expected Fri". */
  time?: string;
  description?: string;
  state: 'done' | 'current' | 'upcoming';
};

type Props = {
  items: TimelineItem[];
  /** The colour of what is done: `success` for orders and deliveries, `primary` for neutral processes. */
  tone?: 'success' | 'primary';
  className?: string;
};

const SPOKEN = { done: 'done', current: 'in progress', upcoming: 'not yet' } as const;

/**
 * Vertical status steps joined by a line: an order, a delivery, an application. Done steps are filled
 * with a tick, the current one is ringed, upcoming ones are hollow and muted. Each step is announced
 * as one item ("On its way, in progress, 13 Jun").
 */
export function Timeline({ items, tone = 'success', className }: Props) {
  const fill = tone === 'success' ? 'bg-success' : 'bg-primary';
  const ring = tone === 'success' ? 'border-success' : 'border-primary';
  return (
    <View role="list" className={className}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const next = items[i + 1];
        return (
          <View
            key={`${item.title}-${i}`}
            role="listitem"
            accessible
            aria-label={[item.title, SPOKEN[item.state], item.time, item.description].filter(Boolean).join(', ')}
            className="flex-row gap-3">
            <View className="items-center">
              <View
                className={cn(
                  'size-6 items-center justify-center rounded-full',
                  item.state === 'done' && fill,
                  item.state === 'current' && cn('bg-background border-2', ring),
                  item.state === 'upcoming' && 'bg-background border-muted-foreground border-2'
                )}>
                {item.state === 'done' ? (
                  <Icon as={CheckIcon} size={14} className={tone === 'success' ? 'text-success-foreground' : 'text-primary-foreground'} />
                ) : item.state === 'current' ? (
                  <View className={cn('size-2.5 rounded-full', fill)} />
                ) : null}
              </View>
              {!last ? <View className={cn('min-h-4 w-0.5 flex-1', next && next.state !== 'upcoming' ? fill : 'bg-border')} /> : null}
            </View>
            <View className={cn('flex-1 gap-0.5 pt-0.5', !last && 'pb-5')}>
              <Text className={item.state === 'upcoming' ? 'text-muted-foreground' : 'font-medium'}>{item.title}</Text>
              {item.time ? <Text className="text-muted-foreground text-sm">{item.time}</Text> : null}
              {item.description ? <Text className="text-muted-foreground text-sm">{item.description}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
