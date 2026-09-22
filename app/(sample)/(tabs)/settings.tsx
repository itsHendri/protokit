import { IconCircle } from '@/components/kit/icon-circle';
import { ListRow } from '@/components/kit/list-row';
import { SectionHeader } from '@/components/kit/section-header';
import { OptionSheet } from '@/components/kit/sheet';
import { useToast } from '@/components/kit/toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { BellIcon, GlobeIcon, LockIcon, LogOutIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

const CURRENCIES = [
  { value: 'usd', label: 'US Dollar', description: 'USD' },
  { value: 'eur', label: 'Euro', description: 'EUR' },
  { value: 'gbp', label: 'British Pound', description: 'GBP' },
] as const;

export default function SampleSettings() {
  const router = useRouter();
  const toast = useToast();
  const [notifications, setNotifications] = React.useState(true);
  const [currency, setCurrency] = React.useState<'usd' | 'eur' | 'gbp'>('usd');
  const [pickerOpen, setPickerOpen] = React.useState(false);

  return (
    <ScrollView className="bg-background flex-1" contentContainerClassName="gap-5 p-5 pb-16">
      <View className="flex-row items-center gap-4">
        <Avatar alt="Jane Doe" className="size-14">
          <AvatarFallback>
            <Text>JD</Text>
          </AvatarFallback>
        </Avatar>
        <View>
          <Text className="text-lg font-semibold">Jane Doe</Text>
          <Text className="text-muted-foreground text-sm">jane@example.com</Text>
        </View>
      </View>

      <View className="gap-3">
        <SectionHeader title="Preferences" />
        <Card className="w-full gap-0 px-4 py-0">
          <ListRow leading={<IconCircle as={BellIcon} />} title="Notifications" subtitle="Payments and alerts" trailing={<Switch checked={notifications} onCheckedChange={setNotifications} />} />
          <ListRow leading={<IconCircle as={GlobeIcon} />} title="Display currency" value={currency.toUpperCase()} chevron onPress={() => setPickerOpen(true)} />
          <ListRow leading={<IconCircle as={LockIcon} />} title="Security" subtitle="Passcode, Face ID" chevron onPress={() => toast.info('Security screen not in the sample')} last />
        </Card>
      </View>

      <Button variant="outline" onPress={() => router.replace('/(kit)')}>
        <Icon as={LogOutIcon} />
        <Text>Back to the kit</Text>
      </Button>

      <OptionSheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Display currency" options={CURRENCIES} value={currency} onChange={setCurrency} />
    </ScrollView>
  );
}
