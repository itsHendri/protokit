'use client';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CUSTOMERS, money } from './data';
import { invoiceActions } from './store';

const TODAY = '2026-06-30';
const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

/** Creates an invoice in the session store. Errors sit next to their field. */
export function NewInvoiceDialog({ open, onOpenChange }: Props) {
  const [customer, setCustomer] = React.useState(CUSTOMERS[0]);
  const [amount, setAmount] = React.useState('');
  const [terms, setTerms] = React.useState('30');
  const [error, setError] = React.useState<string | null>(null);
  const amountId = React.useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) {
      setError('Enter an amount above £0.');
      return;
    }
    const created = invoiceActions.add({ customer, amount: Math.round(value), issued: TODAY, due: addDays(TODAY, Number(terms)), status: 'Due' });
    toast.success(`${created.id} sent to ${customer}`, { description: `${money(created.amount)}, due in ${terms} days` });
    setAmount('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
          <DialogHeader>
            <DialogTitle>New invoice</DialogTitle>
            <DialogDescription>It goes to the customer’s billing email as soon as you send it.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${amountId}-customer`}>Customer</Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger id={`${amountId}-customer`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMERS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={amountId}>Amount (£)</Label>
              <Input
                id={amountId}
                inputMode="decimal"
                placeholder="1,200"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/[^\d.]/g, ''));
                  setError(null);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? `${amountId}-error` : undefined}
              />
              {error ? (
                <p id={`${amountId}-error`} className="text-destructive text-sm">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${amountId}-terms`}>Payment terms</Label>
              <Select value={terms} onValueChange={setTerms}>
                <SelectTrigger id={`${amountId}-terms`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
