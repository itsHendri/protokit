import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InvoicesView } from '@/components/dashboard/invoices-view';

export const metadata: Metadata = { title: 'Invoices · Northwind' };

export default function InvoicesPage() {
  return (
    <Suspense>
      <InvoicesView />
    </Suspense>
  );
}
