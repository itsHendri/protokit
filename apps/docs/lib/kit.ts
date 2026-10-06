/**
 * Everything the site knows about the kit, read from the monorepo at build time. The docs app is the
 * one app that may reach outside its folder: it documents the others.
 */
import kitJson from '../../../kit.json';
import registryIndex from '../../mobile/registry/generated/index.json';
import registryJson from '../../mobile/registry.json';
import themeJson from '../../mobile/tokens/generated/theme.registry.json';
import type { CategoryId, CategoryMeta, ComponentMeta } from '../../mobile/registry/types';

export const kit = kitJson as {
  name: string;
  tagline: string;
  repo: string;
  siteUrl: string | null;
  npmScope: string;
  registry: { native: string; web: string };
};

export type KitComponent = ComponentMeta & { install: string | null };

export const categories = registryIndex.categories as CategoryMeta[];
export const components = registryIndex.components as KitComponent[];
/** What the Kitchen Sink shows (KitChip, Text and Label have no demo of their own). */
export const previewed = components.filter((c) => c.preview !== false);

export const componentsIn = (category: CategoryId) => components.filter((c) => c.category === category);
export const getComponent = (id: string) => components.find((c) => c.id === id);
export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;

/** Semantic colour names, in tokens.json order (radius excluded). */
export const colorNames = Object.keys(themeJson.web.cssVars.light).filter((k) => k !== 'radius');

/** Source link for a file in the mobile kit. */
export const sourceUrl = (file: string) => `${kit.repo}/blob/main/apps/mobile/${file}`;

/**
 * Where the kit's web export lives. Production: /m on this site (same origin). Dev: point
 * NEXT_PUBLIC_KIT_WEB_URL at a running `npm run web` (e.g. http://localhost:8090) and start the kit with
 * EXPO_PUBLIC_EMBED_ORIGINS=http://localhost:3000 so it accepts the theme messages.
 */
export const kitWebUrl = (process.env.NEXT_PUBLIC_KIT_WEB_URL ?? '/m').replace(/\/$/, '');

/** The registry URL template for a shadcn components.json. */
export const registryUrl = (origin: string) => `${origin}/r/native/{name}.json`;

type RegistryItem = { name: string; dependencies?: string[]; registryDependencies?: string[] };
const registryItems = (registryJson as { items: RegistryItem[] }).items;

/** The published shadcn item behind a component (`@kit-native/list-row` → its deps), if it has one. */
export function registryItemFor(c: KitComponent): RegistryItem | undefined {
  if (!c.install?.startsWith(`${kit.registry.native}/`)) return undefined;
  const name = c.install.slice(kit.registry.native.length + 1);
  return registryItems.find((i) => i.name === name);
}
