/**
 * Mock data for the sample app. Delete this folder with app/(sample) when starting a real project.
 */
export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  category: 'transfer' | 'shopping' | 'income' | 'subscription';
  date: string;
};

export const BALANCE = 4820.55;
export const BALANCE_SERIES = [3900, 3950, 4100, 4050, 4200, 4180, 4300, 4420, 4380, 4500, 4610, 4580, 4700, 4820];

export const CONTACTS = [
  { id: 'alex', name: 'Alex Rivera', initials: 'AR', handle: '@alex' },
  { id: 'sam', name: 'Sam Okafor', initials: 'SO', handle: '@sam' },
  { id: 'jo', name: 'Jo Lindqvist', initials: 'JL', handle: '@jo' },
  { id: 'mei', name: 'Mei Tanaka', initials: 'MT', handle: '@mei' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'Alex Rivera', subtitle: 'Today, 09:41', amount: -120, status: 'completed', category: 'transfer', date: '2026-09-22' },
  { id: 't2', title: 'Grocery Market', subtitle: 'Today, 08:15', amount: -64.2, status: 'completed', category: 'shopping', date: '2026-09-22' },
  { id: 't3', title: 'Salary', subtitle: 'Yesterday', amount: 3200, status: 'completed', category: 'income', date: '2026-09-21' },
  { id: 't4', title: 'Streaming Plus', subtitle: 'Yesterday', amount: -12.99, status: 'pending', category: 'subscription', date: '2026-09-21' },
  { id: 't5', title: 'Sam Okafor', subtitle: '19 Sep', amount: 45, status: 'completed', category: 'transfer', date: '2026-09-19' },
  { id: 't6', title: 'City Transit', subtitle: '18 Sep', amount: -3.4, status: 'failed', category: 'shopping', date: '2026-09-18' },
];

export const SPENDING = [
  { label: 'Housing', value: 1200 },
  { label: 'Food', value: 480 },
  { label: 'Transport', value: 220 },
  { label: 'Fun', value: 300 },
];

export const WEEKLY = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 64 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 90 },
  { label: 'Sat', value: 120 },
  { label: 'Sun', value: 35 },
];

export const money = (n: number, sign = false) => `${sign && n > 0 ? '+' : n < 0 ? '−' : ''}$${Math.abs(n).toFixed(2)}`;
