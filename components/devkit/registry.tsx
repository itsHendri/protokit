/**
 * The Kitchen Sink registry — the single source of truth for what the kit ships.
 * Each entry is a self-contained preview tagged with one functional category.
 *
 * Adding a component: add it under components/ui (reusables) or components/kit (ours),
 * then add a section to the matching ./sections/*.tsx file AND a row to DESIGN_SYSTEM.md.
 * The `add-component` skill walks through this.
 */
import type { CategoryId, ComponentSection, FoundationSection, Section } from './types';
import { ACTIONS_SECTIONS } from './sections/actions';
import { INPUTS_SECTIONS } from './sections/inputs';
import { NAVIGATION_SECTIONS } from './sections/navigation';
import { DATA_SECTIONS } from './sections/data';
import { FEEDBACK_SECTIONS } from './sections/feedback';
import { LAYOUT_SECTIONS } from './sections/layout';
import { OVERLAYS_SECTIONS } from './sections/overlays';
import { MEDIA_SECTIONS } from './sections/media';
import { FOUNDATION_SECTIONS } from './foundations';

export const SECTIONS: ComponentSection[] = [
  ...ACTIONS_SECTIONS,
  ...INPUTS_SECTIONS,
  ...NAVIGATION_SECTIONS,
  ...DATA_SECTIONS,
  ...FEEDBACK_SECTIONS,
  ...LAYOUT_SECTIONS,
  ...OVERLAYS_SECTIONS,
  ...MEDIA_SECTIONS,
];

export { FOUNDATION_SECTIONS };
export type { ComponentSection, FoundationSection };

export function sectionsForCategory(category: CategoryId): ComponentSection[] {
  return SECTIONS.filter((s) => s.category === category);
}

/** Substring match over title + aliases. */
export function matchesQuery(section: Section, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [section.title, ...(section.aliases ?? [])].join(' ').toLowerCase().includes(q);
}
