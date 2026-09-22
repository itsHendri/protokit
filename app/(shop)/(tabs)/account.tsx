import { IconCircle } from '@/components/kit/icon-circle';
import { ListRow } from '@/components/kit/list-row';
import { SectionHeader } from '@/components/kit/section-header';
import { useToast } from '@/components/kit/toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { BellIcon, CreditCardIcon, MapPinIcon } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function Account() {
  const toast = useToast();
  const [promos, setPromos] = React.useState(false);
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
        <SectionHeader title="Account" />
        <Card className="w-full gap-0 px-4 py-0">
          <ListRow leading={<IconCircle as={MapPinIcon} />} title="Addresses" subtitle="12 Orchard Lane, Cape Town" chevron onPress={() => toast.info('Not part of the sample')} />
          <ListRow leading={<IconCircle as={CreditCardIcon} />} title="Payment methods" subtitle="Visa ending 4242" chevron onPress={() => toast.info('Not part of the sample')} />
          <ListRow leading={<IconCircle as={BellIcon} />} title="Promotions" subtitle="Occasional offers by email" trailing={<Switch checked={promos} onCheckedChange={setPromos} />} last />
        </Card>
      </View>
    </ScrollView>
  );
}
