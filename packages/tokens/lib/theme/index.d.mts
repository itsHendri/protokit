/** Types for @itshendri/kit-tokens/theme (index.mjs). */

export type Neutral = 'zinc' | 'neutral' | 'slate' | 'stone' | 'gray' | 'brand';
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Controls = 'pill' | 'match';
export type Stroke = 'regular' | 'thin' | 'bold';
export type Depth = 'soft' | 'flat' | 'raised' | 'hard';
export type Density = 'comfortable' | 'compact' | 'spacious';
export type Border = 'regular' | 'hairline' | 'heavy';
export type Mode = 'light' | 'dark';

export type Recipe = {
  v: number;
  brand: string;
  neutral: Neutral;
  radius: Radius;
  controls: Controls;
  font: { heading: string; body: string };
  stroke: Stroke;
  depth: Depth;
  density: Density;
  border: Border;
  preset?: string;
};
export type RecipeInput = Partial<Omit<Recipe, 'font'>> & { font?: Partial<Recipe['font']> };

export type Adjustment = { token: string; mode: Mode; from: string; to: string };

export type Theme = {
  recipe: Recipe;
  code: string;
  primitives: { brand: Record<string, string>; neutral: Record<string, string> };
  semantic: Record<string, unknown>;
  /** Semantic colours as hex per mode, kebab-case names (`primary-foreground`). */
  resolved: Record<Mode, Record<string, string>>;
  /** Base radius in px. */
  radius: number;
  adjustments: Adjustment[];
  [key: string]: unknown;
};

export type Font = { id: string; family: string; category: 'sans' | 'serif' | 'display'; weights: number[]; expoPrefix?: string; hidden?: boolean };
export type Preset = { id: string; name: string; description: string; recipe: RecipeInput };
export type ThemeStatus = { applied: false } | { applied: true; code: string; recipe: Recipe; drift: string[] };
export type TokensJson = Record<string, unknown> & { primitive: Record<string, unknown>; semantic: Record<string, unknown> };

export const RECIPE_VERSION: number;
export const DEFAULT_RECIPE: Readonly<Recipe>;
export const OPTIONS: {
  neutral: Neutral[];
  radius: Radius[];
  controls: Controls[];
  stroke: Stroke[];
  depth: Depth[];
  density: Density[];
  border: Border[];
};
export const FONTS: Font[];
export const PRESETS: Preset[];
export const BRAND_RAMPS: Record<string, Record<string, string>>;
export const THEME_EXTENSION: string;

export function normalizeRecipe(input?: RecipeInput): Recipe;
export function sameRecipe(a: RecipeInput, b: RecipeInput): boolean;
export function generateTheme(recipe: RecipeInput, base: TokensJson, options?: { fix?: boolean }): Theme;
export function encodeRecipe(recipe: RecipeInput): string;
export function decodeRecipe(code: string): Recipe;
export function isThemeCode(value: unknown): boolean;
export function fontById(id: string): Font | undefined;
export function googleFontsHref(ids: string[]): string | null;
export function presetById(id: string): Preset | undefined;
export function themeVars(theme: Theme, format: 'hsl' | 'oklch'): Record<Mode, Record<string, string>>;
export function themeHex(theme: Theme): Record<Mode, Record<string, string>>;
export function themeCss(theme: Theme, options?: { format?: 'hsl' | 'oklch'; light?: string; dark?: string }): string;
export function applyRecipe(tokens: TokensJson, recipe: RecipeInput): { tokens: TokensJson; theme: Theme };
export function themeStatus(tokens: TokensJson): ThemeStatus;
