import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon, XIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type Props = React.ComponentProps<typeof Input> & {
  value: string;
  onChangeText: (text: string) => void;
  containerClassName?: string;
};

/** Input with a leading search icon and a clear button. */
export function SearchField({ value, onChangeText, className, containerClassName, ...props }: Props) {
  return (
    <View className={cn('relative justify-center', containerClassName)}>
      <View className="absolute left-3 z-10">
        <Icon as={SearchIcon} className="text-muted-foreground" size={16} />
      </View>
      <Input
        className={cn('pl-9 pr-9', className)}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        {...props}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText('')}
          hitSlop={8}
          className="absolute right-3 z-10">
          <Icon as={XIcon} className="text-muted-foreground" size={16} />
        </Pressable>
      ) : null}
    </View>
  );
}
