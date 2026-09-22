import { Sheet } from '@/components/kit/sheet';
import { Spot } from '@/components/kit/spot';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { CapabilityId } from '@/lib/native';
import { cn } from '@/lib/utils';
import { BellIcon, CameraIcon, ImageIcon, ScanFaceIcon, Share2Icon, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type PrimerCopy = { icon: LucideIcon; title: string; body: string; allow: string; skip: string };

/**
 * Keep these bodies in step with the permission strings in app.json. The primer and the
 * OS dialog saying the same thing is what earns the grant.
 */
export const PRIMER_COPY: Record<CapabilityId, PrimerCopy> = {
  camera: {
    icon: CameraIcon,
    title: 'Use the camera?',
    body: 'We use the camera to scan codes and take photos in this prototype. Nothing is uploaded anywhere.',
    allow: 'Allow camera',
    skip: 'Use a sample photo',
  },
  photos: {
    icon: ImageIcon,
    title: 'Access your photos?',
    body: 'Pick a photo from your library to see it in place. It stays on this device.',
    allow: 'Choose a photo',
    skip: 'Use a sample photo',
  },
  biometrics: {
    icon: ScanFaceIcon,
    title: 'Unlock with Face ID?',
    body: 'Face ID keeps this section private without a password. Your face never leaves the device.',
    allow: 'Use Face ID',
    skip: 'Use a passcode instead',
  },
  notify: {
    icon: BellIcon,
    title: 'Send you alerts?',
    body: 'Alerts let this prototype tell you when something changes. You can turn them off at any time.',
    allow: 'Allow alerts',
    skip: 'Show them in the app instead',
  },
  share: {
    icon: Share2Icon,
    title: 'Share this?',
    body: 'Opens your device share sheet so you can send this wherever you like.',
    allow: 'Share',
    skip: 'Copy the link instead',
  },
};

type Props = {
  capability: CapabilityId;
  /** `inline` fills the space the feature would occupy; `sheet` slides up over the screen. */
  variant?: 'inline' | 'sheet';
  /** Sheet variant only. */
  open?: boolean;
  onClose?: () => void;
  title?: string;
  body?: string;
  /** The primary CTA — this is what triggers the OS dialog. */
  onAllow: () => void;
  /** Always rendered. Runs the simulated path so the prototype keeps moving. */
  onSkip: () => void;
  skipLabel?: string;
  className?: string;
};

/**
 * Explains why a permission is needed before the OS asks, and always offers a way past it.
 *
 * Show this instead of triggering the system dialog cold. The skip is not optional: a
 * prototype must never dead-end on a permission the viewer declined.
 */
export function PermissionPrimer({
  capability,
  variant = 'inline',
  open = false,
  onClose,
  title,
  body,
  onAllow,
  onSkip,
  skipLabel,
  className,
}: Props) {
  const copy = PRIMER_COPY[capability];
  const content = (
    <View className={cn('items-center gap-2 px-6 py-8', className)}>
      <Spot icon={copy.icon} size="lg" className="mb-4" />
      <Text variant="h4" className="text-center">
        {title ?? copy.title}
      </Text>
      <Text className="text-muted-foreground max-w-xs text-center">{body ?? copy.body}</Text>
      <Button onPress={onAllow} className="mt-4 w-full max-w-xs">
        <Text>{copy.allow}</Text>
      </Button>
      <Pressable onPress={onSkip} accessibilityRole="button" className="mt-1 min-h-11 justify-center">
        <Text className="text-muted-foreground text-sm font-semibold">{skipLabel ?? copy.skip}</Text>
      </Pressable>
    </View>
  );

  if (variant === 'sheet') {
    return (
      <Sheet open={open} onClose={onClose ?? onSkip}>
        {content}
      </Sheet>
    );
  }
  return content;
}
