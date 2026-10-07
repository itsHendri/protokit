'use client';
import { MoreHorizontalIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '@/components/kit/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { money, shortDate, STATUS_DOT, type Invoice } from './data';
import { invoiceActions } from './store';

type Props = { rows: Invoice[]; caption?: string; emptyTitle?: string; actions?: boolean };

/** The invoices table, shared by the overview (recent) and the invoices page (all, with row actions). */
export function InvoiceTable({ rows, caption, emptyTitle, actions }: Props) {
  return (
    <DataTable
      caption={caption}
      emptyTitle={emptyTitle}
      rows={rows}
      rowKey={(r) => r.id}
      columns={[
        { key: 'id', header: 'Invoice', sortValue: (r) => r.id, cell: (r) => <span className="font-medium">{r.id}</span> },
        { key: 'customer', header: 'Customer', sortValue: (r) => r.customer },
        { key: 'due', header: 'Due', sortValue: (r) => r.due, cell: (r) => shortDate(r.due) },
        { key: 'status', header: 'Status', sortValue: (r) => r.status, cell: (r) => (
          <Badge variant="outline" className="gap-1.5">
            <span aria-hidden className={`size-1.5 rounded-full ${STATUS_DOT[r.status]}`} />
            {r.status}
          </Badge>
        ),
      },
        { key: 'amount', header: 'Amount', align: 'right', sortValue: (r) => r.amount, cell: (r) => <span className="tabular-nums">{money(r.amount)}</span> },
        ...(actions
          ? [
              {
                key: 'actions',
                header: '',
                align: 'right' as const,
                cell: (r: Invoice) => <RowActions invoice={r} />,
              },
            ]
          : []),
      ]}
    />
  );
}

function RowActions({ invoice }: { invoice: Invoice }) {
  const markPaid = () => {
    const undo = invoiceActions.setStatus([invoice.id], 'Paid');
    toast.success(`${invoice.id} marked as paid`, { action: { label: 'Undo', onClick: undo } });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${invoice.id}`}>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={invoice.status === 'Paid'} onSelect={markPaid}>
          Mark as paid
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={invoice.status !== 'Overdue' && invoice.status !== 'Due'}
          onSelect={() => toast.success(`Reminder sent to ${invoice.customer}`)}>
          Send reminder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
