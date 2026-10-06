# Backlog

Durable, human- and agent-readable list of deferred work. Update when you defer or finish something.

_Last updated: 2026-10-06_

## Deferred by decision
- **Scenario system** (several prototypes in one install with a picker and web `/scenarios` index). One prototype per
  clone for now; the kit shell is a route group so it can be hidden later.
- **`publish` skill** (push latest build + web link, incl. group vs channel link rules) and **`figma-web-export`
  skill** — decide after using `npm run share` / `eas deploy` a few times.
- **Tier 2 ports** from the old kit: Carousel, Lightbox, DataTable, StatusTimeline, ProfileHeader, OnboardingSlide,
  PermissionPrompt, SettingsGroup, Breadcrumb, Pagination, ChipInput, AvatarStack, StarRating, TimeRangePicker,
  CountrySelect (needs country data), Drawer, Coachmark.
- **Figma:** `tokens/push-figma.mjs` (one-way Variables push with code syntax) and Code Connect once the component
  set is stable.

## Component gap analysis (vs. Material 3, HIG, gluestack, HeroUI — 2026-09-22)
Present: 69 previews across 8 categories. Still missing, roughly in order of how often prototypes need them:
- **Top app bar variants** — large title, search-in-header, segmented header. Today: Expo Router headers only.
- **Onboarding slide** (illustration + title + body) and **Coachmark/tooltip tour**.
- **Time picker** (Calendar covers dates) and **Range slider** (two thumbs).
- **Phone field** with country code, **Chip input** (tags), **Rating** (stars).
- **Banner** (full-width persistent, above content) — Alert is inline; **Snackbar with action** — Toast has no action yet.
- **Pull-to-refresh** wrapper, **Infinite list** footer loader, **Section list** with sticky headers.
- **Carousel** with images, **Lightbox**, **Image placeholder/upload tile**, **Video/audio placeholders**.
- **Data table**, **Timeline/status steps**, **Countdown**, **Copyable field**, **QR code**.
- **Drawer / side menu**, **Permission prompt**, **Paywall/plan cards** (SelectableCard covers the rows).

## Upgrades to schedule
- Expo SDK 58 (stable ~Oct 2026): native tabs at the stable path, data loaders, SSR. Run `npx expo install expo@next --fix` on a branch.
- NativeWind 5 + Tailwind 4 when NativeWind 5 reaches `latest` (RC since 2026-09-13). Tokens layer survives it.
- `@expo/ui` (SwiftUI/Compose controls) and `expo-glass-effect` — evaluate for native-feel controls after SDK 58.

## Known rough edges
- `Sheet` exit is a plain fade (RN Modal); a slide-out needs a mounted-state dance the React Compiler rules dislike.
- Haptics/blur only verified on the simulator; feel on a physical device still to confirm.
- Web `Select`/`DropdownMenu` positioning relies on rn-primitives portals; check on narrow viewports.
- Dev builds and Expo Go draw a draggable "Tools" gear at the top right whose touch area (gear + 10pt) covers the
  `SearchField` clear button and part of the header theme toggle on the Kitchen Sink. Dev tooling only, not in
  production; drag the gear away when testing those controls.
- One iOS session (2026-10-06) had the top two-thirds of the Kitchen Sink search field ignore taps until a Fast
  Refresh cleared it. Not reproduced after cold launch, simulator reboot or `expo start -c`. If it comes back, log
  `onTouchStart` on the root view to see whether the tap reaches React Native at all.
