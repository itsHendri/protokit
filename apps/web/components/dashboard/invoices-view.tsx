'use client';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { PageHeader } from '@/components/kit/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { InvoiceStatus } from './data';
import { InvoiceTable } from './invoice-table';
import { NewInvoiceDialog } from './new-invoice-dialog';
import { useInvoices } from './store';

const FILTERS: ('All' | InvoiceStatus)[] = ['All', 'Overdue', 'Due', 'Paid', 'Draft'];

/** The invoices page: filter by status, search, row actions. `?new=1` opens the new-invoice dialog. */
export function InvoicesView() {
  const invoices = useInvoices();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>('All');
  const [query, setQuery] = React.useState('');
  const creating = params.get('new') === '1';
  const setCreating = (open: boolean) => router.replace(open ? `${pathname}?new=1` : pathname, { scroll: false });

  const q = query.trim().toLowerCase();
  const rows = invoices.filter(
    (i) => (filter === 'All' || i.status === filter) && (!q || i.customer.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
  );
  const count = (f: (typeof FILTERS)[number]) => (f === 'All' ? invoices.length : invoices.filter((i) => i.status === f).length);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Invoices"
        description="Everything you’ve sent, newest first."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon aria-hidden />
            New invoice
          </Button>
        }
      />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TabsList>
              {FILTERS.map((f) => (
                <TabsTrigger key={f} value={f}>
                  {f} <span className="text-muted-foreground tabular-nums">{count(f)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
        <div className="relative lg:w-72">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <Input type="search" placeholder="Search customer or number" aria-label="Search invoices" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <InvoiceTable rows={rows} actions emptyTitle={q ? `No invoices match “${query.trim()}”` : `No ${filter.toLowerCase()} invoices`} />
      </div>
      <NewInvoiceDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
