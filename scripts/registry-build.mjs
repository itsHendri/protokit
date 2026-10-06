#!/usr/bin/env node
/**
 * scripts/registry-build.mjs — everything derived from registry/components.ts.
 *
 *   npm run registry:build            write the outputs
 *   npm run registry:build -- --check write nothing; exit 1 if anything is stale (CI)
 *
 * 1. Checks: unique ids, every listed file exists and exports what the entry says, and every
 *    components/ui + components/kit file belongs to an entry (or is a known helper).
 * 2. DESIGN_SYSTEM.md: rewrites the blocks between <!-- GENERATED:<name> --> markers (one table per
 *    category, and the radius scale). Everything outside the markers stays hand-written.
 * 3. llms.txt: the agent-facing index (rules pointer, components, tokens).
 * 4. registry/generated/index.json: the same data for the docs site.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATEGORY_META } from '../registry/categories.ts';
import { COMPONENTS } from '../registry/components.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const read = (p) => readFileSync(join(root, p), 'utf8');

/** Files under components/ui and components/kit that are internals, not registry entries. */
const HELPERS = ['components/ui/native-only-animated-view.tsx'];

// ---------- 1. checks ----------------------------------------------------------------------------

const problems = [];
const ids = new Set();
for (const c of COMPONENTS) {
  if (ids.has(c.id)) problems.push(`duplicate id "${c.id}"`);
  ids.add(c.id);
  if (!CATEGORY_META.some((cat) => cat.id === c.category)) problems.push(`${c.id}: unknown category "${c.category}"`);
  for (const file of c.files) {
    if (!existsSync(join(root, file))) {
      problems.push(`${c.id}: file not found: ${file}`);
      continue;
    }
    const src = read(file);
    for (const name of file === c.files[0] ? c.exports : []) {
      const exported =
        new RegExp(`export\\s+(?:default\\s+)?(?:async\\s+)?(?:function|const|let|class)\\s+${name}\\b`).test(src) ||
        new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`).test(src);
      if (!exported) problems.push(`${c.id}: ${file} does not export ${name}`);
    }
  }
}
const listed = new Set([...COMPONENTS.flatMap((c) => c.files), ...HELPERS]);
for (const dir of ['components/ui', 'components/kit']) {
  for (const f of readdirSync(join(root, dir))) {
    if (/\.tsx?$/.test(f) && !listed.has(`${dir}/${f}`)) problems.push(`unregistered: ${dir}/${f} — add it to registry/components.ts`);
  }
}
if (problems.length) {
  console.error(`registry:build FAILED\n${problems.map((p) => `  ${p}`).join('\n')}`);
  process.exit(1);
}

// ---------- helpers ------------------------------------------------------------------------------

/** "Toast / `useToast`": components plain, hooks and helpers in code style. */
const displayName = (c) => c.exports.map((e) => (/^[A-Z]/.test(e) ? e : `\`${e}\``)).join(' / ');
const byCategory = (id) => COMPONENTS.filter((c) => c.category === id);
const cell = (s) => (s ?? '').replace(/\|/g, '\\|');
const firstSentence = (s) => (s ? s.split(/(?<=\.)\s/)[0] : '');

function replaceBlock(text, name, body, file) {
  const open = `<!-- GENERATED:${name} -->`;
  const close = `<!-- /GENERATED:${name} -->`;
  const start = text.indexOf(open);
  const end = text.indexOf(close);
  if (start === -1 || end === -1 || end < start || text.indexOf(open, start + 1) !== -1) {
    console.error(`registry:build: missing or duplicated marker ${open} in ${file}`);
    process.exit(1);
  }
  return text.slice(0, start + open.length) + '\n' + body + '\n' + text.slice(end);
}

// ---------- 2. DESIGN_SYSTEM.md ------------------------------------------------------------------

let designSystem = read('DESIGN_SYSTEM.md');
for (const cat of CATEGORY_META) {
  const rows = byCategory(cat.id).map((c) => `| ${displayName(c)} | \`${c.files[0]}\` |${c.notes ? ` ${cell(c.notes)} ` : ' '}|`);
  const table = ['| Component | Path | Notes |', '|---|---|---|', ...rows].join('\n');
  designSystem = replaceBlock(designSystem, `registry:${cat.id}`, table, 'DESIGN_SYSTEM.md');
}

const tokens = JSON.parse(read('tokens/tokens.json'));
const RADIUS_USE = { md: 'inputs, buttons', lg: 'cards, sheets base', '2xl': 'sheet tops, hero surfaces', full: 'chips, avatars, dots' };
const radiusLine = Object.entries(tokens.primitive.radius)
  .filter(([, t]) => t && typeof t === 'object' && '$value' in t)
  .map(([k, t]) => `\`rounded-${k}\`${k === 'full' ? '' : ` ${t.$value}`}${RADIUS_USE[k] ? ` (${RADIUS_USE[k]})` : ''}`)
  .join(' · ');
designSystem = replaceBlock(designSystem, 'tokens:radius', radiusLine + '.', 'DESIGN_SYSTEM.md');

// ---------- 3. llms.txt --------------------------------------------------------------------------

const app = JSON.parse(read('app.json')).expo;
const llmsTokens = existsSync(join(root, 'tokens/generated/llms-tokens.md'))
  ? read('tokens/generated/llms-tokens.md').replace(/^<!--.*-->\n/, '')
  : '';
const llms = `# ${app.name}

> A brand-agnostic Expo + React Native prototype kit (Expo Router, NativeWind, react-native-reusables).
> Screens are composed ONLY from the components listed below; nothing else exists.

Generated by \`npm run registry:build\` from registry/components.ts — do not edit by hand.

## Read first

- [AGENTS.md](AGENTS.md): stack, commands, how to build a prototype, gotchas
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): tokens, the component registry, patterns, anti-patterns, the hallucination guard
- [DESIGN.md](DESIGN.md): the design tokens in the DESIGN.md format

## Rules

- Use only the components below, by their exact names. Missing something: stop and say so (the \`add-component\` skill adds it properly).
- Style with semantic Tailwind classes only. No hex, no Tailwind palette colours, no StyleSheet colours.
- Text through \`<Text variant>\` from components/ui/text; icons through \`<Icon as={…} />\` (lucide).
- Check every screen in light and dark.

## Components
${CATEGORY_META.map(
  (cat) =>
    `\n### ${cat.label}\n\n` +
    byCategory(cat.id)
      .map((c) => {
        const parts = [c.notes || firstSentence(c.caption), c.api && `\`${c.api}\``].filter(Boolean);
        return `- [${displayName(c)}](${c.files[0]})${parts.length ? `: ${parts.join(' — ')}` : ''}`;
      })
      .join('\n')
).join('\n')}

