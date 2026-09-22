import { EmptyState } from '@/components/kit/empty-state';
import { Spinner } from '@/components/kit/spinner';
import { SuccessScreen } from '@/components/kit/success-screen';
import { useToast } from '@/components/kit/toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { InboxIcon, SearchXIcon } from 'lucide-react-native';
import { View } from 'react-native';

function ToastDemo() {
  const toast = useToast();
  return (
    <View className="flex-row flex-wrap gap-2">
      <Button size="sm" variant="outline" onPress={() => toast.success('Saved')}>
        <Text>Success</Text>
      </Button>
      <Button size="sm" variant="outline" onPress={() => toast.error('Something went wrong')}>
        <Text>Error</Text>
      </Button>
      <Button size="sm" variant="outline" onPress={() => toast.warning('Check your details')}>
        <Text>Warning</Text>
      </Button>
      <Button size="sm" variant="outline" onPress={() => toast.info('Copied to clipboard')}>
        <Text>Info</Text>
      </Button>
    </View>
  );
}

function SpinnerDemo() {
  return (
    <View className="flex-row items-center gap-6">
      <Spinner />
      <Spinner size="large" />
      <Spinner tone="muted" />
      <Button disabled>
        <Spinner tone="foreground" />
        <Text>Loading</Text>
      </Button>
    </View>
  );
}

function EmptyStateDemo() {
  return (
    <View className="w-full gap-4">
      <Card className="w-full py-0">
        <EmptyState icon={InboxIcon} title="Nothing here yet" subtitle="Items you add will show up in this list." action={{ label: 'Add an item', onPress: () => {} }} />
      </Card>
      <Card className="w-full py-0">
        <EmptyState variant="compact" icon={SearchXIcon} title="No results" subtitle="Try a different search." action={{ label: 'Clear filters', onPress: () => {} }} />
      </Card>
    </View>
  );
}

function SuccessScreenDemo() {
  return (
    <Card className="w-full py-2">
      <SuccessScreen title="You are all set" body="Your changes are saved and everything is ready to go." className="py-6" />
    </Card>
  );
}

export const KIT_FEEDBACK_SECTIONS: ComponentSection[] = [
  { id: 'toast', title: 'Toast', category: 'feedback', aliases: ['snackbar', 'notification', 'message', 'copied'], api: 'const toast = useToast(); toast.success("Saved") · .error · .warning · .info', caption: 'Transient, bottom-anchored, tap to dismiss. Persistent messages use Alert.', Demo: ToastDemo },
  { id: 'spinner', title: 'Spinner', category: 'feedback', aliases: ['loading', 'activity indicator'], api: '<Spinner size="small|large" tone="primary|foreground|muted" />', Demo: SpinnerDemo },
  { id: 'empty-state', title: 'Empty state', category: 'feedback', aliases: ['no results', 'nothing here', 'zero state'], api: '<EmptyState icon title subtitle? action? variant="default|compact" />', Demo: EmptyStateDemo },
  { id: 'success-screen', title: 'Success screen', category: 'feedback', aliases: ['done', 'confirmation', 'checkmark', 'complete'], api: '<SuccessScreen title body? amount? amountSubtitle? loading?>{extra}</SuccessScreen>', caption: 'Use for EVERY success state: signup done, booking confirmed, order placed. Optional amount/subtitle when a value matters. Actions go in a StickyBottomBar below it.', Demo: SuccessScreenDemo },
];
