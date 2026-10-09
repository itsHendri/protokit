# Docs navigation: decision record

A living contract for the docs site's navigation. Wireframes: `navigation-wireframes.html` (open it in a
browser). A build that contradicts this file stops and re-checks it first; change this file in place when a
decision changes.

## The problem (2026-10-09)

- Two shells: Home, Screens and Themes used Fumadocs' home layout (links in a top bar), while Docs and
  Components used the docs layout, where the top bar disappears and the same links move into the top of the
  sidebar. Moving between sections moved the navigation.
- Install was a top-level nav item, but it is one Docs page (`/docs/install`); clicking it changed shells.
- Themes (`/themes`) was not in the nav at all; only the theme bar linked to it.

## The direction: A, one shell

A top bar that never moves, on every page; a sidebar only where a section has a tree. The pattern shadcn/ui,
Radix, gluestack and Mintlify use. Built on Fumadocs' notebook layout (`fumadocs-ui/layouts/notebook`,
`nav.mode: 'top'`) for Docs and Components, and the home layout's navbar, with the same links, for the rest.

### Information architecture

| Top bar | Route | Sidebar |
| --- | --- | --- |
| Logo → Home | `/` | none |
| Docs | `/docs/*` | Get started · Design system · Project |
| Components | `/components/*` | Mobile / Web switch, then categories in registry order |
| Screens | `/screens` | none (Mobile / Web chips stick under the bar) |
| Themes | `/themes` | none (the studio has its own inspector) |
| Search ⌘K, Get started (→ `/docs/install`), GitHub | | |

Docs sidebar groups: **Get started** (How it works, Install, Mobile kit, Web kit), **Design system**
(Foundations, Themes, Patterns), **Project** (Changelog).

### Rules

- The top bar is identical on every page: same links, same order, same position. Only the current section's
  underline changes.
- The current section is marked with a neutral underline (foreground), never the brand colour: the site's
  selected-state rule, and it passes contrast under any theme.
- Install is a "Get started" outline button at the right of the bar, not a nav link. The hero keeps its own
  buttons.
- A sidebar appears only for a tree. Gallery pages (Screens) and tools (Themes studio) are full width under
  the bar.
- Phones: logo, search and a menu button. The menu sheet lists the four sections, then the current section's
  tree.
- The theme bar stays at the bottom of every page except `/themes`, unchanged.

## Explicitly deferred

- Organising the site by kit (a Mobile / Web switch in the top bar, one tree per kit): cleanest IA, but new
  URLs and redirects, and cross-kit pages (Themes, how it works) have no home.
- A sidebar on Screens (one page per sample app): worth it once there are more sample apps.
- A single sidebar with no top bar (GitBook style): costs the landing page and frame width.
- An active state on the Screens chips (scroll spy).

## How it is built (2026-10-09)

- `components/site-header.tsx` is the one top bar. Both layouts render it in place of their own header
  (`nav.component` in `lib/layout.shared.tsx`): the home layout (Home, Screens, Themes) and the notebook layout
  (Docs, Components). Neither layout's built-in header could put the sections in the same place, so they share
  ours. The sections live in `lib/sections.ts`.
- On phones the home layout opens a menu (sections, Get started, theme, GitHub); the notebook layout opens its
  sidebar drawer, fed by `links` with `on: 'menu'` (sections, Get started), above the tree.
- The theme bar sits at z-30, under drawers and menus.
- Screens' Mobile / Web chips stick under the bar; they have no active state yet (deferred).
