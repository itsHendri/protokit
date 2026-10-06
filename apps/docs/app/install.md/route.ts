import { kit } from '@/lib/kit';
import { site } from '@/lib/llms';

export const revalidate = false;

const repoPath = kit.repo.replace('https://github.com/', '');

/** The page an agent reads when a person pastes the install prompt. Terse, imperative, complete. */
export function GET() {
  const md = `# Install ${kit.name}

${kit.name} is a prototype kit for coding agents: a themed component registry, design tokens with a WCAG AA
gate, and rules that keep a prototype inside what the kit ships. Today it has a mobile kit (Expo, React
Native, NativeWind, react-native-reusables). A web kit (Next.js, shadcn/ui) is coming.

## 1. Pick the path

**A. New mobile prototype** (most common)

\`\`\`bash
npx giget@latest gh:${repoPath}/apps/mobile <project-name>
cd <project-name> && npm install
npm run ios        # or: npm run web
\`\`\`

**B. Add kit components to an existing Expo app** that already uses react-native-reusables:

1. Add the registry to \`components.json\`:
   \`"registries": { "${kit.registry.native}": "${site('/r/native/{name}.json')}" }\`
2. \`npx shadcn@latest add ${kit.registry.native}/theme ${kit.registry.native}/lib-theme-context\`, wrap the root
   layout in \`<KitThemeProvider>\`, then add components: \`npx shadcn@latest add ${kit.registry.native}/list-row\`.
3. When shadcn asks to overwrite a react-native-reusables file (\`text.tsx\`, \`button.tsx\`, …), answer yes or
   pass \`--overwrite\`: kit components expect the kit's refined versions.
4. \`npx expo install --fix\` so Expo packages match the project's SDK.

**C. Mobile and web on one brand**: \`git clone ${kit.repo}.git\`, \`npm install\` at the root, and work in
\`apps/mobile\`.

## 2. Read before writing UI

- \`AGENTS.md\`: stack, commands, how a prototype is laid out (its own named segment under \`app/\`), gotchas.
- \`DESIGN_SYSTEM.md\`: tokens, the component registry, patterns, anti-patterns, the hallucination guard.
- \`llms.txt\` in the project, or ${site('/llms.txt')}: every component with its API.

## 3. Rules

- Build screens only from registry components, by their exact names. If something is missing, stop, say
  so in one line, and add it with the \`add-component\` skill. Never invent a component.
- Style with semantic classes only (\`bg-card\`, \`text-muted-foreground\`, \`bg-primary/15\`). No hex, no
  Tailwind palette colours, no inline colour styles.
- Text through \`<Text variant>\`, icons through \`<Icon as={…} />\` (lucide). Buttons hold \`<Text>\`/\`<Icon>\`.
- Prefer a kit pattern over a new flow: screen skeleton, multi-step flow as one route, \`SuccessScreen\`,
  \`StickyBottomBar\`. Content is flat; shadows only on what you can press or what floats.
- Mock data lives beside the prototype (\`components/<slug>/data.ts\`). Never call real APIs.
- Check every screen in light and dark. Run the \`qc-pass\` skill before saying "done".

## 4. Re-brand

Edit \`tokens/tokens.json\` (brand ramp, semantic colours, radius) and run \`npm run tokens:build\`. The build
refuses any palette where a fill and its text, or muted text on a surface, falls below 4.5:1, and names the
pairing.
`;
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
