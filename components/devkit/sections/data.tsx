import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { BadgeCheckIcon } from 'lucide-react-native';
import { View } from 'react-native';

function TextDemo() {
  return (
    <View className="w-full gap-2">
      <Text variant="h1" className="text-left">
        Heading 1
      </Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="lead">Lead — a short intro sentence.</Text>
      <Text>Default body text at 16px.</Text>
      <Text variant="large">Large body text.</Text>
      <Text variant="small">Small label text.</Text>
      <Text variant="muted">Muted helper text.</Text>
      <Text>
        Inline <Text variant="code">code</Text> sample.
      </Text>
      <Text variant="blockquote">A quoted line, indented with a rule.</Text>
    </View>
  );
}

function AvatarDemo() {
  return (
    <View className="flex-row flex-wrap items-center gap-6">
      <Avatar alt="Expo">
        <AvatarImage source={{ uri: 'https://github.com/expo.png' }} />
        <AvatarFallback>
          <Text>EX</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar alt="Initials only">
        <AvatarFallback>
          <Text>JD</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar alt="Square" className="rounded-lg">
        <AvatarFallback>
          <Text>SQ</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-row">
        {['AB', 'CD', 'EF'].map((i) => (
          <Avatar key={i} alt={i} className="border-background -mr-2 border-2">
            <AvatarFallback>
              <Text>{i}</Text>
            </AvatarFallback>
          </Avatar>
        ))}
      </View>
    </View>
  );
}

function BadgeDemo() {
  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-2">
        <Badge>
          <Text>Default</Text>
        </Badge>
        <Badge variant="secondary">
          <Text>Secondary</Text>
        </Badge>
        <Badge variant="destructive">
          <Text>Destructive</Text>
        </Badge>
        <Badge variant="outline">
          <Text>Outline</Text>
        </Badge>
      </View>
      <View className="flex-row flex-wrap gap-2">
        <Badge className="bg-success">
          <Icon as={BadgeCheckIcon} className="text-success-foreground" />
          <Text className="text-success-foreground">Verified</Text>
        </Badge>
        <Badge className="min-w-5 rounded-full px-1">
          <Text>8</Text>
        </Badge>
        <Badge className="min-w-5 rounded-full px-1" variant="destructive">
          <Text>99+</Text>
        </Badge>
      </View>
    </View>
  );
}

function SeparatorDemo() {
  return (
    <View className="w-full">
      <View className="gap-1">
        <Text className="text-sm font-medium leading-none">Section title</Text>
        <Text className="text-muted-foreground text-sm">Supporting description.</Text>
      </View>
      <Separator className="my-4" />
      <View className="h-5 flex-row items-center gap-4">
        <Text className="text-sm">Blog</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Docs</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Source</Text>
      </View>
    </View>
  );
}

export const DATA_SECTIONS: ComponentSection[] = [
  {
    id: 'text',
    title: 'Text',
    category: 'data',
    aliases: ['typography', 'heading', 'paragraph', 'label'],
    api: '<Text variant="h1|h2|h3|h4|p|lead|large|small|muted|code|blockquote" />',
    caption: 'Always use this Text, never react-native’s, so colour and font follow the theme.',
    Demo: TextDemo,
  },
  {
    id: 'avatar',
    title: 'Avatar',
    category: 'data',
    aliases: ['profile', 'user', 'initials'],
    api: '<Avatar alt><AvatarImage source /><AvatarFallback><Text /></AvatarFallback></Avatar>',
    Demo: AvatarDemo,
  },
  {
    id: 'badge',
    title: 'Badge',
    category: 'data',
    aliases: ['tag', 'chip', 'pill', 'count', 'status'],
    api: '<Badge variant="default|secondary|destructive|outline"><Text /></Badge>',
    caption: 'Tint with a semantic class (bg-success + text-success-foreground), never a raw colour.',
    Demo: BadgeDemo,
  },
  {
    id: 'separator',
    title: 'Separator',
    category: 'data',
    aliases: ['divider', 'rule', 'hairline'],
    api: '<Separator orientation="horizontal|vertical" />',
    Demo: SeparatorDemo,
  },
];
