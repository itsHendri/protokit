/**
 * Mock habits + a tiny store for the habit-tracker sample. Delete with app/habits.
 */
import * as React from 'react';

export type Habit = { id: string; name: string; goal: number; unit: string; today: number; streak: number; tone: 'primary' | 'success' | 'warning' | 'info'; reminder: boolean };

type State = { habits: Habit[] };
let state: State = {
  habits: [
    { id: 'water', name: 'Drink water', goal: 8, unit: 'glasses', today: 5, streak: 12, tone: 'info', reminder: true },
    { id: 'walk', name: 'Walk 30 minutes', goal: 1, unit: 'walk', today: 1, streak: 4, tone: 'success', reminder: false },
    { id: 'read', name: 'Read 20 pages', goal: 20, unit: 'pages', today: 8, streak: 21, tone: 'primary', reminder: true },
    { id: 'stretch', name: 'Stretch', goal: 1, unit: 'session', today: 0, streak: 0, tone: 'warning', reminder: false },
    { id: 'journal', name: 'Journal', goal: 1, unit: 'entry', today: 1, streak: 9, tone: 'primary', reminder: true },
  ],
};
const listeners = new Set<() => void>();
const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};

export const habits = {
  bump(id: string, delta: number) {
    set({ habits: state.habits.map((h) => (h.id === id ? { ...h, today: Math.max(0, Math.min(h.goal, h.today + delta)) } : h)) });
  },
  toggleDone(id: string) {
    set({ habits: state.habits.map((h) => (h.id === id ? { ...h, today: h.today >= h.goal ? 0 : h.goal } : h)) });
  },
  setReminder(id: string, reminder: boolean) {
    set({ habits: state.habits.map((h) => (h.id === id ? { ...h, reminder } : h)) });
  },
  setGoal(id: string, goal: number) {
    set({ habits: state.habits.map((h) => (h.id === id ? { ...h, goal, today: Math.min(h.today, goal) } : h)) });
  },
  add(name: string, goal: number, unit: string) {
    set({ habits: [...state.habits, { id: `h${Date.now()}`, name, goal, unit, today: 0, streak: 0, tone: 'primary', reminder: false }] });
  },
  remove(id: string) {
    set({ habits: state.habits.filter((h) => h.id !== id) });
  },
};

export const isDone = (h: Habit) => h.today >= h.goal;
export const habitById = (id: string) => state.habits.find((h) => h.id === id);

export function useHabits(): Habit[] {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state.habits,
    () => state.habits
  );
}

/** Completed-count per weekday for the insights charts. */
export const WEEK = [
  { label: 'Mon', value: 4 },
  { label: 'Tue', value: 5 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 5 },
  { label: 'Fri', value: 2 },
  { label: 'Sat', value: 4 },
  { label: 'Sun', value: 3 },
];
export const COMPLETION_30D = [40, 60, 60, 80, 100, 80, 60, 80, 100, 100, 60, 80, 80, 100, 60, 40, 80, 100, 100, 80, 60, 80, 100, 80, 100, 60, 80, 100, 80, 60];
export const BY_CATEGORY = [
  { label: 'Health', value: 46 },
  { label: 'Mind', value: 30 },
  { label: 'Movement', value: 24 },
];
/** Days in the current month with all habits done (for the calendar). */
export const COMPLETED_DAYS = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19, 20];
