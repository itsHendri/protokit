import { cn } from '@/lib/utils';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  /** No fill and no top border — for CTAs floating over hero art. */
  transparent?: boolean;
  className?: string;
};

/**
 * Safe-area-aware action bar pinned under a scroll view. Children always share the width
 * equally (one child fills it). Give the ScrollView ~pb-32 so content clears the bar.
 */
export function StickyBottomBar({ children, transparent, className }: Props) {
  const insets = useSafeAreaInsets();
  const kids = React.Children.toArray(children);
  return (
    <View
      className={cn('flex-row gap-3 px-5 pt-3', !transparent && 'bg-background border-border border-t', className)}
      style={{ paddingBottom: insets.bottom + 12 }}>
      {kids.map((k, i) => (
        <View key={i} className="flex-1">
          {k}
        </View>
      ))}
    </View>
  );
}
