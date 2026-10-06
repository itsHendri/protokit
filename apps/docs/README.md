# Protokit docs site

How the kits work, setup, and every component live in a phone frame. Next.js 16 + Fumadocs 16, styled with
the kit's own tokens, built as a fully static site and served by Cloudflare as static assets (no Worker
script, so no request or CPU limits apply on the free plan).

This app is monorepo-only by design: it reads `apps/mobile` (tokens, registry, `DESIGN_SYSTEM.md`,
`llms.txt`) and embeds the mobile kit's web export.

## Develop

```bash
npm install                 # at the repo root
npm run docs:dev            # http://localhost:3000
```

The phone frames load the kit from `/m`, which only exists after a build. To see them live while
developing, run the kit's web server alongside and point the site at it:

```bash
EXPO_PUBLIC_EMBED_ORIGINS=http://localhost:3000 npm run web -- --port 8090          # terminal 1, repo root
NEXT_PUBLIC_KIT_WEB_URL=http://localhost:8090 npm run docs:dev                      # terminal 2
```

## Build and preview

```bash
npm run docs:build          # → apps/docs/out (about 3 minutes: includes the kit's web export)
npm run docs:preview        # serves out/ with Cloudflare's own rules, http://localhost:8788
npm run check:links -w apps/docs
```

`scripts/build-docs.mjs` does, in order: `kit-tokens build` (→ `app/tokens.css`), the generated pages
(`scripts/prepare-content.mjs`), the kit's web export with `KIT_WEB_BASE_URL=/m` into `public/m`, the
shadcn registry into `public/r/native`, `_redirects` (one rule per kit route; a blanket `/m/*` rule would
swallow the kit's JavaScript) and `_headers`, then `next build`, then a check that it all landed in `out/`.

## Deploy (Cloudflare Workers, static assets)

One-time, in the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**, pick
`itsHendri/protokit`, then:

| Setting | Value |
|---|---|
| Root directory | `apps/docs` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Build variables | `NODE_VERSION=24` |

Every push to `main` deploys; other branches get preview URLs. Once you know the production URL, set
`siteUrl` in the repo-root `kit.json` so `install.md` and `llms.txt` use absolute links.

Manual deploy instead: `npm run docs:build && npx wrangler deploy` from `apps/docs` (after `npx wrangler login`).
