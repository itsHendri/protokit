import type { Metadata } from 'next';
import { ShowcaseCards } from '@/components/showcase/cards';

export const metadata: Metadata = { title: 'Showcase' };

export default function ShowcasePage() {
  return <ShowcaseCards />;
}
