import type { Turn } from './conversation';

/** Mock past conversations for the assistant sample's history. Plain text turns, newest thread first. */

export type Thread = { id: string; title: string; group: string; turns: Turn[] };

const text = (id: string, role: Turn['role'], body: string): Turn => ({
  id,
  role,
  parts: [{ id: `${id}-p`, kind: 'text', text: body, streaming: false }],
});

export const PAST_THREADS: Thread[] = [
  {
    id: 'past-1',
    title: 'Draft a reminder for Fernway',
    group: 'Yesterday',
    turns: [
      text('p1-u', 'user', 'Can you draft a friendly reminder for Fernway? They are about a week late.'),
      text(
        'p1-a',
        'assistant',
        'Here is a draft: “Hi Sam, a quick nudge on invoice INV-1047 for £1,240, which was due on 11 June. If it has already gone out, thank you and please ignore this. Otherwise, the payment link is below. Best, Alex.” Want me to send it?'
      ),
    ],
  },
  {
    id: 'past-2',
    title: 'Which customers pay late?',
    group: 'Previous 7 days',
    turns: [
      text('p2-u', 'user', 'Which customers usually pay late?'),
      text(
        'p2-a',
        'assistant',
        'Over the last six months, Lumen Labs and Acme Studio paid 2–3 weeks after the due date on most invoices. Everyone else paid within a few days. Shorter terms or automatic reminders for those two would help.'
      ),
    ],
  },
  {
    id: 'past-3',
    title: 'Summarise May',
    group: 'Previous 30 days',
    turns: [
      text('p3-u', 'user', 'Summarise May for me.'),
      text('p3-a', 'assistant', 'In May you were paid £11,900 across 6 invoices, your best month this year. £3,100 was still outstanding at the end of the month.'),
    ],
  },
];
