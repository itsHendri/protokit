import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ImageIcon, type LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { Image, type ImageSourcePropType, View } from 'react-native';

type Props = {
  source?: ImageSourcePropType;
  /** Width / height. Default 4/3. */
  ratio?: number;
  /** Shown while loading or when there is no source. */
  fallbackIcon?: LucideIcon;
  caption?: string;
  className?: string;
};

/** Rounded image with a muted placeholder — product shots, covers, attachments. */
export function ImageTile({ source, ratio = 4 / 3, fallbackIcon = ImageIcon, caption, className }: Props) {
  const [failed, setFailed] = React.useState(false);
  const showImage = !!source && !failed;
  return (
    <View className={cn('gap-2', className)}>
      <View className="bg-muted w-full items-center justify-center overflow-hidden rounded-lg" style={{ aspectRatio: ratio }}>
        {showImage ? <Image source={source} onError={() => setFailed(true)} className="h-full w-full" resizeMode="cover" accessibilityIgnoresInvertColors /> : <Icon as={fallbackIcon} size={28} className="text-muted-foreground" />}
      </View>
      {caption ? <Text className="text-muted-foreground text-sm">{caption}</Text> : null}
    </View>
  );
}
