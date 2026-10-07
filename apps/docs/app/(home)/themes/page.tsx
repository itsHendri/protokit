import type { Metadata } from 'next';
import { ThemeStudio } from '@/components/theme/studio';
import { kit } from '@/lib/kit';

export const metadata: Metadata = {
  title: 'Theme studio',
  description: `Pick a theme for the ${kit.name} kits: colour, type, radius, depth, icons and density, live on the real mobile and web kits, then apply it with one code.`,
};

export default function ThemesPage() {
  return <ThemeStudio />;
}
