# Design system

The visual rules and the component registry for this kit. **Read this before writing any UI.**
Engineering conventions (routing, state, workflows) live in `AGENTS.md`.

> **Core rule.** Never introduce a colour, spacing value, component or pattern that is not
> defined here without flagging it first. Never invent a component name. If it is not in the
> registry, say so and ask before building. Everything in the registry is previewed live in
> the app under **Components** and **Foundations**.

## Tokens

Single source of truth: `tokens/tokens.json` (DTCG). `npm run tokens:build` regenerates
`global.css` (CSS variables), `lib/theme.ts` (TS mirror), `tokens/generated/tailwind.theme.js`, the
web theme `tokens/generated/web.css` (Tailwind 4 / shadcn, oklch) and `DESIGN.md`.
Never edit the generated files. To re-brand a project, change `tokens.json` and rebuild.

**The build enforces contrast.** Every `X` / `X-foreground` pairing, and muted text on every
surface it sits on, must clear WCAG AA (4.5:1) in both themes or `tokens:build` fails and names
the ratio. A brightened accent needs dark text on it, not white — that is why the dark
`*-foreground` tokens are `neutral.950` while the light ones are `neutral.0`.

### Colour — semantic names only

Use the shadcn vocabulary through Tailwind classes. Each name works as `bg-`, `text-`, `border-`.

| Name | Use |
|---|---|
| `background` / `foreground` | page canvas / default text |
| `card` / `card-foreground` | raised surfaces |
| `popover` / `popover-foreground` | menus, sheets |
| `primary` / `primary-foreground` | the brand action colour and text on it |
| `secondary` / `secondary-foreground` | quieter fills |
| `muted` / `muted-foreground` | subtle fills, helper text, placeholders |
| `accent` / `accent-foreground` | hover/pressed fills |
| `destructive` / `-foreground` | delete, errors |
| `success`, `warning`, `info` (+ `-foreground`) | status |
| `border`, `input`, `ring` | hairlines, field borders, focus |
| `chart-1` … `chart-5` | data series |

Sizing: controls are 48px tall (`h-12`): inputs, selects, default buttons; `sm` buttons 40, `lg` 56. Switch 51×31, radio and checkbox 24.

Rules:
- **Never a hex literal or `rgb()` in `app/`, `components/` or `prototype/`.** The only escape hatch is
  `THEME[scheme].<name>` from `lib/theme.ts` for SVG fills and native props (charts, StatusBar).
- No Tailwind palette colours (`bg-blue-500`, `text-gray-400`). They don't follow the theme or the brand.
- Tint a surface with an alpha of a semantic colour: `bg-primary/15`, `bg-success/15`. Text on a tint stays
  `text-foreground`: a status colour as small text on its own tint measures under 4.5:1 (success on
  `success/15` 4.09, destructive 3.82). The status colour goes on the icon or a dot.
- Selected / active states in chips and segments are **neutral** (inverted foreground), not the brand colour.
  The brand colour is for the primary action and focus.
- Light and dark are both required. Every component is checked in both in the Kitchen Sink.

### Spacing — the 4-pt grid

Tailwind's numeric scale, restricted to: `0 1 2 3 4 5 6 8 10 12 16` (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px).
Screen edge padding `px-5`. Gap between sections `gap-5`. Card inner padding `p-4`. List rows `py-3`.
Use `gap-*` for siblings, not margins. Vary spacing to create hierarchy.

### Radius

Buttons are pills (`rounded-full`); everything else uses the scale below. Raised elements that
sit on a track — the SegmentedControl thumb, the Switch thumb, the Slider handle — use `bg-card`,
not `bg-background`, so they stay white if the page surface is ever tinted.

<!-- GENERATED:tokens:radius -->
`rounded-sm` 6 · `rounded-md` 8 (inputs, buttons) · `rounded-lg` 10 (cards, sheets base) · `rounded-xl` 16 · `rounded-2xl` 20 (sheet tops, hero surfaces) · `rounded-full` (chips, avatars, dots).
<!-- /GENERATED:tokens:radius -->

