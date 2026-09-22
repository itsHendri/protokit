import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import {
  BellIcon,
  CalendarIcon,
  CameraIcon,
  HeartIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
  WalletIcon,
} from 'lucide-react-native';
import { View } from 'react-native';

const SAMPLE_ICONS = [
  ['Bell', BellIcon],
  ['Calendar', CalendarIcon],
  ['Camera', CameraIcon],
  ['Heart', HeartIcon],
  ['Lock', LockIcon],
  ['Mail', MailIcon],
  ['MapPin', MapPinIcon],
  ['Search', SearchIcon],
  ['Settings', SettingsIcon],
  ['Star', StarIcon],
  ['User', UserIcon],
  ['Wallet', WalletIcon],
] as const;

function IconDemo() {
  return (
    <View className="w-full flex-row flex-wrap gap-4">
      {SAMPLE_ICONS.map(([name, as]) => (
        <View key={name} className="w-16 items-center gap-1">
          <Icon as={as} size={24} />
          <Text className="text-muted-foreground text-xs">{name}</Text>
        </View>
      ))}
    </View>
  );
}

function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted w-full items-center justify-center overflow-hidden rounded-md">
      <Text className="text-muted-foreground text-sm">16 : 9</Text>
    </AspectRatio>
  );
}

export const MEDIA_SECTIONS: ComponentSection[] = [
  {
    id: 'icon',
    title: 'Icon',
    category: 'media',
    aliases: ['lucide', 'glyph', 'symbol'],
    api: '<Icon as={LucideIcon} size? className="text-…" />',
    caption: 'Lucide has 1,500+ icons. Colour with a text-* class; never import lucide outside this atom.',
    Demo: IconDemo,
  },
  {
    id: 'aspect-ratio',
    title: 'Aspect ratio',
    category: 'media',
    aliases: ['image', 'thumbnail', '16:9'],
    api: '<AspectRatio ratio={16 / 9}>…</AspectRatio>',
    Demo: AspectRatioDemo,
  },
];
