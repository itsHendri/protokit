import { ActionSheet, OptionSheet, Sheet } from '@/components/kit/sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import { PencilIcon, ShareIcon, Trash2Icon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

function SheetDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onPress={() => setOpen(true)}>
        <Text>Open sheet</Text>
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Custom content" description="Anything goes in here.">
        <View className="gap-3 px-5 pb-2">
          <Text>Sheets scroll and cap at 85% of the screen.</Text>
          <Button onPress={() => setOpen(false)}>
            <Text>Done</Text>
          </Button>
        </View>
      </Sheet>
    </>
  );
}

const CURRENCIES = [
  { value: 'usd', label: 'US Dollar', description: 'USD' },
  { value: 'eur', label: 'Euro', description: 'EUR' },
  { value: 'gbp', label: 'British Pound', description: 'GBP' },
] as const;

function OptionSheetDemo() {
  const [open, setOpen] = React.useState(false);
  const [v, setV] = React.useState<'usd' | 'eur' | 'gbp'>('usd');
  return (
    <>
      <Button variant="outline" onPress={() => setOpen(true)}>
        <Text>Currency: {v.toUpperCase()}</Text>
      </Button>
      <OptionSheet open={open} onClose={() => setOpen(false)} title="Display currency" options={CURRENCIES} value={v} onChange={setV} />
    </>
  );
}

function ActionSheetDemo() {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState('');
  return (
    <View className="gap-2">
      <Button variant="outline" onPress={() => setOpen(true)}>
        <Text>Manage item</Text>
      </Button>
      {last ? <Text className="text-muted-foreground text-sm">Last action: {last}</Text> : null}
      <ActionSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Manage transaction"
        items={[
          { label: 'Share receipt', icon: ShareIcon, onPress: () => setLast('share') },
          { label: 'Edit note', icon: PencilIcon, onPress: () => setLast('edit') },
          { label: 'Delete', icon: Trash2Icon, destructive: true, onPress: () => setLast('delete') },
        ]}
      />
    </View>
  );
}

export const KIT_OVERLAYS_SECTIONS: ComponentSection[] = [
  { id: 'sheet', title: 'Sheet', category: 'overlays', aliases: ['bottom sheet', 'drawer', 'modal sheet'], api: '<Sheet open onClose title? description?>{children}</Sheet>', caption: 'The base for OptionSheet and ActionSheet. Native mobile pattern; prefer over Dialog for pickers.', Demo: SheetDemo },
  { id: 'option-sheet', title: 'Option sheet', category: 'overlays', aliases: ['picker', 'select sheet', 'choose one'], api: '<OptionSheet open onClose title options={[{value,label,description?,icon?}]} value onChange />', Demo: OptionSheetDemo },
  { id: 'action-sheet', title: 'Action sheet', category: 'overlays', aliases: ['actions', 'more menu', 'share delete'], api: '<ActionSheet open onClose title? items={[{label,icon?,destructive?,onPress}]} />', Demo: ActionSheetDemo },
];
