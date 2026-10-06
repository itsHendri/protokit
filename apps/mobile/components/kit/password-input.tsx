import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type Props = React.ComponentProps<typeof Input> & { containerClassName?: string };

/** Input with a show/hide toggle. Pair with a Label like any Input. */
export function PasswordInput({ className, containerClassName, ...props }: Props) {
  const [visible, setVisible] = React.useState(false);
  return (
    <View className={cn('relative justify-center', containerClassName)}>
      <Input className={cn('pr-11', className)} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} textContentType="password" {...props} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        onPress={() => setVisible((v) => !v)}
        hitSlop={8}
        className="absolute right-0 size-10 items-center justify-center">
        <Icon as={visible ? EyeOffIcon : EyeIcon} size={18} className="text-muted-foreground" />
      </Pressable>
    </View>
  );
}
