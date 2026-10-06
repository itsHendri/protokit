# Prototype Kit (web) — agent guide

A brand-agnostic Next.js starter for web prototypes: dashboards, marketing pages and AI product
interfaces. Designers hand it a brief (or a meeting transcript) and get a working, themed prototype built
only from the components in this repo.

**Read `DESIGN_SYSTEM.md` before writing any UI.** It has the token rules, the component registry and the
hallucination guard. This file covers engineering, workflows and gotchas.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind 4 · shadcn/ui (owned source in
  `components/ui`) · lucide-react · next-themes · Recharts (through `components/ui/chart`) · sonner (toasts)
- **className-only styling** with the semantic token classes. No inline colours, no hex.
- Tokens: `tokens/tokens.json` → `npm run tokens:build` (@itshendri/kit-tokens) → `app/tokens.css`,
  `lib/theme.ts`, `DESIGN.md`, `tokens/generated/`
- Theme: next-themes (`class` on `<html>`, system by default). `ThemeToggle` in `components/site`.

## Layout

```
app/layout.tsx          providers (theme, tooltips, toasts) + the embed boot script
app/(kit)/              the kit shell: Home (/) · Components (/components, the Kitchen Sink) · Foundations
app/<slug>/             a prototype: its own folder with its own layout.tsx (AppShell, a marketing layout…)
components/ui/          shadcn/ui — add more with the add-component skill (`npx shadcn@latest add <name>`)
components/kit/         ours: AppShell, PageHeader, StatTile, DataTable, EmptyState, Hero, FeatureGrid,
                        PricingCard, ChatMessage, ChatComposer, StreamingText, ThinkingIndicator,
                        ToolCallCard, ApprovalCard
components/devkit/      the Kitchen Sink: demos.tsx keyed by registry id
components/site/        the kit shell's own chrome (header, theme toggle, providers)
registry/               components.ts: what the kit ships → DESIGN_SYSTEM.md tables, llms.txt, registry.json
hooks/, lib/            use-reduced-motion · embed (docs iframe mode) · theme.ts (generated)
DESIGN.md, llms.txt     GENERATED agent-facing summaries
.claude/skills/         add-component, qc-pass, transcript-to-prototype
```

## Commands

Inside the Protokit monorepo, install once at the repo root and run these from `apps/web` (or with
`-w apps/web`). Copied out on its own, this app is a normal npm project.

```bash
npm run dev               # http://localhost:3100
npm run build && npm start
npm run typecheck && npm run lint
npm run tokens:build      # after editing tokens/tokens.json (fails below WCAG AA)
npm run registry:build    # after editing registry/components.ts
npm run tokens:check && npm run registry:build -- --check   # what CI checks
npm run registry:drift    # after `shadcn add`: which components/ui files differ from shadcn (network)
npm run registry:dist && npm run registry:roundtrip         # build the shadcn registry and prove it reinstalls
```

## Building a prototype (the rules)

1. A prototype lives in its own folder under `app/`, e.g. `app/acme/`, with its own `layout.tsx`. An app
   prototype puts `AppShell` in that layout; a marketing page uses a plain layout. When the prototype IS the
   product, move it to `/` and delete `app/(kit)`.
2. Pages compose ONLY registry components. Patterns are in `DESIGN_SYSTEM.md › Patterns`.
3. Mock data lives beside the prototype (`app/<slug>/data.ts` or `components/<slug>/data.ts`). Never call
   real APIs; a route handler returning fixtures is fine when a flow needs one.
4. New component needed? Use the `add-component` skill: it lands in the registry and the docs.
5. Before saying "done": run the `qc-pass` skill (typecheck, lint, guards, a browser look at 375px and
   1280px in light and dark).

## Workflows

- **Preview:** `npm run dev`, or the `web-kit` launch config. Deep link a component:
  `/components?section=<id>`.
- **Embedding (the docs site's browser frames):** `?embed=1` hides everything with the `kit-chrome` class
  for the session (inside a frame); `?theme=light|dark` pins the theme without saving it. The host syncs the
  theme with `{ type: 'kit:theme', value }`; the kit answers `{ type: 'kit:ready' }`. Same origin plus
  `NEXT_PUBLIC_EMBED_ORIGINS`. See `lib/embed.ts` and `lib/embed-boot.ts`.
- **Static export:** `KIT_WEB_EXPORT=1 KIT_WEB_BASE_PATH=/w npm run build` writes `out/` under a sub-path
  (how the docs site embeds the kit).
- **Share a link:** deploy to any Next host (Vercel, Cloudflare via OpenNext) or a static export.
- **Re-brand:** edit `tokens/tokens.json` (in the monorepo: `apps/mobile/tokens/tokens.json`, then
  `npm run tokens:sync` at the root), run `npm run tokens:build`.

## Gotchas

- shadcn 4.21 imports `cn` from the `cn` package, not `@/lib/utils`.
- After `npx shadcn add`, check `app/globals.css` (components can append CSS variables; ours come only from
  tokens.css) and grep the new files for `text-white`, `bg-black`, palette colours and hex: shadcn's
  destructive variants hard-code white text, which fails AA on the dark destructive. Then
  `npm run registry:drift` and `npm run registry:build`.
- Anything theme-dependent rendered on the server (an aria-label that names the current theme) mismatches on
  hydration: switch it in CSS (`dark:`) or render it after mount.
- Kit files import each other through `@/components/kit/…`, never `./…`: the registry build refuses relative
  imports because a consumer could not resolve them.
- Server components cannot import a module that uses client-only hooks; keep server-safe pieces (like the
  embed boot script) in their own file.
