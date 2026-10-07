/**
 * What the assistant sample "knows". There is no model: a message is matched to an intent, and each intent
 * is a short script of steps. Edit the copy here; the conversation logic is in conversation.tsx.
 */

export type Step =
  | { kind: 'think'; ms: number }
  | { kind: 'tool'; title: string; ms: number; input?: string; output?: string }
  | { kind: 'say'; text: string }
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
    text: 'Three invoices are overdue, £4,410 in total. Lumen Labs owes the most (£2,310) and Acme Studio has waited longest, 23 days. None of them has had a reminder yet. Want me to send one to each?',
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
    ],
    onDeny: [{ kind: 'say', text: 'Okay, nothing was sent. Ask again whenever you’re ready.' }],
  },
];

const SUMMARY: Step[] = [
  { kind: 'think', ms: 600 },
  { kind: 'tool', title: 'Read June’s invoices', ms: 1000, input: 'invoices.list({ month: "2026-06" })', output: '4 invoices · £6,270 billed · £640 paid' },
  {
    kind: 'say',
    text: 'In June you sent 4 invoices worth £6,270. Northgate Coffee has already paid £640; Pinecrest and Quill & Co are due in July, and the Orbit Health invoice is still a draft. Overall you were paid £9,800 this month, 18% less than May, mostly because three May invoices are now overdue.',
  },
];

const HELP: Step[] = [
  { kind: 'think', ms: 500 },
  {
    kind: 'say',
    text: 'I can look through your invoices, explain what’s paid and what’s late, and send reminders, though I always ask before emailing anyone. This is a prototype, so try “Which invoices are overdue?” or “Summarise June for me”.',
  },
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
  ];
}

export function scriptFor(message: string, fileNames: string[] = []): Step[] {
  if (fileNames.length) return filesScript(fileNames);
  const m = message.toLowerCase();
  if (/overdue|late|remind|chase|owe/.test(m)) return OVERDUE;
  if (/summar|june|month|how (are|am|is)|revenue|paid/.test(m)) return SUMMARY;
  return HELP;
}
