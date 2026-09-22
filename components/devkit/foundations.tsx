/**
 * Foundations — design-token previews. Every tile is tap-to-copy (the Tailwind class
 * or the token value) so a designer can grab the exact name to use.
 */
import { Text } from '@/components/ui/text';
import { THEME, TOKENS } from '@/lib/theme';
import { useKitTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { useCopy } from './copy';
import type { FoundationSection } from './types';
import { Pressable, View } from 'react-native';

const kebab = (s: string) => s.replace(/([A-Z0-9])/g, '-$1').toLowerCase();

function ColorTokens() {
  const { scheme } = useKitTheme();
  const { copied, copy } = useCopy();
  const entries = Object.entries(THEME[scheme]) as [string, string][];
  return (
    <View className="w-full flex-row flex-wrap gap-3">
      {entries.map(([name, hex]) => {
        const cls = `bg-${kebab(name)}`;
        return (
          <Pressable key={name} onPress={() => copy(name, cls)} className="w-[30%] min-w-[96px] flex-1 gap-1">
            <View className={cn('border-border h-14 rounded-lg border', cls)} />
            <Text className="text-xs font-semibold" numberOfLines={1}>
              {copied === name ? 'Copied ✓' : kebab(name)}
            </Text>
            <Text className="text-muted-foreground font-mono text-xs">{hex}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SpacingTokens() {
  const { copied, copy } = useCopy();
  const entries = Object.entries(TOKENS.space) as [string, number][];
  return (
    <View className="w-full gap-2">
      {entries.map(([step, px]) => (
        <Pressable key={step} onPress={() => copy(step, `p-${step}`)} className="flex-row items-center gap-3">
          <View className="bg-primary h-4 rounded-sm" style={{ width: Math.max(px, 2) }} />
          <Text className="w-12 font-medium">{copied === step ? '✓' : step}</Text>
          <Text className="text-muted-foreground text-sm">
            {px}px · p-{step} / gap-{step} / m-{step}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function RadiusTokens() {
  const { copied, copy } = useCopy();
  const entries = (Object.entries(TOKENS.radius) as [string, number][]).filter(([k]) => k !== 'base');
  return (
    <View className="w-full flex-row flex-wrap gap-4">
      {entries.map(([name, px]) => (
        <Pressable key={name} onPress={() => copy(name, `rounded-${name}`)} className="items-center gap-1">
          <View
            className="bg-card border-border h-14 w-14 border"
            style={{ borderRadius: Math.min(px, 28) }}
          />
          <Text className="text-xs font-semibold">{copied === name ? 'Copied ✓' : `rounded-${name}`}</Text>
          <Text className="text-muted-foreground text-xs">{px === 9999 ? 'full' : `${px}px`}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const TYPE_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'lead', 'default', 'large', 'small', 'muted', 'code'] as const;

function TypeScale() {
  const { copied, copy } = useCopy();
  return (
    <View className="w-full">
      {TYPE_VARIANTS.map((v, i) => (
        <Pressable
          key={v}
          onPress={() => copy(v, v === 'default' ? '<Text>' : `<Text variant="${v}">`)}
          className={cn('border-border py-3', i < TYPE_VARIANTS.length - 1 && 'border-b')}>
          <Text variant={v} className={v === 'h1' ? 'text-left' : undefined}>
            The quick brown fox
          </Text>
          <Text className="text-muted-foreground mt-1 text-xs">
            {copied === v ? 'Copied ✓' : v === 'default' ? '<Text>' : `variant="${v}"`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function FontSizes() {
  const { copied, copy } = useCopy();
  const entries = Object.entries(TOKENS.fontSize) as [string, number][];
  return (
    <View className="w-full gap-2">
      {entries.map(([name, px]) => (
        <Pressable key={name} onPress={() => copy(name, `text-${name}`)} className="flex-row items-baseline gap-3">
          <Text className="w-20 font-medium">{copied === name ? '✓' : `text-${name}`}</Text>
          <Text style={{ fontSize: px }}>Aa</Text>
          <Text className="text-muted-foreground text-sm">{px}px</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Durations() {
  const { copied, copy } = useCopy();
  const entries = Object.entries(TOKENS.duration) as [string, number][];
  return (
    <View className="w-full gap-2">
      {entries.map(([name, ms]) => (
        <Pressable key={name} onPress={() => copy(name, `TOKENS.duration.${name}`)} className="flex-row justify-between">
          <Text className="font-medium">{copied === name ? 'Copied ✓' : name}</Text>
          <Text className="text-muted-foreground text-sm">{ms}ms</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Easings() {
  const { copied, copy } = useCopy();
  const entries = Object.entries(TOKENS.easing) as [string, readonly number[]][];
  const hint: Record<string, string> = {
    standard: 'position changes, most enters',
    emphasized: 'hero moments, reversible',
    exit: 'leaving the screen',
  };
  return (
    <View className="w-full gap-2">
      {entries.map(([name, curve]) => (
        <Pressable key={name} onPress={() => copy(name, `TOKENS.easing.${name}`)} className="gap-0.5">
          <View className="flex-row justify-between">
            <Text className="font-medium">{copied === name ? 'Copied ✓' : name}</Text>
            <Text className="text-muted-foreground font-mono text-xs">cubic-bezier({curve.join(', ')})</Text>
          </View>
          <Text className="text-muted-foreground text-sm">{hint[name]}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export const FOUNDATION_SECTIONS: FoundationSection[] = [
  {
    id: 'colors',
    title: 'Semantic colours',
    category: 'color',
    aliases: ['palette', 'hex', 'background', 'foreground', 'primary', 'muted'],
    caption: 'Tap to copy the bg-* class. text-*, border-* use the same names. Values come from tokens/tokens.json.',
    Demo: ColorTokens,
  },
  {
    id: 'spacing',
    title: 'Spacing',
    category: 'metrics',
    aliases: ['padding', 'margin', 'gap', 'grid'],
    caption: 'The 4-pt grid. Only these steps are allowed. Tap to copy.',
    Demo: SpacingTokens,
  },
  {
    id: 'radius',
    title: 'Corner radius',
    category: 'metrics',
    aliases: ['rounded', 'corner', 'border radius'],
    caption: 'rounded-lg is the base (--radius); md and sm derive from it. Tap to copy.',
    Demo: RadiusTokens,
  },
  {
    id: 'type-scale',
    title: 'Text variants',
    category: 'type',
    aliases: ['typography', 'heading', 'font'],
    caption: 'Use a variant, not ad-hoc size classes. Tap to copy.',
    Demo: TypeScale,
  },
  {
    id: 'font-sizes',
    title: 'Font sizes',
    category: 'type',
    aliases: ['text-sm', 'text-lg', 'size'],
    caption: 'For the rare case a variant does not fit.',
    Demo: FontSizes,
  },
  {
    id: 'durations',
    title: 'Durations',
    category: 'motion',
    aliases: ['animation', 'timing', 'ms'],
    caption: 'fast for micro-feedback, base for most transitions, slow for large surfaces.',
    Demo: Durations,
  },
  {
    id: 'easings',
    title: 'Easing curves',
    category: 'motion',
    aliases: ['bezier', 'curve', 'animation'],
    Demo: Easings,
  },
];
