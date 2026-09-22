import { CATEGORIES } from '@/components/devkit/categories';
import { FOUNDATION_SECTIONS, SECTIONS } from '@/components/devkit/registry';
import { ListRow } from '@/components/kit/list-row';
import { SectionHeader } from '@/components/kit/section-header';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { BlocksIcon, BookOpenIcon, SmartphoneIcon, SwatchBookIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

export default function KitHome() {
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-6 p-5 pb-16" contentInsetAdjustmentBehavior="automatic">
      <View className="gap-2">
        <Text variant="h2" className="border-0 pb-0">
          Prototype Kit
        </Text>
        <Text className="text-muted-foreground">
          A themeable Expo starter for mobile prototypes. Everything a screen needs is already here and previewed live.
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Stat label="Components" value={SECTIONS.length} />
        <Stat label="Categories" value={CATEGORIES.length} />
        <Stat label="Token groups" value={FOUNDATION_SECTIONS.length} />
      </View>

      <View className="gap-3">
        <SectionHeader title="Browse" />
        <Card className="w-full gap-0 px-4 py-0">
          <Link href="/(kit)/foundations" asChild>
            <ListRow leading={<Icon as={SwatchBookIcon} size={22} className="text-primary" />} title="Foundations" subtitle="Colour, spacing, radius, type, motion" chevron onPress={() => {}} />
          </Link>
          <Link href="/(kit)/kitchen-sink" asChild>
            <ListRow leading={<Icon as={BlocksIcon} size={22} className="text-primary" />} title="Components" subtitle={`${SECTIONS.length} previews in ${CATEGORIES.length} categories`} chevron onPress={() => {}} />
          </Link>
          <Link href="/(sample)/(tabs)" asChild>
            <ListRow leading={<Icon as={SmartphoneIcon} size={22} className="text-primary" />} title="Sample app" subtitle="A worked example built only from the kit" chevron onPress={() => {}} last />
          </Link>
        </Card>
      </View>

      <View className="gap-3">
        <SectionHeader title="How it works" />
        <Card className="w-full gap-4 px-4 py-4">
          <Step n={1} title="Pick from what exists" body="Screens are composed only from registry components. Search Components, tap a title to copy its API." />
          <Step n={2} title="Copy token names, not values" body="Foundations tiles copy the Tailwind class (bg-primary, p-4, rounded-lg). Colours follow light and dark automatically." />
          <Step n={3} title="Hand it a brief" body="The transcript-to-prototype skill turns a conversation into screens, using the same rules." />
        </Card>
      </View>

      <View className="flex-row items-center gap-2 px-1">
        <Icon as={BookOpenIcon} size={14} className="text-muted-foreground" />
        <Text className="text-muted-foreground text-xs">DESIGN_SYSTEM.md and AGENTS.md hold the full rules.</Text>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View className="bg-card border-border flex-1 gap-0.5 rounded-lg border p-3">
      <Text className="text-2xl font-semibold">{value}</Text>
      <Text className="text-muted-foreground text-xs">{label}</Text>
    </View>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <View className="flex-row gap-3">
      <View className="bg-primary/15 size-6 items-center justify-center rounded-full">
        <Text className="text-primary text-xs font-semibold">{n}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="font-medium">{title}</Text>
        <Text className="text-muted-foreground text-sm">{body}</Text>
      </View>
    </View>
  );
}