${llmsTokens}`;

// ---------- 4. registry/generated/index.json -----------------------------------------------------

const index = {
  $comment: 'GENERATED by `npm run registry:build` from registry/components.ts — do not edit by hand.',
  name: app.name,
  categories: CATEGORY_META,
  components: COMPONENTS,
};

// ---------- write / check ------------------------------------------------------------------------

const outputs = [
  ['DESIGN_SYSTEM.md', designSystem],
  ['llms.txt', llms],
  ['registry/generated/index.json', JSON.stringify(index, null, 2) + '\n'],
];
const stale = outputs.filter(([p, contents]) => !existsSync(join(root, p)) || read(p) !== contents);
if (check) {
  if (stale.length) {
    console.error(`registry:build --check: out of date — run \`npm run registry:build\`:\n${stale.map(([p]) => `  ${p}`).join('\n')}`);
    process.exit(1);
  }
  console.log(`registry:build --check: ${COMPONENTS.length} components, ${outputs.length} outputs up to date`);
} else {
  for (const [p, contents] of stale) {
    mkdirSync(dirname(join(root, p)), { recursive: true });
    writeFileSync(join(root, p), contents);
  }
  console.log(`registry:build → ${COMPONENTS.length} components · ${stale.map(([p]) => p).join(', ') || 'nothing changed'}`);
}
