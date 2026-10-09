import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { View } from 'react-native';

type Props = {
  /** Text blocks: `Text variant="p"` paragraphs, h2–h4 headings, `blockquote`, `code`. */
  children: React.ReactNode;
  className?: string;
};

/**
 * Long-form text at the theme's typeset: blocks are `flow` apart (gap-flow), lines stop at the `measure`
 * (max-w-measure), and `Text variant="p"` paragraphs take its leading (leading-prose). The variants' own top
 * margins are switched off inside, so the flow is the only spacing. Text only: no cards or buttons inside.
 */
export function Prose({ children, className }: Props) {
  return (
    <TextClassContext.Provider value="mt-0 sm:mt-0">
      <View className={cn('max-w-measure w-full gap-flow', className)}>{children}</View>
    </TextClassContext.Provider>
  );
}
