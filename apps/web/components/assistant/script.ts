import type { Source } from '@/components/kit/sources';

/**
 * What the assistant sample "knows". There is no model: a message is matched to an intent, and each intent
 * is a short script of steps. Edit the copy here; the conversation logic is in conversation.tsx.
 */

export type Step =
  | { kind: 'think'; ms: number }
  | { kind: 'tool'; title: string; ms: number; input?: string; output?: string }
  /** `[n]` in the text cites the nth source. */
  | { kind: 'say'; text: string; sources?: Source[] }
  /** Next questions under the answer. */
  | { kind: 'suggest'; suggestions: string[] }
  | { kind: 'ask'; title: string; description: string; details: { label: string; value: string }[]; approveLabel: string; onApprove: Step[]; onDeny: Step[] };

export const SUGGESTIONS = ['Which invoices are overdue?', 'Summarise June for me', 'What can you do?'];

const OVERDUE: Step[] = [
  { kind: 'think', ms: 700 },
  {
    kind: 'tool',
    title: 'Looked up overdue invoices',
    ms: 1200,
    input: 'invoices.list({ status: "overdue" })',
    output: 'INV-1045  Lumen Labs   £2,310  21 days late\nINV-1046  Acme Studio  £860    23 days late\nINV-1047  Fernway      £1,240  19 days late',
  },
  {
    kind: 'say',
    text: 'Three invoices are overdue, £4,410 in total. Lumen Labs owes the most (£2,310) [1] and Acme Studio has waited longest, 23 days [2]. Fernway is 19 days late [3]. None of them has had a reminder yet. Want me to send one to each?',
    sources: [
      { title: 'INV-1045 · Lumen Labs', meta: 'Invoice · due 24 May · £2,310', snippet: 'Brand refresh, phase 2. Payment due within 14 days of issue.' },
      { title: 'INV-1046 · Acme Studio', meta: 'Invoice · due 7 Jun · £860', snippet: 'Website maintenance, May. Payment due within 14 days of issue.' },
      { title: 'INV-1047 · Fernway', meta: 'Invoice · due 11 Jun · £1,240', snippet: 'Packaging illustrations, set of 6. Payment due within 14 days of issue.' },
    ],
  },
  {
    kind: 'ask',
    title: 'Send 3 reminder emails',
    description: 'A polite reminder from billing@northwind.co with a link to pay. Emails can’t be unsent.',
    details: [
      { label: 'To', value: 'Lumen Labs, Acme Studio, Fernway' },
      { label: 'Total due', value: '£4,410' },
    ],
    approveLabel: 'Send reminders',
    onApprove: [
      { kind: 'tool', title: 'Sent 3 reminder emails', ms: 1400, output: 'Delivered to 3 of 3 billing contacts.' },
      { kind: 'say', text: 'Done. All three reminders were delivered. I’ll tell you when any of them pays.' },
      { kind: 'suggest', suggestions: ['Which customers usually pay late?', 'Summarise June for me'] },
    ],
    onDeny: [
      { kind: 'say', text: 'Okay, nothing was sent. Ask again whenever you’re ready.' },
      { kind: 'suggest', suggestions: ['Draft a reminder I can edit first', 'Summarise June for me'] },
    ],
  },
];

const SUMMARY: Step[] = [
  { kind: 'think', ms: 600 },
  { kind: 'tool', title: 'Read June’s invoices', ms: 1000, input: 'invoices.list({ month: "2026-06" })', output: '4 invoices · £6,270 billed · £640 paid' },
  {
    kind: 'say',
    text: 'In June you sent 4 invoices worth £6,270 [1]. Northgate Coffee has already paid £640; Pinecrest and Quill & Co are due in July, and the Orbit Health invoice is still a draft. Overall you were paid £9,800 this month, 18% less than May [2], mostly because three May invoices are now overdue.',
    sources: [
      { title: 'June invoices', meta: 'Report · 4 invoices', snippet: 'INV-1048 to INV-1051, issued 12–24 June. £6,270 billed, £640 paid.' },
      { title: 'Payments, May and June', meta: 'Report · bank feed', snippet: 'May: £11,900 received. June: £9,800 received.' },
    ],
  },
  { kind: 'suggest', suggestions: ['Which invoices are overdue?', 'How does June compare with last year?'] },
];

const LATE_PAYERS: Step[] = [
  { kind: 'think', ms: 600 },
  { kind: 'tool', title: 'Compared due and paid dates', ms: 1000, input: 'payments.lateness({ months: 6 })', output: '7 customers · 2 usually late' },
  {
    kind: 'say',
    text: 'Over the last six months, Lumen Labs and Acme Studio paid most invoices 2–3 weeks after the due date [1]. Everyone else paid within a few days. Shorter terms, or automatic reminders for those two, would bring the money in sooner.',
    sources: [{ title: 'Payment timing by customer', meta: 'Report · Jan–Jun', snippet: 'Lumen Labs: 17 days late on average. Acme Studio: 15. Others: under 3.' }],
  },
  { kind: 'suggest', suggestions: ['Which invoices are overdue?', 'Summarise June for me'] },
];

const LAST_YEAR: Step[] = [
  { kind: 'think', ms: 500 },
  {
    kind: 'say',
    text: 'This prototype only has this year’s invoices, so I can’t compare with June last year. In the real product, this is where a chart of both Junes would go.',
  },
  { kind: 'suggest', suggestions: ['Which customers usually pay late?'] },
];

const DRAFT: Step[] = [
  { kind: 'think', ms: 600 },
  {
    kind: 'say',
    text: 'Here’s a draft for Fernway: “Hi Sam, a quick nudge on invoice INV-1047 for £1,240, due on 11 June. If it’s already on its way, thank you and please ignore this. Otherwise, the link to pay is below. Best, Alex.” Nothing is sent until you approve it.',
  },
  { kind: 'suggest', suggestions: ['Which invoices are overdue?'] },
];

const HELP: Step[] = [
  { kind: 'think', ms: 500 },
  {
    kind: 'say',
    text: 'I can look through your invoices, explain what’s paid and what’s late, and send reminders, though I always ask before emailing anyone. This is a prototype, so try one of these:',
  },
  { kind: 'suggest', suggestions: ['Which invoices are overdue?', 'Summarise June for me'] },
];

/** For a message with files: show the read, then say honestly that a prototype cannot read them. */
function filesScript(names: string[]): Step[] {
  const list = names.length === 1 ? names[0] : `${names.length} files`;
  return [
    { kind: 'think', ms: 500 },
    { kind: 'tool', title: `Read ${list}`, ms: 1100, input: names.join('\n'), output: 'Prototype: the file is not really read.' },
    {
      kind: 'say',
      text: `This is where I would summarise ${list}: an invoice’s customer, amount and due date, or a receipt to match against an expense. In this prototype the file is not really read, but the flow is real: attach, see the read, get the answer.`,
    },
    { kind: 'suggest', suggestions: ['Which invoices are overdue?'] },
  ];
}

export function scriptFor(message: string, fileNames: string[] = []): Step[] {
  if (fileNames.length) return filesScript(fileNames);
  const m = message.toLowerCase();
  if (/usually|customers.*late|pay late/.test(m)) return LATE_PAYERS;
  if (/last year|compare/.test(m)) return LAST_YEAR;
  if (/draft/.test(m)) return DRAFT;
  if (/overdue|late|remind|chase|owe/.test(m)) return OVERDUE;
  if (/summar|june|month|how (are|am|is)|revenue|paid/.test(m)) return SUMMARY;
  return HELP;
}