### Typography

System font. Use `<Text variant>` from `components/ui/text`: `h1 h2 h3 h4 lead p large small muted code blockquote`.
Never import `Text` from `react-native` in screens. Sizes if a variant does not fit: `text-xs sm base lg xl 2xl 3xl 4xl`.
Weights: `font-medium` for row titles, `font-semibold` for headings/values, `font-bold` for hero amounts only.

### Motion

`TOKENS.duration.fast` 150 (micro-feedback), `base` 200 (most transitions), `slow` 300 (sheets, large surfaces).
Easings: `standard` for enters/moves, `emphasized` for hero moments, `exit` for leaving.
Haptics via `haptic()` from `lib/haptics`: `selection` on toggles/steps, `light` on backspace, `success` on commit.

### Icons

Lucide only, through `<Icon as={SomeIcon} />` from `components/ui/icon`. Colour with `text-*` classes.
Default size 14 inline; 16 in fields; 20 in rows/menus; 24 in headers.

## Component registry

Two folders, one rule: **use what's here, extend before duplicating, register anything new.**

- `components/ui/*` — react-native-reusables (shadcn for RN). Owned source; edit if needed.
- `components/kit/*` — ours. Composed from `ui` primitives, className-only styling.

The tables are generated from `registry/components.ts` by `npm run registry:build`: edit that file, not the
tables. Text between `GENERATED` markers is overwritten.

### Actions
<!-- GENERATED:registry:actions -->
| Component | Path | Notes |
|---|---|---|
| Button | `components/ui/button.tsx` | `variant` default/secondary/outline/ghost/link/destructive · `size` sm/default/lg/icon · children are `<Text>`/`<Icon>` |
| Toggle | `components/ui/toggle.tsx` | pressed two-state button |
| ToggleGroup | `components/ui/toggle-group.tsx` | `type` single/multiple |
| FloatingButton | `components/kit/floating-button.tsx` | floats OVER the scroll (a Button flows with it) · Material calls it a FAB · `icon label? variant position` · one per screen |
| IconBadge | `components/kit/icon-badge.tsx` | icon button with unread count/dot · always labelled |
| SwipeToConfirm | `components/kit/swipe-to-confirm.tsx` | drag past 85% commits · `tone` primary/destructive · reset via `key` |
| ActionGrid | `components/kit/action-grid.tsx` | the row of shortcuts under a screen hero · 3–4 `items`, one row only, last tile is "More" |
<!-- /GENERATED:registry:actions -->

### Inputs & selection
<!-- GENERATED:registry:inputs -->
| Component | Path | Notes |
|---|---|---|
| Input | `components/ui/input.tsx` | always with `Label` |
| Label | `components/ui/label.tsx` | `htmlFor` · own `onPress` on native |
| Textarea | `components/ui/textarea.tsx` | |
| Checkbox | `components/ui/checkbox.tsx` | `checked onCheckedChange` |
| RadioGroup | `components/ui/radio-group.tsx` | `RadioGroupItem value id` · a `Label htmlFor` the same id names it |
| Switch | `components/ui/switch.tsx` | settings on/off |
| Select | `components/ui/select.tsx` | pass safe-area `insets` to `SelectContent` |
| FilterChip / FilterChipRow | `components/kit/filter-chip.tsx` | neutral-active chips |
| SegmentedControl | `components/kit/segmented-control.tsx` | 2–4 options, animated thumb |
| SearchField | `components/kit/search-field.tsx` | Input + search icon + clear |
| QuantityStepper | `components/kit/quantity-stepper.tsx` | `min max step` |
| AmountInput | `components/kit/amount-input.tsx` | hero money field · `editable={false}` with keypad |
| NumericKeypad | `components/kit/numeric-keypad.tsx` | 3×4 in-app keypad, keys on `bg-muted` |
| OtpInput | `components/kit/otp-input.tsx` | N-digit code, paste-aware |
| PasswordInput | `components/kit/password-input.tsx` | Input + show/hide |
| SelectableCard | `components/kit/selectable-card.tsx` | card as a radio/checkbox choice |
| Slider | `components/kit/slider.tsx` | continuous/stepped · `tone` · `accessibilityLabel` names it |
| DatePicker | `components/kit/date-picker.tsx` | field trigger → Calendar in a Sheet |
| Calendar | `components/kit/calendar.tsx` | month grid |
| RangeSelector | `components/kit/range-selector.tsx` | trackless chart range (1D·1W·1M·1Y·ALL), active is a filled disc |
<!-- /GENERATED:registry:inputs -->

