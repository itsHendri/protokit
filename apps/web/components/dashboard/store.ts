'use client';
import { useSyncExternalStore } from 'react';
import { INVOICES, type Invoice } from './data';

/**
 * The dashboard's invoices, shared by its pages for the session. A module-level store: changes survive
 * navigating between pages and reset on reload, which is what a prototype wants. Never call real APIs.
 */
let invoices = INVOICES;
const listeners = new Set<() => void>();

function set(next: Invoice[]) {
  invoices = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInvoices() {
  return useSyncExternalStore(subscribe, () => invoices, () => INVOICES);
}

export const invoiceActions = {
  add(invoice: Omit<Invoice, 'id'>) {
    const last = Math.max(...invoices.map((i) => Number(i.id.slice(4))));
    const created = { ...invoice, id: `INV-${last + 1}` };
    set([created, ...invoices]);
    return created;
  },
  setStatus(ids: string[], status: Invoice['status']) {
    const previous = new Map(invoices.filter((i) => ids.includes(i.id)).map((i) => [i.id, i.status]));
    set(invoices.map((i) => (previous.has(i.id) ? { ...i, status } : i)));
    /** Undo: puts back only these invoices' statuses. */
    return () => set(invoices.map((i) => (previous.has(i.id) ? { ...i, status: previous.get(i.id)! } : i)));
  },
};
