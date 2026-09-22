import type { CategoryDef, CategoryId, FoundationId } from './types';
import {
  ActivityIcon,
  BellIcon,
  BlocksIcon,
  ChartBarIcon,
  CompassIcon,
  ImageIcon,
  LayersIcon,
  MousePointerClickIcon,
  PaletteIcon,
  PenLineIcon,
  RulerIcon,
  TypeIcon,
} from 'lucide-react-native';

/** Component categories, in display order. */
export const CATEGORIES: CategoryDef<CategoryId>[] = [
  { id: 'actions', label: 'Actions', blurb: 'Buttons & commit affordances', icon: MousePointerClickIcon },
  { id: 'inputs', label: 'Inputs & selection', blurb: 'Fields, toggles, pickers', icon: PenLineIcon },
  { id: 'navigation', label: 'Navigation', blurb: 'Tabs, menus, headers', icon: CompassIcon },
  { id: 'data', label: 'Data display', blurb: 'Text, avatars, badges, cards', icon: ChartBarIcon },
  { id: 'feedback', label: 'Feedback & status', blurb: 'Alerts, progress, skeletons', icon: BellIcon },
  { id: 'layout', label: 'Containers & layout', blurb: 'Cards, accordions, collapsibles', icon: BlocksIcon },
  { id: 'overlays', label: 'Overlays', blurb: 'Dialogs, popovers, menus', icon: LayersIcon },
  { id: 'media', label: 'Media & icons', blurb: 'Icons, images, ratios', icon: ImageIcon },
];

/** Foundation categories, in display order. */
export const FOUNDATIONS: CategoryDef<FoundationId>[] = [
  { id: 'color', label: 'Colour', blurb: 'Semantic colour tokens', icon: PaletteIcon },
  { id: 'metrics', label: 'Spacing & radius', blurb: 'The 4-pt grid and corner radii', icon: RulerIcon },
  { id: 'type', label: 'Typography', blurb: 'Text variants and the type scale', icon: TypeIcon },
  { id: 'motion', label: 'Motion', blurb: 'Durations & easing curves', icon: ActivityIcon },
];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as Record<
  CategoryId,
  string
>;

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && CATEGORIES.some((c) => c.id === value);
}
