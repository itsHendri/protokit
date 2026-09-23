# mobile-app-prototype-kit — agent guide

A brand-agnostic Expo starter for mobile prototypes. Designers hand it a brief (or a meeting
transcript) and get a working, themed prototype built only from the components in this repo.

**Read `DESIGN_SYSTEM.md` before writing any UI.** It has the token rules, the component registry
and the hallucination guard. This file covers engineering, workflows and gotchas.

## Stack

- Expo SDK 57 · Expo Router (file routes in `app/`) · React Native 0.86 · React 19 · TypeScript strict
- NativeWind 4 + Tailwind 3 — **className-only styling**. No `StyleSheet.create` for colours, no inline hex.
- react-native-reusables in `components/ui` (shadcn for RN, owned source) · our components in `components/kit`
- Tokens: `tokens/tokens.json` → `npm run tokens:build` → `global.css`, `lib/theme.ts`, `tokens/generated/`
- Theme: `KitThemeProvider` (`lib/theme-context.tsx`) — system/light/dark, persisted. `useKitTheme()` gives `scheme`.
- Icons: lucide via `<Icon as={…} />`. Haptics via `haptic()` in `lib/haptics.ts`. Toasts via `useToast()`.

## Layout of the repo

```
app/_layout.tsx         providers (theme, toast, portal, nav theme) + root Stack
app/(kit)/              the kit shell: Home · Components (kitchen sink) · Foundations · Settings
app/shop/, app/habits/    two sample apps (named segments, not groups). DELETE on a real project.
components/ui/          reusables — install more with the add-component skill
components/kit/         ported/custom components
components/devkit/      registry + previews (sections/<category>.tsx, sections/kit-<category>.tsx)
components/shop/, components/habits/  sample data + stores. DELETE with the samples.
lib/                    theme.ts (generated), theme-context, haptics, utils(cn)
tokens/                 tokens.json (edit), build.mjs, generated/
.claude/skills/         add-component, qc-pass, transcript-to-prototype
.claude/launch.json     preview configs (also mirrored in the parent Development/.claude/launch.json as kit-web / kit-ios)
```

## Commands

```bash
npm run dev            # expo start -c --go (Expo Go: scan the QR with the phone camera)
npm run dev:client     # expo start -c (development build)
npm run ios            # expo start --ios --go (simulator)
npm run web            # expo start --web
npm run typecheck && npm run lint -- --max-warnings 0
npm run tokens:build   # after editing tokens/tokens.json
npm run share -- "msg" # EAS Update to the main channel, prints the links
npm run export:web && eas deploy   # hosted web preview URL
npx expo run:ios       # build + install the dev client on the simulator (needs LANG=en_US.UTF-8, see gotchas)
```

## Building a prototype (the rules)

1. A prototype lives in `app/` under its own **named** segment, e.g. `app/acme/…`, with its own Tabs/Stack.
   Not a route group: `app/(acme)/(tabs)/index.tsx` resolves to `/` and fights `app/(kit)/index.tsx`
   for the root, so scanning the QR drops you into the prototype instead of the kit. A named segment
   gives it `/acme` and leaves `/` to the kit. When the prototype IS the product, point the root
   `Stack` at it and make it the initial route.
2. Screens compose ONLY registry components. Screen skeleton, multi-step flow and success patterns
   are in `DESIGN_SYSTEM.md › Patterns`. The sample apps (`app/shop`, `app/habits`) are the worked examples; `KitChip` in their root layouts is the way back to the kit.
3. Mock data lives beside the prototype (`components/<slug>/data.ts`). Never call real APIs.
4. New component needed? Use the `add-component` skill — it must land in the registry and the docs.
5. Before saying "done": run the `qc-pass` skill (typecheck, lint, guards, simulator look in both themes).

## Workflows

