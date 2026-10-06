import { BellRingIcon, ChartNoAxesColumnIcon, FileTextIcon, type LucideIcon } from 'lucide-react';

/** Copy and mock content for the landing sample: a marketing page for Northwind, a made-up invoicing tool. */

export const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: FileTextIcon, title: 'Invoices in a minute', description: 'Pick a customer, add the work, send. Your details, terms and bank info fill themselves in.' },
  { icon: BellRingIcon, title: 'Reminders that sound like you', description: 'Polite nudges go out when an invoice is late, and you approve each one until you trust them.' },
  { icon: ChartNoAxesColumnIcon, title: 'Know what’s coming in', description: 'See what’s paid, due and overdue this month, and who pays late, without a spreadsheet.' },
];

export const STUDIOS = ['Acme Studio', 'Fernway', 'Lumen Labs', 'Orbit Health', 'Pinecrest', 'Quill & Co'];

export const PLANS = [
  { name: 'Solo', price: '£0', period: 'forever', description: 'For freelancers starting out.', features: ['5 invoices a month', 'Manual reminders', 'Card and bank payments'] },
  {
    name: 'Studio',
    price: '£18',
    period: 'per month',
    description: 'For small teams who bill every week.',
    features: ['Unlimited invoices', 'Automatic reminders', 'Up to 5 teammates', 'Payment forecasts'],
    highlighted: true,
  },
  { name: 'Agency', price: '£49', period: 'per month', description: 'For agencies with many clients.', features: ['Everything in Studio', 'Unlimited teammates', 'Client portal', 'Priority support'] },
];

export const FAQ = [
  ['Can I try it before I pay?', 'Yes. Studio is free for 30 days, no card needed. At the end you choose a plan or drop to Solo.'],
  ['Do my customers need an account?', 'No. They get an email with a link to view and pay the invoice by card or bank transfer.'],
  ['Will reminders go out without me knowing?', 'Not until you switch them to automatic. Until then Northwind asks before each one.'],
  ['Can I bring my old invoices?', 'Import a CSV from most accounting tools, or start fresh and keep the old ones where they are.'],
];
