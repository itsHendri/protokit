import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

/**
 * The way back from a sample (or a prototype) to the kit, plus the theme toggle for checking both themes.
 * Hidden in embed mode (`kit-chrome`). Delete it once the prototype is the product.
 */
export function KitChip() {
  return (
    <div className="kit-chrome flex items-center gap-1">
      <Button asChild variant="ghost" size="sm">
        <Link href="/">
          <ArrowLeftIcon aria-hidden />
          Kit
        </Link>
      </Button>
      <ThemeToggle />
    </div>
  );
}
