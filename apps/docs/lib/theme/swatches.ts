/**
 * The quick colours in the pill and the studio. All but Ink are a curated ramp's 600 step, so they map to
 * that exact Tailwind ramp (packages/tokens/lib/theme/palettes.mjs); any other colour is generated.
 */
export const SWATCHES = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Pink', hex: '#db2777' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Ink', hex: '#18181b' },
] as const;

export const swatchName = (hex: string) => SWATCHES.find((s) => s.hex === hex.toLowerCase())?.name ?? hex.toUpperCase();
