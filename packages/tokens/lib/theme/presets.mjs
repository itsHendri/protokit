/**
 * Starting points by personality. Each is a full recipe; the picker starts from one and tweaks.
 * Drafts — review them in the docs studio (/themes) and adjust here. Order is the gallery order.
 */
export const PRESETS = [
  {
    id: 'default',
    name: 'Default',
    description: 'The kit as it ships: system type, blue, soft cards.',
    recipe: { brand: '#2563eb', neutral: 'zinc', radius: 'lg', controls: 'pill', font: { heading: 'system', body: 'system' }, stroke: 'regular', depth: 'soft', density: 'comfortable', border: 'regular' },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Serif headlines, rust ink, hairlines and almost no rounding.',
    recipe: { brand: '#9a3412', neutral: 'stone', radius: 'sm', controls: 'match', font: { heading: 'fraunces', body: 'inter' }, stroke: 'thin', depth: 'flat', density: 'comfortable', border: 'hairline' },
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Lavender, generous radius, brand-tinted greys and room to breathe.',
    recipe: { brand: '#8b5cf6', neutral: 'brand', radius: '2xl', controls: 'pill', font: { heading: 'plus-jakarta-sans', body: 'plus-jakarta-sans' }, stroke: 'regular', depth: 'soft', density: 'spacious', border: 'hairline' },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Pink, chunky icons, round display type and lifted cards.',
    recipe: { brand: '#db2777', neutral: 'neutral', radius: 'xl', controls: 'pill', font: { heading: 'bricolage-grotesque', body: 'nunito' }, stroke: 'bold', depth: 'raised', density: 'comfortable', border: 'regular' },
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Square corners, heavy borders, hard offset shadows, grotesk type.',
    recipe: { brand: '#e11d48', neutral: 'neutral', radius: 'none', controls: 'match', font: { heading: 'space-grotesk', body: 'space-grotesk' }, stroke: 'bold', depth: 'hard', density: 'comfortable', border: 'heavy' },
  },
  {
    id: 'mono',
    name: 'Mono',
    description: 'Black and white, Geist, flat and compact: a tool, not a toy.',
    recipe: { brand: '#18181b', neutral: 'zinc', radius: 'md', controls: 'match', font: { heading: 'geist', body: 'geist' }, stroke: 'regular', depth: 'flat', density: 'compact', border: 'regular' },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Electric violet, heavy icons, big controls and raised surfaces.',
    recipe: { brand: '#7c3aed', neutral: 'slate', radius: 'xl', controls: 'pill', font: { heading: 'outfit', body: 'inter' }, stroke: 'bold', depth: 'raised', density: 'spacious', border: 'regular' },
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Teal on warm greys, a book serif for headings, thin lines, no shadows.',
    recipe: { brand: '#0d9488', neutral: 'stone', radius: 'xl', controls: 'match', font: { heading: 'lora', body: 'manrope' }, stroke: 'thin', depth: 'flat', density: 'spacious', border: 'hairline' },
  },
];

export const presetById = (id) => PRESETS.find((p) => p.id === id);
