import { CATEGORIES } from '@/components/devkit/categories';
import { FOUNDATION_SECTIONS, SECTIONS } from '@/components/devkit/registry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { ArrowRightIcon } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

export default function KitHome() {
  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-5 p-5 pb-16">
      <View className="gap-2">
        <Text variant="h2" className="border-0 pb-0">
          Prototype Kit
        </Text>
        <Text className="text-muted-foreground">
          A themeable Expo starter for mobile prototypes. Browse the components, copy token names
          from Foundations, then build screens only from what is here.
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Stat label="Components" value={SECTIONS.length} />
        <Stat label="Categories" value={CATEGORIES.length} />
        <Stat label="Token groups" value={FOUNDATION_SECTIONS.length} />
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Start here</CardTitle>
          <CardDescription>Everything a screen needs, in one place.</CardDescription>
        </CardHeader>
        <CardContent className="gap-2">
          <Link href="/(kit)/kitchen-sink" asChild>
            <Button variant="outline" className="justify-between">
              <Text>Browse components</Text>
              <Icon as={ArrowRightIcon} />
            </Button>
          </Link>
          <Link href="/(kit)/foundations" asChild>
            <Button variant="outline" className="justify-between">
              <Text>Colours, spacing, type</Text>
              <Icon as={ArrowRightIcon} />
            </Button>
          </Link>
          <Link href="/(sample)/(tabs)" asChild>
            <Button className="justify-between">
              <Text>Open the sample app</Text>
              <Icon as={ArrowRightIcon} className="text-primary-foreground" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <View className="gap-2">
        <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
          Categories
        </Text>
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href={{ pathname: '/(kit)/kitchen-sink/[category]', params: { category: cat.id } }} asChild>
            <Button variant="ghost" className="h-auto justify-start gap-3 px-2 py-2">
              <Icon as={cat.icon} className="text-primary" size={20} />
              <View className="flex-1">
                <Text className="font-medium">{cat.label}</Text>
                <Text className="text-muted-foreground text-sm">{cat.blurb}</Text>
              </View>
              <Text className="text-muted-foreground text-sm">
                {SECTIONS.filter((s) => s.category === cat.id).length}
              </Text>
            </Button>
          </Link>
        ))}
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