### Navigation
<!-- GENERATED:registry:navigation -->
| Component | Path | Notes |
|---|---|---|
| Tabs | `components/ui/tabs.tsx` | in-page content switching |
| Menubar | `components/ui/menubar.tsx` | web/desktop pattern |
| TabBar / TabBarItem / `tabIcon` | `components/kit/tab-bar.tsx` | custom bottom tab bar: opaque tints, label, active dot under the label |
| KitChip | `components/kit/kit-chip.tsx` | scaffolding, not a product component: the way back to the kit from a sample. Not in the Kitchen Sink; delete it with the kit shell |
| Stepper | `components/kit/stepper.tsx` | `numbered` / `compact` flow progress |
| SectionHeader | `components/kit/section-header.tsx` | title + action, outside the card |
| ScreenHeader | `components/kit/screen-header.tsx` | the in-body page title + intro · one per screen, first child of the ScrollView |
| PagerDots | `components/kit/pager-dots.tsx` | |
| HorizontalPager | `components/kit/horizontal-pager.tsx` | snap pager + dots |
<!-- /GENERATED:registry:navigation -->

App tabs and stacks are Expo Router: `app/(kit)/_layout.tsx` shows the pattern; prototypes own their `app/` routes.

### Data display
<!-- GENERATED:registry:data -->
| Component | Path | Notes |
|---|---|---|
| Text | `components/ui/text.tsx` | the only Text · the scale is previewed in **Foundations › Typography**, not Components |
| Avatar | `components/ui/avatar.tsx` | image + fallback initials |
| AvatarGroup | `components/kit/avatar-group.tsx` | overlapping avatars + "+N" |
| Badge | `components/ui/badge.tsx` | tag/pill/count · tint with semantic classes |
| Separator | `components/ui/separator.tsx` | |
| ListRow | `components/kit/list-row.tsx` | ONE row · the canonical row · `last` on the final row · `select={{mode,selected}}` makes it a radio/checkbox row |
| ListGroup | `components/kit/list-group.tsx` | the CONTAINER around rows: owns the title, dividers, footnote and card/plain surface · wraps ListRows and sets `last` for you · `variant` card/plain (plain = settings look) |
| IconCircle | `components/kit/icon-circle.tsx` | leading icon well, row scale (≤44px) · `shape` circle/square · `tone` |
| KeyValueList / SummaryCard | `components/kit/key-value-list.tsx` | label/value rows, optionally in a Card |
| StatTile | `components/kit/stat-tile.tsx` | KPI tile with delta |
| PercentChange | `components/kit/percent-change.tsx` | signed % with trend icon |
| ProgressRing | `components/kit/progress-ring.tsx` | circular determinate progress |
| StatusDot | `components/kit/status-dot.tsx` | |
| LineChart | `components/kit/line-chart.tsx` | interactive/sparkline · `area` · `onPointerChange` |
| BarChart | `components/kit/bar-chart.tsx` | plain Views |
| DonutChart / ChartLegend | `components/kit/donut-chart.tsx` | ring + legend |
| ValueHeader | `components/kit/value-header.tsx` | hero figure + caption · `maskable` adds the eye toggle |
<!-- /GENERATED:registry:data -->

