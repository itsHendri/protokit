# Protokit

Prototype kits for mobile and web that coding agents build from. Hand an agent a brief or a meeting
transcript and get a working, themed prototype composed only from the components in the kit: no invented
components, no stray colours, light and dark from day one.

| | |
|---|---|
| [`apps/mobile`](./apps/mobile) | **Mobile kit**: Expo + React Native, NativeWind, react-native-reusables. 87 components, two sample apps, a live Kitchen Sink. |
| `apps/web` | **Web kit** (coming): Next.js + shadcn/ui on the same tokens. |
| `apps/docs` | **Docs site** (coming): how it works, setup, live component previews. |

One token file drives every kit. `tokens.json` (W3C design-token format) builds the CSS variables and
TypeScript theme each app reads, and the build refuses any palette that falls below WCAG AA.

## Three ways in

1. **Start a prototype from a kit.** Copy just the app you need:
   ```bash
   npx giget@latest gh:itsHendri/protokit/apps/mobile my-prototype
   cd my-prototype && npm install && npm run ios
   ```
   Or clone this whole repo for a client project that needs mobile and web on one brand.
2. **Add kit components to an existing Expo app** that uses react-native-reusables, through the shadcn
   registry: `npx shadcn add @kit-native/<component>` (registry URL coming with the docs site).
3. **Let your agent do it.** Point Claude Code or Cursor at the kit; it reads `AGENTS.md`,
   `DESIGN_SYSTEM.md` and `llms.txt` and builds only from what is registered.

## Working in this repo

```bash
npm install            # once, at the root (npm workspaces)
npm run ios            # mobile kit on the iOS Simulator; also: npm run web, npm run dev
npm run check          # typecheck, lint, token and registry checks for the mobile kit
```

Each app is self-contained and documented in its own README and `AGENTS.md`. Start with
[apps/mobile/README.md](./apps/mobile/README.md).

## Licence

MIT. See [LICENSE](./LICENSE).
