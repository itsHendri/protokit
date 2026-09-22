import { BiometricGate } from '@/components/kit/biometric-gate';
import { CodeScanner } from '@/components/kit/code-scanner';
import { useNotify } from '@/components/kit/notify';
import { PermissionPrimer } from '@/components/kit/permission-primer';
import { PhotoCapture } from '@/components/kit/photo-capture';
import { useShare } from '@/components/kit/share';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useNativeMode } from '@/lib/native-context';
import { CheckIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import type { ComponentSection } from '../types';

function ModeNote() {
  const { mode } = useNativeMode();
  if (mode !== 'simulate') return null;
  return (
    <Text className="text-muted-foreground text-sm">
      &ldquo;Simulate device features&rdquo; is on in Settings — everything here is showing its fallback.
    </Text>
  );
}

function PhotoCaptureDemo() {
  const [uri, setUri] = React.useState<string | null>(null);
  return (
    <View className="w-full gap-3">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <PhotoCapture value={uri} onChange={setUri} label="Add a photo" seed="demo-photo" />
        </View>
        <View className="w-28">
          <PhotoCapture shape="avatar" sources={['library']} label="Avatar" seed="demo-avatar" />
        </View>
      </View>
      <ModeNote />
    </View>
  );
}

function CodeScannerDemo() {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <View className="w-full gap-3">
      <CodeScanner ratio={4 / 3} onScan={(value) => setLast(value)} />
      <Text className="text-muted-foreground text-sm">
        {last ? `Scanned: ${last}` : 'Nothing scanned yet.'}
      </Text>
    </View>
  );
}

function BiometricGateDemo() {
  const [round, setRound] = React.useState(0);
  return (
    <View className="w-full gap-3">
      <Card className="w-full px-4 py-4">
        <BiometricGate
          key={round}
          title="Account details"
          subtitle="Unlock to see the balance and card number."
          className="py-6">
          <View className="items-center gap-2 py-6">
            <Text variant="h4">$4,182.00</Text>
            <Text className="text-muted-foreground text-sm">•••• •••• •••• 4429</Text>
          </View>
        </BiometricGate>
      </Card>
      <Button size="sm" variant="outline" onPress={() => setRound((r) => r + 1)}>
        <Text>Lock again</Text>
      </Button>
    </View>
  );
}

function PermissionPrimerDemo() {
  const [done, setDone] = React.useState<string | null>(null);
  if (done) {
    return (
      <View className="w-full gap-3">
        <Text className="text-muted-foreground text-sm">You chose: {done}</Text>
        <Button size="sm" variant="outline" onPress={() => setDone(null)}>
          <Text>Show the primer again</Text>
        </Button>
      </View>
    );
  }
  return (
    <Card className="w-full px-2 py-2">
      <PermissionPrimer
        capability="notify"
        onAllow={() => setDone('Allow alerts')}
        onSkip={() => setDone('Show them in the app instead')}
      />
    </Card>
  );
}

function ShareDemo() {
  const { share } = useShare();
  return (
    <View className="w-full gap-3">
      <Button
        onPress={() =>
          void share({
            title: 'Prototype Kit',
            message: 'Take a look at this prototype',
            url: 'https://expo.dev',
          })
        }>
        <Text>Share this prototype</Text>
      </Button>
      <Text className="text-muted-foreground text-sm">
        Opens the OS share sheet. On the web preview it copies to the clipboard instead.
      </Text>
    </View>
  );
}

function NotifyDemo() {
  const { notify, simulated } = useNotify();
  return (
    <View className="w-full gap-3">
      <Button
        onPress={() =>
          void notify({
            title: 'Payment received',
            body: 'R240.00 from Sam Patel is now in your account.',
            icon: CheckIcon,
          })
        }>
        <Text>Show a banner now</Text>
      </Button>
      <Button
        variant="outline"
        onPress={() => void notify({ title: 'Reminder', body: 'This one arrives in 5 seconds.', delay: 5 })}>
        <Text>Schedule one in 5s</Text>
      </Button>
      <Text className="text-muted-foreground text-sm">
        {simulated
          ? 'Scheduled alerts need a device — the banner works everywhere.'
          : 'Background the app to see the scheduled one arrive.'}
      </Text>
    </View>
  );
}

export const KIT_NATIVE_SECTIONS: ComponentSection[] = [
  {
    id: 'photo-capture',
    title: 'PhotoCapture',
    category: 'native',
    aliases: ['camera', 'photo', 'image picker', 'upload', 'avatar photo', 'attachment'],
    api: '<PhotoCapture value? onChange? sources? shape="tile|avatar|wide" label? seed? simulate? />',
    caption: 'Tap to take or choose a photo. Falls back to generated art wherever there is no camera — the web preview, the simulator, a declined permission — so the screen still reads as filled.',
    Demo: PhotoCaptureDemo,
  },
  {
    id: 'code-scanner',
    title: 'CodeScanner',
    category: 'native',
    aliases: ['qr', 'barcode', 'scan', 'camera viewfinder'],
    api: '<CodeScanner onScan types? hint? ratio? continuous? simulatedValues? simulate? />',
    caption: 'QR and barcode viewfinder. Without a camera it shows the same framing overlay plus a button that emits a sample payload, so the flow behind it stays demonstrable.',
    Demo: CodeScannerDemo,
  },
  {
    id: 'biometric-gate',
    title: 'BiometricGate',
    category: 'native',
    aliases: ['face id', 'touch id', 'fingerprint', 'lock', 'unlock', 'biometrics'],
    api: '<BiometricGate title? subtitle? prompt? locked? onUnlock? simulate?>…</BiometricGate> · useBiometricAuth()',
    caption: 'Hides its children until Face ID succeeds. Use the hook instead when you are confirming a single action. Real only in a dev build — Expo Go and the web simulate it.',
    Demo: BiometricGateDemo,
  },
  {
    id: 'permission-primer',
    title: 'PermissionPrimer',
    category: 'native',
    aliases: ['permission', 'allow', 'prompt', 'ask', 'privacy'],
    api: '<PermissionPrimer capability variant="inline|sheet" onAllow onSkip skipLabel? />',
    caption: 'Show this before the OS dialog, never instead of it. The skip is not optional: a prototype must never dead-end on a permission the viewer declined.',
    Demo: PermissionPrimerDemo,
  },
  {
    id: 'share',
    title: 'useShare',
    category: 'native',
    aliases: ['share sheet', 'send', 'export', 'copy link'],
    api: 'const { share } = useShare(); share({ message?, url?, title? })',
    caption: 'A hook, not a component — the trigger is an ordinary Button. Copies to the clipboard when the OS sheet is unavailable.',
    Demo: ShareDemo,
  },
  {
    id: 'notify',
    title: 'useNotify',
    category: 'native',
    aliases: ['notification', 'alert', 'push', 'banner', 'reminder'],
    api: 'const { notify } = useNotify(); notify({ title, body?, delay?, icon? })',
    caption: 'No delay draws the in-app banner, which looks the same everywhere and is what a demo needs. A delay also schedules the real OS notification when it can.',
    Demo: NotifyDemo,
  },
];
