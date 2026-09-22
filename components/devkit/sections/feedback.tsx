import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ComponentSection } from '../types';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react-native';
import * as React from 'react';
import { Platform, View } from 'react-native';

function AlertDemo() {
  return (
    <View className="w-full gap-3">
      <Alert variant="success" icon={CircleCheckIcon}>
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>Everything is up to date.</AlertDescription>
      </Alert>
      <Alert variant="info" icon={InfoIcon}>
        <AlertTitle>Scheduled maintenance tonight</AlertTitle>
        <AlertDescription>Some features pause between 02:00 and 03:00.</AlertDescription>
      </Alert>
      <Alert variant="warning" icon={TriangleAlertIcon}>
        <AlertTitle>Storage almost full</AlertTitle>
        <AlertDescription>Free up space to keep syncing.</AlertDescription>
      </Alert>
      <Alert variant="destructive" icon={CircleAlertIcon}>
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>Check your connection and try again.</AlertDescription>
      </Alert>
      <Alert icon={InfoIcon}>
        <AlertTitle>Neutral, title only</AlertTitle>
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
    api: '<Alert icon variant="default|info|success|warning|destructive"><AlertTitle /><AlertDescription /></Alert>',
    caption: 'Inline and persistent, tinted by tone. For transient messages use Toast.',
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
