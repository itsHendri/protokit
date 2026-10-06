# Protokit — agent guide (repo root)

A monorepo of prototype kits. Each app is self-contained; this file only covers how they fit together.

```
apps/mobile/    Expo mobile kit. Its AGENTS.md, DESIGN_SYSTEM.md and .claude/skills are the rules for any mobile work.
apps/docs/      Docs site (coming in Phase B).
apps/web/       Web kit (coming).
packages/       Shared tooling published to npm (coming: @itshendri/kit-tokens).
kit.json        The kit's name and addresses, read by the generators.
```

## Rules

- **Work inside one app.** Read that app's `AGENTS.md` first. For the mobile kit: `apps/mobile/AGENTS.md`
  and `apps/mobile/DESIGN_SYSTEM.md`.
- **Apps never import from each other or reach outside their folder.** An app must keep working when it
  is copied out on its own (`npx giget gh:itsHendri/protokit/apps/mobile`). Shared code goes through a
  published package in `packages/`, depended on by version range.
- **One install, at the root.** `npm install` at the repo root (npm workspaces). Run an app's scripts
  from its folder or with `-w apps/<name>`. Never add a lockfile inside an app.
- React and react-dom are pinned once, in the root `overrides`, to the version the Expo SDK requires.
  An SDK upgrade moves every app.
- Tailwind 3 (mobile, NativeWind) and Tailwind 4 (docs, web) coexist: the root pins `tailwindcss@^3`
  so v3 hoists and v4 nests under the Next apps. `npm ls tailwindcss` should show that.

## Skills

The mobile kit's skills (`add-component`, `qc-pass`, `transcript-to-prototype`) live in
`apps/mobile/.claude/skills` and travel with the app. Claude Code loads them once a file under
`apps/mobile` is opened, or start Claude from `apps/mobile`.
