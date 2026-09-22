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
import { KIT_ACTIONS_SECTIONS } from './sections/kit-actions';
import { KIT_INPUTS_SECTIONS } from './sections/kit-inputs';
import { KIT_NAVIGATION_SECTIONS } from './sections/kit-navigation';
import { KIT_DATA_SECTIONS } from './sections/kit-data';
import { KIT_FEEDBACK_SECTIONS } from './sections/kit-feedback';
import { KIT_LAYOUT_SECTIONS } from './sections/kit-layout';
import { KIT_OVERLAYS_SECTIONS } from './sections/kit-overlays';

/** ui/ (reusables) previews live in <category>.tsx; kit/ previews in kit-<category>.tsx. */
const RAW_SECTIONS: ComponentSection[] = [
  ...ACTIONS_SECTIONS,
  ...KIT_ACTIONS_SECTIONS,
  ...INPUTS_SECTIONS,
  ...KIT_INPUTS_SECTIONS,
  ...NAVIGATION_SECTIONS,
  ...KIT_NAVIGATION_SECTIONS,
  ...DATA_SECTIONS,
  ...KIT_DATA_SECTIONS,
  ...FEEDBACK_SECTIONS,
  ...KIT_FEEDBACK_SECTIONS,
  ...LAYOUT_SECTIONS,
  ...KIT_LAYOUT_SECTIONS,
  ...OVERLAYS_SECTIONS,
  ...KIT_OVERLAYS_SECTIONS,
  ...MEDIA_SECTIONS,
];

/** Honour `after`: move a section directly behind the one it names. */
function placeAfter(list: ComponentSection[]): ComponentSection[] {
  const out = list.filter((s) => !s.after);
  for (const s of list.filter((s) => s.after)) {
    const i = out.findIndex((o) => o.id === s.after);
    out.splice(i === -1 ? out.length : i + 1, 0, s);
  }
  return out;
}

export const SECTIONS: ComponentSection[] = placeAfter(RAW_SECTIONS);

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