- **Preview:** `kit-web` (http://localhost:8090) and `kit-ios` (Expo Go on the booted simulator, port 8091)
  launch configs. Deep link a section: `xcrun simctl openurl booted "exp://localhost:8091/--/kitchen-sink?open=inputs"`
  (Expo Go) or `protokit://kitchen-sink?open=inputs` (dev client).
- **Dev client:** `LANG=en_US.UTF-8 npx expo run:ios --no-bundler` builds `Prototype Kit` for the simulator; then
  `xcrun simctl openurl booted "exp+mobile-app-prototype-kit://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8091"`.
  For phones: `eas build --profile development` (needs Apple credentials, interactive).
- **Share:** `npm run share -- "what changed"` publishes to the `main` channel. Recipients need the dev build
  installed, or Expo Go signed into the `h3nners-prototypes` org (Expo Go on iOS requires login since SDK 57).
- **Web link for clients:** `npm run export:web && eas deploy` → immutable preview URL. `web.output` is `single`
  so deep links resolve.
- **Re-brand:** edit `tokens/tokens.json` (colours, radius), rebuild; set `name`/`slug`/`scheme`/bundle ids in
  `app.json`; add a brand font with the `expo-font` config plugin; replace `assets/images/*`.

## Agent tooling

- **Expo skills + MCP for Claude Code:** `claude plugin install expo@claude-plugins-official` (run once, interactive).
  Remote MCP alternative: `claude mcp add --transport http expo https://mcp.expo.dev/mcp`.
- **Local screenshots/taps from the dev server:** `expo-mcp` is a dev dependency. Start with
  `EXPO_UNSTABLE_MCP_SERVER=1 npx expo start` and connect the MCP client to the printed URL.
- **Simulator driving without Expo:** the iOS Simulator tools in Claude Code (screenshot, tap, inspect) are
  enough for `qc-pass`; `xcrun simctl openurl booted <deep link>` jumps to a screen.
- Optional, experimental: `npx @expo/agent-cli@latest agents:setup` (status / dev / smoke commands).

## Gotchas (learned the hard way)

- CocoaPods needs a UTF-8 locale: prefix `npx expo run:ios` with `LANG=en_US.UTF-8` in non-interactive shells.
- `eas update` needs `--environment production` and either `--channel` or `--branch`, not both.
- NativeWind colour classes DO follow the theme here because colours are CSS variables; the ban on `bg-*`
  classes in older projects came from hex values in `tailwind.config.js`. Never put hex there.
- On native, a `Label` needs its own `onPress` to toggle the Checkbox/Switch it labels.
- Menus/selects/sheets need safe-area `insets` passed to their content on native.
- ESLint runs the React Compiler rules: no `ref.current` reads in render, no `useRef(new Animated.Value())`
  (use `useState(() => new Animated.Value())`), no setState synchronously in effects.
- Expo Go on the simulator does not run the native modules a dev build adds; treat it as the fast path,
  the dev client as the truth.
- When upgrading the SDK: delete `package-lock.json`, `npm install expo@latest`, `npx expo install --fix`,
  then `npx expo-doctor`.
- Device capabilities degrade rather than fail — see `lib/native.ts`. Reality: the iOS Simulator has no
  camera; **Face ID does not work in Expo Go** (its Info.plist has no `NSFaceIDUsageDescription`), so use
  the dev client; remote push left Expo Go in SDK 53; the web notification scheduler is a stub.
- `expo-notifications` warns and registers a push-token side effect on *import* under Expo Go — it is
  lazily `require`d inside `lib/native.ts` and `components/kit/notify.tsx`. Keep it that way.
- `ios/` is a build artifact (gitignored). After changing `app.json` plugins or permission strings, run
  `LANG=en_US.UTF-8 npx expo prebuild -p ios --clean` — the diff will not show Info.plist.
- NativeWind classNames are **dropped on `Animated.View` on web**. Put the surface (`bg-*`, radius) on a
  plain `View` inside it, as `sheet.tsx` and `toast.tsx` do, or the panel renders transparent in the
  web preview. `sheet.tsx`, `segmented-control.tsx`, `swipe-to-confirm.tsx` and `notify.tsx` all
  follow this shape — copy it for any new animated surface.
