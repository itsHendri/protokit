/**
 * The curated font list for theme recipes. Every family is on Google Fonts (for the docs preview and
 * next/font) and has an @expo-google-fonts package (for native), with 400–700 available.
 *
 * APPEND-ONLY: a theme code stores a font's index in this list. Never reorder or remove an entry;
 * retire one by marking it `hidden: true` (old codes still resolve, the picker stops offering it).
 *
 *   id          stable id, also the @expo-google-fonts package suffix
 *   family      the Google Fonts family name
 *   category    sans | serif | display — for grouping in the picker
 *   weights     the static weights we load (400–700); a class asking for another snaps to the nearest
 *   expoPrefix  the export prefix of the @expo-google-fonts package (Inter_600SemiBold → 'Inter')
 */
export const FONTS = [
  { id: 'system', family: 'System', category: 'sans', weights: [400, 500, 600, 700, 800] },
  { id: 'inter', family: 'Inter', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'Inter' },
  { id: 'geist', family: 'Geist', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'Geist' },
  { id: 'dm-sans', family: 'DM Sans', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'DMSans' },
  { id: 'manrope', family: 'Manrope', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'Manrope' },
  { id: 'plus-jakarta-sans', family: 'Plus Jakarta Sans', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'PlusJakartaSans' },
  { id: 'outfit', family: 'Outfit', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'Outfit' },
  { id: 'space-grotesk', family: 'Space Grotesk', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'SpaceGrotesk' },
  { id: 'ibm-plex-sans', family: 'IBM Plex Sans', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'IBMPlexSans' },
  { id: 'nunito', family: 'Nunito', category: 'sans', weights: [400, 500, 600, 700], expoPrefix: 'Nunito' },
  { id: 'bricolage-grotesque', family: 'Bricolage Grotesque', category: 'display', weights: [400, 500, 600, 700], expoPrefix: 'BricolageGrotesque' },
  { id: 'fraunces', family: 'Fraunces', category: 'serif', weights: [400, 500, 600, 700], expoPrefix: 'Fraunces' },
  { id: 'playfair-display', family: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700], expoPrefix: 'PlayfairDisplay' },
  { id: 'lora', family: 'Lora', category: 'serif', weights: [400, 500, 600, 700], expoPrefix: 'Lora' },
  { id: 'source-serif-4', family: 'Source Serif 4', category: 'serif', weights: [400, 500, 600, 700], expoPrefix: 'SourceSerif4' },
];

export const fontById = (id) => FONTS.find((f) => f.id === id);

/** The nearest loaded weight of a font to the one a class asks for. */
export function nearestWeight(font, weight) {
  return font.weights.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), font.weights[0]);
}

/** Google Fonts CSS for a set of families (docs preview and embeds; the kits bundle their fonts). */
export function googleFontsHref(ids) {
  const families = [...new Set(ids)]
    .map(fontById)
    .filter((f) => f && f.id !== 'system')
    .map((f) => `family=${f.family.replace(/ /g, '+')}:wght@${f.weights.join(';')}`);
  return families.length ? `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap` : null;
}
