import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TypesetPreview } from '@/components/showcase/typeset';

export const metadata: Metadata = { title: 'Typeset' };

/** ?fixture=article|docs|changelog|notes picks the long-form sample (read on the client: static export). */
export default function TypesetPage() {
  return (
    <Suspense>
      <TypesetPreview />
    </Suspense>
  );
}
