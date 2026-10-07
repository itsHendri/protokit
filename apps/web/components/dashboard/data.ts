/** Mock data for the dashboard sample. Northwind is a made-up invoicing tool for small studios. */

export type InvoiceStatus = 'Paid' | 'Due' | 'Overdue' | 'Draft';

export type Invoice = {
  id: string;
  customer: string;
  issued: string; // ISO date
  due: string; // ISO date
  amount: number; // pounds
  status: InvoiceStatus;
};

export const CUSTOMERS = ['Acme Studio', 'Fernway', 'Lumen Labs', 'Northgate Coffee', 'Orbit Health', 'Pinecrest', 'Quill & Co'];

export const INVOICES: Invoice[] = [
  { id: 'INV-1051', customer: 'Orbit Health', issued: '2026-06-24', due: '2026-07-24', amount: 3200, status: 'Draft' },
  { id: 'INV-1050', customer: 'Pinecrest', issued: '2026-06-20', due: '2026-07-20', amount: 1450, status: 'Due' },
  { id: 'INV-1049', customer: 'Quill & Co', issued: '2026-06-16', due: '2026-07-16', amount: 980, status: 'Due' },
  { id: 'INV-1048', customer: 'Northgate Coffee', issued: '2026-06-12', due: '2026-07-12', amount: 640, status: 'Paid' },
  { id: 'INV-1047', customer: 'Fernway', issued: '2026-05-28', due: '2026-06-11', amount: 1240, status: 'Overdue' },
  { id: 'INV-1046', customer: 'Acme Studio', issued: '2026-05-24', due: '2026-06-07', amount: 860, status: 'Overdue' },
  { id: 'INV-1045', customer: 'Lumen Labs', issued: '2026-05-10', due: '2026-05-24', amount: 2310, status: 'Overdue' },
  { id: 'INV-1044', customer: 'Orbit Health', issued: '2026-05-06', due: '2026-06-05', amount: 4100, status: 'Paid' },
  { id: 'INV-1043', customer: 'Pinecrest', issued: '2026-04-30', due: '2026-05-30', amount: 1450, status: 'Paid' },
  { id: 'INV-1042', customer: 'Acme Studio', issued: '2026-04-18', due: '2026-05-18', amount: 1720, status: 'Paid' },
];

/** Paid and outstanding per month, for the overview chart. */
export const MONTHLY = [
  { month: 'Jan', paid: 8400, outstanding: 1200 },
  { month: 'Feb', paid: 9100, outstanding: 2100 },
  { month: 'Mar', paid: 7800, outstanding: 1600 },
  { month: 'Apr', paid: 10400, outstanding: 2600 },
  { month: 'May', paid: 11900, outstanding: 3100 },
  { month: 'Jun', paid: 9800, outstanding: 4410 },
];

/**
 * The dot colour per status, for an outline Badge. The status word stays in foreground text: a status
 * colour as small text on its own tint measures under 4.5:1 (success 4.09, destructive 3.81).
 */
export const STATUS_DOT: Record<InvoiceStatus, string> = {
  Paid: 'bg-success',
  Due: 'bg-warning',
  Overdue: 'bg-destructive',
  Draft: 'bg-muted-foreground',
};

export const money = (n: number) => `£${n.toLocaleString('en-GB')}`;

export const shortDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