### Feedback & status
<!-- GENERATED:registry:feedback -->
| Component | Path | Notes |
|---|---|---|
| Alert | `components/ui/alert.tsx` | inline, persistent · `variant` default/info/success/warning/destructive · `icon` · `onDismiss`/`action` make it a nudge |
| Progress | `components/ui/progress.tsx` | 0–100 |
| Skeleton | `components/ui/skeleton.tsx` | |
| Tooltip | `components/ui/tooltip.tsx` | |
| `useToast` / ToastProvider | `components/kit/toast.tsx` | transient · `ToastProvider` is in the root layout |
| Spinner | `components/kit/spinner.tsx` | themed ActivityIndicator · announced as "Loading" |
| EmptyState | `components/kit/empty-state.tsx` | `default` / `compact` |
| SuccessScreen | `components/kit/success-screen.tsx` | the one success template |
<!-- /GENERATED:registry:feedback -->

### Containers & layout
<!-- GENERATED:registry:layout -->
| Component | Path | Notes |
|---|---|---|
| Card | `components/ui/card.tsx` | never nest cards; titles sit outside · **flat — a shadow means pressable or floating** |
| Accordion | `components/ui/accordion.tsx` | |
| Collapsible | `components/ui/collapsible.tsx` | |
| StickyBottomBar | `components/kit/sticky-bottom-bar.tsx` | safe-area action bar under a ScrollView (`pb-32`) |
| PromoCard | `components/kit/promo-card.tsx` | tinted offer/nudge card · circular arrow CTA, dismiss X, generated art · one per screen |
| Footnote | `components/kit/footnote.tsx` | small print / disclosure, last in the scroll |
<!-- /GENERATED:registry:layout -->

### Overlays
<!-- GENERATED:registry:overlays -->
| Component | Path | Notes |
|---|---|---|
| Dialog | `components/ui/dialog.tsx` | edits with a form |
| AlertDialog | `components/ui/alert-dialog.tsx` | confirmations |
| Popover | `components/ui/popover.tsx` | |
| DropdownMenu | `components/ui/dropdown-menu.tsx` | pass `insets` |
| ContextMenu | `components/ui/context-menu.tsx` | long-press |
| HoverCard | `components/ui/hover-card.tsx` | |
| Sheet | `components/kit/sheet.tsx` | bottom sheet shell |
| OptionSheet | `components/kit/sheet.tsx` | pick one of N |
| ActionSheet | `components/kit/sheet.tsx` | list of actions + Cancel |
<!-- /GENERATED:registry:overlays -->

### Media & icons
<!-- GENERATED:registry:media -->
| Component | Path | Notes |
|---|---|---|
| Icon | `components/ui/icon.tsx` | lucide wrapper |
| ImageTile | `components/kit/image-tile.tsx` | rounded image · `seed` draws generated art when there is no `source` |
| AspectRatio | `components/ui/aspect-ratio.tsx` | |
| Placeholder | `components/kit/placeholder.tsx` | deterministic abstract SVG art from a `seed` · the kit ships no raster imagery |
| Spot | `components/kit/spot.tsx` | an icon at illustration scale (≥64px) · EmptyState, SuccessScreen and PermissionPrimer all use it |
<!-- /GENERATED:registry:media -->

### Device capabilities

Everything here resolves through `lib/native.ts` + `useCapability()`: when the real thing cannot
run — the web preview, a simulator, Expo Go, a denied permission — the component draws a simulated
version instead of an error. `simulate` forces the fallback; the kit-wide switch is in Settings.

