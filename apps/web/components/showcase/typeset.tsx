'use client';
import { useSearchParams } from 'next/navigation';
import type * as React from 'react';
import { ChatMessage } from '@/components/kit/chat-message';
import { Prose } from '@/components/kit/prose';
import { StatTile } from '@/components/kit/stat-tile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** Long-form samples for the typeset preview, picked with ?fixture= (the docs studio's toolbar). */
export const FIXTURES: Record<string, { label: string; body: React.ReactNode }> = {
  article: {
    label: 'Article',
    body: (
      <>
        <h1>Why small studios get paid late</h1>
        <p>
          Most late invoices are not disputes. They are invoices that reached the wrong inbox, or the right inbox
          without the one detail an accounts team needs to approve them. Fix the routing and the money follows.
        </p>
        <h2>Send it the day the work ends</h2>
        <p>
          An invoice sent the same day is paid in <strong>14 days</strong> on average; one sent a week later
          takes 23. The work is fresh, the person who asked for it still remembers, and nobody has to dig for
          context.
        </p>
        <blockquote>We cut our average wait from 31 days to 12 by sending on the last day of every project.</blockquote>
        <h3>Name the work, not the month</h3>
        <p>
          “June services” tells an approver nothing. “Brand refresh, phase 2” tells them which budget it comes
          from and who signs it off.
        </p>
        <ul>
          <li>Put the project name in the first line.</li>
          <li>
            Add the purchase order to <code>reference</code>.
          </li>
          <li>Attach the signed estimate.</li>
        </ul>
      </>
    ),
  },
  docs: {
    label: 'Docs',
    body: (
      <>
        <h1>Reminders</h1>
        <p>
          Reminders email a client when an invoice is due and when it is late. They are on for every new invoice;
          turn them off per client in <a href="#reminders">Settings › Clients</a>.
        </p>
        <h2>Schedule</h2>
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3 days before due</td>
              <td>A friendly heads-up with the pay link</td>
            </tr>
            <tr>
              <td>7 days late</td>
              <td>A reminder, copied to you</td>
            </tr>
            <tr>
              <td>14 days late</td>
              <td>A final notice</td>
            </tr>
          </tbody>
        </table>
        <h2>From the command line</h2>
        <pre>
          <code>northwind reminders pause --client lumen-labs --until 2026-07-01</code>
        </pre>
        <p>Paused reminders resume on the date you give; nothing is sent for the days in between.</p>
      </>
    ),
  },
  changelog: {
    label: 'Changelog',
    body: (
      <>
        <h2>June 2026</h2>
        <h3>Partial payments</h3>
        <p>An invoice can now be paid in parts. Each payment shows on the invoice, and the balance updates.</p>
        <h3>Fixes</h3>
        <ol>
          <li>Reminders no longer go to archived contacts.</li>
          <li>
            CSV exports keep leading zeros in <code>reference</code>.
          </li>
          <li>Dates in emails follow the client’s locale.</li>
        </ol>
        <hr />
        <h2>May 2026</h2>
        <p>Estimates turn into invoices in one click, keeping every line and the client’s purchase order.</p>
      </>
    ),
  },
  notes: {
    label: 'Notes',
    body: (
      <>
        <h2>Call with Lumen Labs, 24 June</h2>
        <p>Present: Ada (us), Priya and Tom (Lumen). Agreed to move phase 3 to July.</p>
        <h4>Decisions</h4>
        <ul>
          <li>Phase 2 invoice reissued with PO 4471.</li>
          <li>Phase 3 estimate due Friday.</li>
        </ul>
        <h4>Follow-ups</h4>
        <ul>
          <li>Ada: send the revised timeline.</li>
          <li>Tom: confirm who approves invoices over £5,000.</li>
        </ul>
      </>
    ),
  },
};

/** The components the typeset changes: text sizes and line heights, the mono font, the heading font. */
function Components() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <StatTile label="Paid this month" value="£25,300" delta={8.2} deltaLabel="vs May" />
        <StatTile label="Average wait" value="12 days" delta={-61} deltaLabel="vs last year" invert />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
          <CardDescription>When we email a client about an invoice.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="typeset-from">Send from</Label>
            <Input id="typeset-from" defaultValue="billing@northwind.co" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="typeset-copy">Copy me on late reminders</Label>
            <Switch id="typeset-copy" defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ['INV-1047', 'Paid', '£1,840'],
                ['INV-1046', 'Overdue', '£960'],
                ['INV-1045', 'Overdue', '£2,310'],
              ].map(([id, status, amount]) => (
                <TableRow key={id}>
                  <TableCell className="font-mono">{id}</TableCell>
                  <TableCell>
                    <Badge variant={status === 'Paid' ? 'secondary' : 'destructive'}>{status}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <ChatMessage role="user" initials="AM">
            Draft a reminder for Lumen Labs.
          </ChatMessage>
          <ChatMessage role="assistant">
            <Prose>
              <p>
                Here’s a short one. It names the project and the purchase order, so their accounts team can approve
                it without asking.
              </p>
            </Prose>
          </ChatMessage>
        </CardContent>
      </Card>
    </div>
  );
}

/** The typeset preview: long-form text in Prose, beside the components the same typeset scales. */
export function TypesetPreview() {
  const params = useSearchParams();
  const fixture = FIXTURES[params.get('fixture') ?? ''] ?? FIXTURES.article;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-10">
      <Card className="p-6 sm:p-10">
        <Prose as="article">{fixture.body}</Prose>
      </Card>
      <Components />
    </div>
  );
}
