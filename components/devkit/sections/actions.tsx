import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Toggle, ToggleIcon } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ComponentSection } from '../types';
import * as Haptics from 'expo-haptics';
import { BoldIcon, ChevronRightIcon, ItalicIcon, Loader2Icon, MailIcon, UnderlineIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function ButtonDemo() {
  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center gap-2">
        <Button className="flex-1">
          <Text>Primary</Text>
        </Button>
        <Button variant="secondary" className="flex-1">
          <Text>Secondary</Text>
        </Button>
        <Button variant="outline" className="flex-1">
          <Text>Outline</Text>
        </Button>
      </View>
      <View className="flex-row items-center gap-2">
        <Button variant="ghost" className="flex-1">
          <Text>Ghost</Text>
        </Button>
        <Button variant="link" className="flex-1">
          <Text>Link</Text>
        </Button>
        <Button variant="destructive" className="flex-1">
          <Text>Destructive</Text>
        </Button>
      </View>
      <View className="flex-row flex-wrap items-center gap-2">
        <Button size="sm">
          <Text>Small</Text>
        </Button>
        <Button size="lg">
          <Text>Large</Text>
        </Button>
        <Button>
          <Icon as={MailIcon} className="text-primary-foreground" />
          <Text>With icon</Text>
        </Button>
        <Button disabled>
          <View className="pointer-events-none animate-spin">
            <Icon as={Loader2Icon} className="text-primary-foreground" />
          </View>
          <Text>Loading</Text>
        </Button>
        <Button variant="outline" size="icon" accessibilityLabel="Next">
          <Icon as={ChevronRightIcon} />
        </Button>
      </View>
    </View>
  );
}

function ToggleDemo() {
  const [pressed, setPressed] = React.useState(false);
  return (
    <Toggle
      aria-label="Toggle bold"
      pressed={pressed}
      onPressedChange={(next) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPressed(next);
      }}>
      <ToggleIcon as={BoldIcon} />
    </Toggle>
  );
}

function ToggleGroupDemo() {
  const [value, setValue] = React.useState<string[]>(['bold']);
  return (
    <ToggleGroup
      value={value}
      onValueChange={(next) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setValue(next);
      }}
      variant="outline"
      type="multiple">
      <ToggleGroupItem isFirst value="bold" aria-label="Toggle bold">
        <ToggleGroupIcon as={BoldIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ToggleGroupIcon as={ItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem isLast value="underline" aria-label="Toggle underline">
        <ToggleGroupIcon as={UnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export const ACTIONS_SECTIONS: ComponentSection[] = [
  {
    id: 'button',
    title: 'Button',
    category: 'actions',
    aliases: ['cta', 'primary', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'loading'],
    api: '<Button variant? size? disabled?><Text>…</Text></Button>',
    caption: 'Children are Text and Icon, never a bare string. One primary button per screen.',
    Demo: ButtonDemo,
  },
  {
    id: 'toggle',
    title: 'Toggle',
    category: 'actions',
    aliases: ['pressed', 'two-state button'],
    api: '<Toggle pressed onPressedChange><ToggleIcon as={…} /></Toggle>',
    Demo: ToggleDemo,
  },
  {
    id: 'toggle-group',
    title: 'Toggle group',
    category: 'actions',
    aliases: ['segmented', 'multi select buttons'],
    api: '<ToggleGroup type="single|multiple" value onValueChange><ToggleGroupItem value … /></ToggleGroup>',
    caption: 'Use type="single" for a segmented control.',
    Demo: ToggleGroupDemo,
  },
];
