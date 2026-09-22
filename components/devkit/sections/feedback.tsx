import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ComponentSection } from '../types';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from 'lucide-react-native';
import * as React from 'react';
import { Platform, View } from 'react-native';

function AlertDemo() {
  return (
    <View className="w-full gap-3">
      <Alert icon={CircleCheckIcon}>
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>
      <Alert icon={InfoIcon}>
        <AlertTitle>Title only, no description.</AlertTitle>
      </Alert>
      <Alert variant="destructive" icon={CircleAlertIcon}>
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Check your card details and try again.</AlertDescription>
      </Alert>
    </View>
  );
}

function ProgressDemo() {
  const [value, setValue] = React.useState(20);
  return (
    <View className="w-full gap-3">
      <Progress value={value} />
      <View className="flex-row gap-2">
        <Button size="sm" variant="outline" onPress={() => setValue((v) => Math.max(0, v - 20))}>
          <Text>−20</Text>
        </Button>
        <Button size="sm" variant="outline" onPress={() => setValue((v) => Math.min(100, v + 20))}>
          <Text>+20</Text>
        </Button>
        <Text className="text-muted-foreground self-center text-sm">{value}%</Text>
      </View>
    </View>
  );
}

function SkeletonDemo() {
  return (
    <View className="flex-row items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <View className="gap-2">
        <Skeleton className="h-4 w-[220px]" />
        <Skeleton className="h-4 w-[160px]" />
      </View>
    </View>
  );
}

function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Text>{Platform.select({ web: 'Hover me', default: 'Press me' })}</Text>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <Text>Add to library</Text>
      </TooltipContent>
    </Tooltip>
  );
}

export const FEEDBACK_SECTIONS: ComponentSection[] = [
  {
    id: 'alert',
    title: 'Alert',
    category: 'feedback',
    aliases: ['inline message', 'banner', 'callout', 'error', 'success'],
    api: '<Alert icon variant="default|destructive"><AlertTitle /><AlertDescription /></Alert>',
    caption: 'Inline, persistent. For transient messages use Toast (coming in the kit layer).',
    Demo: AlertDemo,
  },
  {
    id: 'progress',
    title: 'Progress',
    category: 'feedback',
    aliases: ['bar', 'loading', 'percent', 'determinate'],
    api: '<Progress value={0–100} />',
    Demo: ProgressDemo,
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    category: 'feedback',
    aliases: ['placeholder', 'shimmer', 'loading'],
    api: '<Skeleton className="h-4 w-40" />',
    caption: 'Match the shape of the content it stands in for.',
    Demo: SkeletonDemo,
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    category: 'feedback',
    aliases: ['hint', 'hover'],
    api: '<Tooltip><TooltipTrigger asChild /><TooltipContent><Text /></TooltipContent></Tooltip>',
    Demo: TooltipDemo,
  },
];
