'use client';
/**
 * The docs site's live theme: one recipe, shared by the pill, the studio, the site chrome and every
 * embedded kit frame. Where it starts, in order:
 *   1. `?t=<code>` in the URL (a shared link), which is then dropped from the address bar
 *   2. the visitor's last theme (localStorage)
 *   3. the theme committed in tokens.json (`$extensions`)
 * Nothing here reaches the repo: committing goes through the export panel (a code, a CLI command, a
 * prompt or a tokens.json download).
 */
import {
  decodeRecipe,
  generateTheme,
  normalizeRecipe,
  sameRecipe,
  themeStatus,
  type Recipe,
  type RecipeInput,
  type Theme,
  type TokensJson,
} from '@itshendri/kit-tokens/theme';
import * as React from 'react';
import { STORAGE_KEY } from './keys';
import tokensJson from '../../../mobile/tokens/tokens.json';

export const base = tokensJson as unknown as TokensJson;
const status = themeStatus(base);
/** The theme the kits ship with right now. */
export const committed: Recipe = status.applied ? status.recipe : normalizeRecipe();


type State = { recipe: Recipe; history: Recipe[]; future: Recipe[] };
/** What the server rendered with; hydration uses it too, then the client's own state takes over. */
const serverState: State = { recipe: committed, history: [], future: [] };
let state: State = serverState;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist(recipe: Recipe) {
  try {
    if (sameRecipe(recipe, committed)) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(recipe));
  } catch {
    /* storage unavailable: the theme lasts for this page */
  }
}

let started = false;
/** Read the URL and storage once, on the client. Safe to call any number of times. */
export function startTheme() {
  if (started || typeof window === 'undefined') return;
  started = true;
  let recipe: Recipe | null = null;
  const url = new URL(window.location.href);
  const code = url.searchParams.get('t');
  if (code) {
    try {
      recipe = decodeRecipe(code);
    } catch {
      /* a bad code: ignore it */
    }
    url.searchParams.delete('t');
    window.history.replaceState(window.history.state, '', url);
  }
  if (!recipe) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) recipe = normalizeRecipe(JSON.parse(saved));
    } catch {
      /* unreadable: fall back to the committed theme */
    }
  }
  if (recipe) {
    state = { ...state, recipe };
    persist(recipe);
  }
}

/** Called on every change. */
export function subscribeTheme(listener: () => void) {
  startTheme();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const currentRecipe = () => state.recipe;

/** Replace the theme (or change part of it). Keeps an undo history. */
export function setRecipe(next: RecipeInput | ((current: Recipe) => RecipeInput)) {
  const input = typeof next === 'function' ? next(state.recipe) : next;
  const recipe = normalizeRecipe({ ...state.recipe, ...input, font: { ...state.recipe.font, ...input.font } });
  if (JSON.stringify(recipe) === JSON.stringify(state.recipe)) return;
  state = { recipe, history: [...state.history, state.recipe].slice(-50), future: [] };
  persist(recipe);
  emit();
}

export function undo() {
  const prev = state.history.at(-1);
  if (!prev) return;
  state = { recipe: prev, history: state.history.slice(0, -1), future: [state.recipe, ...state.future] };
  persist(prev);
  emit();
}

export function redo() {
  const [next, ...future] = state.future;
  if (!next) return;
  state = { recipe: next, history: [...state.history, state.recipe], future };
  persist(next);
  emit();
}

/** Back to the theme in tokens.json. */
export const reset = () => setRecipe({ ...committed, preset: committed.preset });

const getSnapshot = () => state;
const getServerSnapshot = () => serverState;

/** The current recipe and its undo state. */
export function useThemeState() {
  return React.useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot);
}

const cache = new Map<string, Theme>();
/** A generated theme, memoised by recipe. */
export function themeFor(recipe: Recipe): Theme {
  const key = JSON.stringify(recipe);
  let theme = cache.get(key);
  if (!theme) {
    theme = generateTheme(recipe, base);
    cache.set(key, theme);
  }
  return theme;
}

/** The current theme, generated. */
export function useLiveTheme(): { recipe: Recipe; theme: Theme; isCommitted: boolean; canUndo: boolean; canRedo: boolean } {
  const s = useThemeState();
  return {
    recipe: s.recipe,
    theme: themeFor(s.recipe),
    isCommitted: sameRecipe(s.recipe, committed),
    canUndo: s.history.length > 0,
    canRedo: s.future.length > 0,
  };
}
