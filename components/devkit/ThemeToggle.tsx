import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useKitTheme } from '@/lib/theme-context';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';

/** Header button that flips light/dark. Settings offers the full system/light/dark choice. */
export function ThemeToggle() {
  const { scheme, toggle } = useKitTheme();
  return (
    <Button
      onPress={toggle}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4"
      accessibilityLabel={scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Icon as={scheme === 'dark' ? MoonStarIcon : SunIcon} className="size-5" />
    </Button>
  );
}
