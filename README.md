# Mobile app prototype kit

A brand-agnostic, themeable **Expo** starter for mobile prototypes. Every component the kit ships is
previewed live inside the app, so a designer can browse what exists, copy the exact token names, and
build screens only from those parts. Feed it a brief or a client transcript and get a first prototype
that already looks and feels coherent.

- **Expo SDK 57** · Expo Router · React Native 0.86 · TypeScript
- **react-native-reusables** (shadcn for React Native) + our own kit components, styled with **NativeWind**
- **Design tokens** in one JSON file → CSS variables + TypeScript, light and dark
- **Kitchen Sink** and **Foundations** screens, searchable, tap-to-copy
- Ships to phones with a **development build + EAS Update**, and to a **web URL** with EAS Hosting

## Quick start

```bash
npm install
npm run ios        # iOS Simulator (Expo Go) — or `npm run web`
```

Then open **Components** in the app.

## Start a real project

1. Rename: `name`, `slug`, `scheme`, `ios.bundleIdentifier`, `android.package` in `app.json`; `name` in `package.json`.
2. Brand: edit `tokens/tokens.json` (brand ramp + semantic colours + radius), run `npm run tokens:build`.
   Add a font with the `expo-font` config plugin and set `primitive.font.family.sans`.
3. Replace `assets/images/*` (icon, splash, favicon).
4. Delete the samples: `app/(shop)`, `app/(habits)`, `components/shop`, `components/habits`, and the "Sample apps" card on the kit home.
5. `eas init` under your account; `eas update:configure`.
6. Build your prototype as its own route group in `app/` (see `AGENTS.md › Building a prototype`).

## Figma

`npm run tokens:figma` writes `tokens/generated/figma-variables.json` (a Variables collection with Light/Dark
modes and `var(--name)` code syntax). With `FIGMA_TOKEN` and `FIGMA_FILE_KEY` set it POSTs to the Variables REST
API (Enterprise seat); otherwise import the JSON through the Figma MCP (`use_figma`) or a variables plugin.

## Sharing

- Phones: `eas build --profile development` once per platform, then `npm run share -- "what changed"`.
- Browser: `npm run export:web && eas deploy` → preview URL.
- Expo Go still works on simulators; on a physical iPhone it requires signing in to the same Expo account.

## Docs

- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — tokens, registry, patterns, anti-patterns. Read before writing UI.
- [`AGENTS.md`](./AGENTS.md) — engineering conventions, workflows, gotchas (also what Claude Code reads).
- [`BACKLOG.md`](./BACKLOG.md) — deferred work.
- `.claude/skills/` — `add-component`, `qc-pass`, `transcript-to-prototype`.
