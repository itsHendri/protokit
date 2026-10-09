/** Mock data for the showcase (app/showcase): a small studio that bills its clients. Never real APIs. */

export const revenue = [
  { month: 'Jan', paid: 18400, outstanding: 3200 },
  { month: 'Feb', paid: 21900, outstanding: 2800 },
  { month: 'Mar', paid: 19800, outstanding: 4100 },
  { month: 'Apr', paid: 24600, outstanding: 3600 },
  { month: 'May', paid: 27100, outstanding: 4410 },
  { month: 'Jun', paid: 25300, outstanding: 2900 },
];

export type Invoice = { id: string; client: string; amount: number; status: 'Paid' | 'Overdue' | 'Draft' };

export const invoices: Invoice[] = [
  { id: 'INV-1047', client: 'Fernway', amount: 1840, status: 'Paid' },
  { id: 'INV-1046', client: 'Acme Studio', amount: 960, status: 'Overdue' },
  { id: 'INV-1045', client: 'Lumen Labs', amount: 2310, status: 'Overdue' },
  { id: 'INV-1044', client: 'Harbour & Co', amount: 4200, status: 'Draft' },
];

export const team = [
  { initials: 'AM', name: 'Ada Marsh', role: 'Owner' },
  { initials: 'JL', name: 'Jon Lee', role: 'Designer' },
  { initials: 'RK', name: 'Rina Kaur', role: 'Engineer' },
];

export const faqs = [
  { q: 'Can clients pay by card?', a: 'Yes. Every invoice has a pay link that takes cards and bank transfers.' },
  { q: 'What happens when an invoice is late?', a: 'Reminders go out at 7 and 14 days, and the invoice moves to Overdue.' },
  { q: 'Can I change my plan later?', a: 'Any time. Upgrades apply at once; downgrades at the end of the month.' },
];

export const money = (n: number) => `£${n.toLocaleString('en-GB')}`;
