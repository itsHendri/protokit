---
name: add-component
description: Add a component to the prototype kit the right way — either install a react-native-reusables component or build/port one into components/kit — and register it in the Kitchen Sink and DESIGN_SYSTEM.md in the same change. Use when asked to "add a component", "we need a <thing>", "port <Component> from the old kit", or when a screen needs something the registry lacks.
---

# Add a component

The kit's rule: **nothing exists until it is in the Kitchen Sink registry and DESIGN_SYSTEM.md.**
A component that is only a file is invisible to designers and to the transcript-to-prototype
skill, which builds from the registry alone.

## 0. Check it does not already exist

Search `components/devkit/sections/*.tsx` titles and aliases, and DESIGN_SYSTEM.md. Extend
an existing component (a new variant/prop) before creating a sibling. Only extract a new
component when the pattern appears 3+ times with the same intent.

## 1. Get the source

Pick one:

- **react-native-reusables has it** (check https://reactnativereusables.com/docs/components):
  `npx @react-native-reusables/cli@latest add <name> -y` → lands in `components/ui/<name>.tsx`.
  If it adds packages, run `npx expo install --fix` afterwards.
- **Port from the old kit** (read-only reference: https://github.com/itsHendri/swissborg-prototype-kit,
  `src/components/shared/{atoms,molecules,organisms}`): create `components/kit/<name>.tsx`.
  Rewrite, don't copy: className-only styling with semantic classes, `cva` for variants,
  compose from `components/ui` primitives where possible, forward `className`, use the kit
  `Text`/`Icon`. No `useThemeColors`, no inline colour objects, no `@expo/vector-icons`.
- **New**: same rules as a port.

Styling rules (enforced by `qc-pass`):
- Colours only via semantic classes (`bg-card`, `text-muted-foreground`, `border-border`, `bg-success`…).
  Hex is allowed only through `THEME[scheme].*` from `lib/theme.ts` for SVG/native props.
- Spacing on the 4-pt grid (`p-1` … `p-16`), radius `rounded-sm|md|lg|xl|2xl|full`.
- Children of Button/Badge are `<Text>`/`<Icon>`, never bare strings.
- Every interactive element ≥ 44×44 tap target and has an accessible label.

## 2. Register it

1. Add a section to the matching file in `components/devkit/sections/` (`actions`, `inputs`,
   `navigation`, `data`, `feedback`, `layout`, `overlays`, `media`) with `id`, `title`,
   `category`, `aliases` (how a designer would search for it), a one-line `api`, a `caption`
   (when to use it / the one rule people get wrong), and a self-contained `Demo` showing every
   variant and state. Keep the demo's own state inside `Demo`.
2. Add a row to the Component Registry table in `DESIGN_SYSTEM.md` (name, path, one-line notes).

## 3. Verify

Run the `qc-pass` skill (typecheck, lint, guards, and a look at the new section on the iOS
simulator in both themes). Fix anything it flags before calling the component done.

## 4. Commit

One commit per component: `feat(kit): add <Name>` with the demo, registry row and any deps.
