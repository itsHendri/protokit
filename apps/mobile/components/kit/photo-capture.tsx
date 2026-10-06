import { Placeholder } from '@/components/kit/placeholder';
import { ActionSheet } from '@/components/kit/sheet';
import { useToast } from '@/components/kit/toast';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { useCapability } from '@/lib/native-context';
import { cn } from '@/lib/utils';
import * as ImagePicker from 'expo-image-picker';
import { CameraIcon, ImageIcon, XIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

export type PhotoSource = 'camera' | 'library';

type Props = {
  /** Current photo URI. Omit to let the component own it. */
  value?: string | null;
  onChange?: (uri: string | null) => void;
  /** Where a photo may come from. Default both. */
  sources?: PhotoSource[];
  /** `avatar` is a circle, `wide` is 16:9. Default `tile` (4:3). */
  shape?: 'tile' | 'avatar' | 'wide';
  /** Copy inside the empty frame. */
  label?: string;
  /** Seed for the simulated photo. Defaults to `label`. */
  seed?: string;
  removable?: boolean;
  /** Force the simulated path — demos, screenshots. */
  simulate?: boolean;
  className?: string;
};

/** A simulated photo is a sentinel URI, not a file — the render branch draws art instead. */
const SIM = 'kit-placeholder:';

const RATIO = { tile: 4 / 3, avatar: 1, wide: 16 / 9 };

/**
 * Tap to add a photo, from the camera or the library.
 *
 * Where there is no camera — the web preview, the simulator, a declined permission —
 * it drops to generated art so the screen still reads as filled.
 */
export function PhotoCapture({
  value,
  onChange,
  sources = ['camera', 'library'],
  shape = 'tile',
  label = 'Add a photo',
  seed,
  removable = true,
  simulate,
  className,
}: Props) {
  const [own, setOwn] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [simCount, setSimCount] = React.useState(0);
  const toast = useToast();
  const camera = useCapability('camera', simulate);
  const photos = useCapability('photos', simulate);

  const uri = value !== undefined ? value : own;
  const set = (next: string | null) => {
    if (value === undefined) setOwn(next);
    onChange?.(next);
  };

  const simulateShot = (note?: string) => {
    haptic('success');
    setSimCount((n) => n + 1);
    set(`${SIM}${seed ?? label}-${simCount}`);
    if (note) toast.info(note);
  };

  const pick = async (source: PhotoSource) => {
    const capability = source === 'camera' ? camera : photos;
    if (capability.cap.simulated) {
      simulateShot(capability.cap.note);
      return;
    }
    const settled = await capability.request();
    if (settled.simulated) {
      simulateShot(source === 'camera' ? 'Using a sample photo — camera access is off' : 'Using a sample photo — photo access is off');
      return;
    }
    try {
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 })
          : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
      if (result.canceled || !result.assets?.[0]) return;
      haptic('success');
      set(result.assets[0].uri);
    } catch {
      simulateShot('Could not open the picker — using a sample photo');
    }
  };

  const open = () => {
    haptic('selection');
    if (sources.length === 1) {
      void pick(sources[0]);
      return;
    }
    setSheetOpen(true);
  };

  const frame = shape === 'avatar' ? 'rounded-full' : 'rounded-xl';
  const simulated = !!uri && uri.startsWith(SIM);

  return (
    <View className={cn('gap-2', className)}>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={uri ? 'Change photo' : label}
        className={cn('bg-muted w-full items-center justify-center overflow-hidden active:opacity-80', frame, !uri && 'border-border border-2 border-dashed')}
        style={{ aspectRatio: RATIO[shape] }}>
        {simulated ? (
          <Placeholder seed={uri.slice(SIM.length)} ratio={RATIO[shape]} className={cn(frame, 'h-full')} />
        ) : uri ? (
          <Image source={{ uri }} className="h-full w-full" resizeMode="cover" accessibilityIgnoresInvertColors />
        ) : (
          <View className="items-center gap-2 p-4">
            <Icon as={CameraIcon} size={24} className="text-muted-foreground" />
            <Text className="text-muted-foreground text-center text-sm font-medium">{label}</Text>
          </View>
        )}
      </Pressable>

      {uri && removable ? (
        <Pressable
          onPress={() => {
            haptic('light');
            set(null);
          }}
          accessibilityRole="button"
          accessibilityLabel="Remove photo"
          className="min-h-11 flex-row items-center gap-1 self-start">
          <Icon as={XIcon} size={14} className="text-muted-foreground" />
          <Text className="text-muted-foreground text-sm font-medium">Remove</Text>
        </Pressable>
      ) : null}

      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Add a photo"
        items={[
          { label: 'Take a photo', icon: CameraIcon, onPress: () => void pick('camera') },
          { label: 'Choose from library', icon: ImageIcon, onPress: () => void pick('library') },
          ...(uri && removable ? [{ label: 'Remove photo', icon: XIcon, destructive: true, onPress: () => set(null) }] : []),
        ]}
      />
    </View>
  );
}
