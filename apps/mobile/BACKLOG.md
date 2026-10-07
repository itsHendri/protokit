# Backlog

Durable, human- and agent-readable list of deferred work. Update when you defer or finish something.

_Last updated: 2026-10-07_

## Deferred by decision
- **Scenario system** (several prototypes in one install with a picker and web `/scenarios` index). One prototype per
  clone for now; the kit shell is a route group so it can be hidden later.
- **`publish` skill** (push latest build + web link, incl. group vs channel link rules) and **`figma-web-export`
  skill** — decide after using `npm run share` / `eas deploy` a few times.
- **Tier 2 ports** from the old kit: Carousel, Lightbox, DataTable, StatusTimeline, ProfileHeader, OnboardingSlide,
  PermissionPrompt, SettingsGroup, Breadcrumb, Pagination, ChipInput, AvatarStack, StarRating, TimeRangePicker,
  CountrySelect (needs country data), Drawer, Coachmark.
- **Figma:** `kit-tokens figma` (`npm run tokens:figma`) (one-way Variables push with code syntax) and Code Connect once the component
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
- **Web semantics the a11y gate does not reach yet** (2026-10-07). The docs site's gate only loads the frames it
  embeds; axe over every Kitchen Sink category (light and dark) still finds, on web: Navigation › TabBar items
  are `role="tab"` without a `tablist` parent, PagerDots puts `aria-label` on a div with no role, and two
  horizontal scroll rows in that section are scrollable regions with nothing focusable; Feedback › `Progress` (the bar)
  has no name. On iOS, `RadioGroupItem` and `Switch` are named by their Label only on web and Android
  (`aria-labelledby`); VoiceOver reads the Label as its own element. A destructive menu item on its
  pressed/focused tint is 4.14:1 in light (shadcn's pattern, same in the web kit). The kit-tokens contrast gate
  could check `X` text on `X/15`; the kit puts no status text on its own tint.
- **Contrast gate gap:** it checks each tone as text on `background` and `card`, not on `muted`/`accent`. In dark
  mode `primary` (brand.500) on `muted` (neutral.800) is 4.04:1. Found by Lighthouse on the docs site's tabs (fixed
  there with neutral selected tabs, the kit's own rule). Adding the pairing would need a lighter dark primary — a
  brand decision.
- `Sheet` exit is a plain fade (RN Modal); a slide-out needs a mounted-state dance the React Compiler rules dislike.
- Haptics/blur only verified on the simulator; feel on a physical device still to confirm.
- Web `Select`/`DropdownMenu` positioning relies on rn-primitives portals; check on narrow viewports.
- Dev builds and Expo Go draw a draggable "Tools" gear at the top right whose touch area (gear + 10pt) covers the
  `SearchField` clear button and part of the header theme toggle on the Kitchen Sink. Dev tooling only, not in
  production; drag the gear away when testing those controls.
- One iOS session (2026-10-06) had the top two-thirds of the Kitchen Sink search field ignore taps until a Fast
  Refresh cleared it. Not reproduced after cold launch, simulator reboot or `expo start -c`. If it comes back, log
  `onTouchStart` on the root view to see whether the tap reaches React Native at all.