<!-- GENERATED:registry:native -->
| Component | Path | Notes |
|---|---|---|
| PhotoCapture | `components/kit/photo-capture.tsx` | camera + library · falls back to a seeded `Placeholder` |
| CodeScanner | `components/kit/code-scanner.tsx` | QR/barcode viewfinder · simulated emits a sample payload |
| BiometricGate / `useBiometricAuth` | `components/kit/biometric-gate.tsx` | Face ID gate, or the hook for a single action · real only in a dev build |
| PermissionPrimer | `components/kit/permission-primer.tsx` | shown BEFORE the OS dialog · the skip is not optional |
| `useShare` | `components/kit/share.ts` | OS share sheet · copies to the clipboard on web |
| `useNotify` / NotifyProvider | `components/kit/notify.tsx` | in-app banner now (`delay: 0`), real OS notification when scheduled |
<!-- /GENERATED:registry:native -->

Reality check: photos, camera, scanning and local notifications work in Expo Go on a phone.
The iOS Simulator has no camera. Face ID does **not** work in Expo Go — use the dev client.
Remote push is gone from Expo Go since SDK 53.

## Patterns

- **Screen skeleton:** `ScrollView className="bg-background flex-1" contentContainerClassName="gap-5 p-5 pb-32"` → sections
  (`SectionHeader` + `Card` of `ListRow`s) → `StickyBottomBar` after the ScrollView when there is a primary action.
- **Multi-step flow:** one route, `useState<Step>` inside, one header, one `Stepper`, one `StickyBottomBar`.
  Not one route per step.
- **Pickers:** `OptionSheet` on phones; `Select` when the list is short and the field sits in a form.
- **Confirmations:** `AlertDialog` for reversible, `SwipeToConfirm` for money or deletion.
- **Success:** `SuccessScreen` + `StickyBottomBar` with "Done". Always.
- **Loading:** `Skeleton` for content shapes, `Spinner` inside buttons (`tone="primary-foreground"` on a filled one), `Progress` when determinate.
- **Motion:** anything that slides, springs or moves calls `useMotion()` / `useReducedMotion()`
  from `lib/reduced-motion.ts` and collapses to 0ms when the OS asks. `components/ui` gets this
  from reanimated's `ReduceMotion.System`; the kit's `Animated` code has no equivalent, so it is
  not optional — a new animated component without it is a bug.
- **Shadow:** only on something you can **press**, or something **floating above the page**
  (dialogs, sheets, menus, toasts, the FloatingButton). Content is flat — that includes inputs,
  which are neither.
- **Permission:** `PermissionPrimer` before the OS dialog, always with a skip that runs the simulated
  path. Never show a raw denied state. Keep its copy in step with the strings in `app.json`.
- **Imagery:** the kit ships no raster art. `Placeholder` (seeded, themed) fills image slots;
  `Spot` is the illustration for empty, success and permission screens.

## Anti-patterns

- ✗ Cards inside cards. ✗ Section titles inside the card. ✗ Everything centred.
- ✗ Radio and checkbox choices in one group — split them; one picks one, the other picks any.
- ✗ Identical card grids (same icon + heading + body repeated).
- ✗ Same padding on every element; vary it to create rhythm.
- ✗ Modals as the default home for secondary content.
- ✗ Brand colour on selected chips/tabs. ✗ Grey-on-grey text below 4.5:1 contrast.
- ✗ Tap targets under 44×44. ✗ Icon-only buttons without `accessibilityLabel`.
- ✗ A control without a name: a Switch, RadioGroupItem or Checkbox needs a `Label htmlFor` its `id`, or an
  `aria-label` (a Switch at the end of a ListRow). ✗ `accessibilityState`/`accessibilityValue` in new
  components: the web export drops them; use the `aria-*` props (`aria-checked`, `aria-selected`,
  `aria-valuenow`), which native reads too. A selected `button` (chip, segment, day) keeps
  `accessibilityState={{ selected }}` for native and adds `aria-pressed` for web.

## Hallucination guard

Before writing JSX, list the components you intend to use. Every name must appear in the registry
above **exactly**. If you need something else: stop, describe the gap in one line, and use the
`add-component` skill. Do not import from `react-native-paper`, `@expo/vector-icons`, `gluestack`
or any UI library that is not in `package.json`.
