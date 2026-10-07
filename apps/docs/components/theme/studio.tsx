'use client';
import {
  FONTS,
  googleFontsHref,
  normalizeRecipe,
  OPTIONS,
  PRESETS,
  sameRecipe,
  type Recipe,
  type RecipeInput,
} from '@itshendri/kit-tokens/theme';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { LockIcon, LockOpenIcon, MoonIcon, Redo2Icon, RotateCcwIcon, ShieldCheckIcon, ShuffleIcon, SunIcon, Undo2Icon } from 'lucide-react';
import { useTheme as useSiteMode } from 'next-themes';
import * as React from 'react';
import { BrowserFrame } from '@/components/browser-frame';
import { PhoneFrame } from '@/components/phone-frame';
import { ExportPanel } from '@/components/theme/export-panel';
import { AdjustmentList, presetLabel, visibleAdjustments } from '@/components/theme/theme-pill';
import { SWATCHES } from '@/lib/theme/swatches';
import { redo, reset, setRecipe, shuffle, themeFor, toggleLock, undo, useLiveTheme, useLocks, type ShuffleGroup } from '@/lib/theme/store';

const PHONE_SCREENS = [
  { path: '/shop', label: 'Shop' },
  { path: '/habits', label: 'Habits' },
  { path: '/kitchen-sink?open=actions', label: 'Buttons' },
  { path: '/kitchen-sink?open=inputs', label: 'Inputs' },
  { path: '/foundations?open=type', label: 'Type' },
];
const WEB_SCREENS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/landing', label: 'Landing' },
  { path: '/assistant', label: 'Assistant' },
];

const LABELS: Record<string, string> = {
  zinc: 'Zinc',
  neutral: 'Neutral',
  slate: 'Slate',
  stone: 'Stone',
  gray: 'Gray',
  brand: 'Tinted',
  none: 'None',
  sm: 'S',
  md: 'M',
  lg: 'L',
  xl: 'XL',
  '2xl': '2XL',
  pill: 'Pill buttons',
  match: 'Follow radius',
  thin: 'Thin',
  regular: 'Regular',
  bold: 'Bold',
  flat: 'Flat',
  soft: 'Soft',
  raised: 'Raised',
  hard: 'Hard',
  compact: 'Compact',
  comfortable: 'Comfortable',
  spacious: 'Spacious',
  hairline: 'Hairline',
  heavy: 'Heavy',
};
/** Order for the segmented controls (the codec's option order is append-only, not display order). */
const ORDER: { [K in keyof typeof OPTIONS]: (typeof OPTIONS)[K] } = {
  neutral: ['zinc', 'neutral', 'slate', 'stone', 'gray', 'brand'],
  radius: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
  controls: ['pill', 'match'],
  stroke: ['thin', 'regular', 'bold'],
  depth: ['flat', 'soft', 'raised', 'hard'],
  density: ['compact', 'comfortable', 'spacious'],
  border: ['hairline', 'regular', 'heavy'],
};

/** A row of mutually exclusive choices (a radio group). */
function Segmented<T extends string>({ label, value, options, onChange, render }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void; render?: (v: T) => React.ReactNode }) {
  return (
    <div role="radiogroup" aria-label={label} className="bg-muted flex flex-wrap gap-0.5 rounded-lg p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`focus-visible:ring-ring flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
            value === o ? 'bg-background text-foreground ring-border shadow-sm ring-1' : 'text-muted-foreground hover:text-foreground'
          }`}>
          {render ? render(o) : LABELS[o] ?? o}
        </button>
      ))}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Section({ title, lock, children }: { title: string; lock?: ShuffleGroup; children: React.ReactNode }) {
  const locks = useLocks();
  const locked = lock ? locks.has(lock) : false;
  return (
    <section className="border-border flex flex-col gap-4 border-t px-5 py-5 first:border-t-0">
      <div className="flex items-center justify-between">
        <h2 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{title}</h2>
        {lock ? (
          <button
            type="button"
            onClick={() => toggleLock(lock)}
            aria-pressed={locked}
            aria-label={`Keep ${title.toLowerCase()} when shuffling`}
            title={locked ? 'Locked: shuffle keeps these' : 'Lock to keep these when shuffling'}
            className={`focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 ${
              locked ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>
            {locked ? <LockIcon className="size-3.5" aria-hidden /> : <LockOpenIcon className="size-3.5" aria-hidden />}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const fontFamily = (id: string) => (id === 'system' ? 'ui-sans-serif, system-ui, sans-serif' : `"${FONTS.find((f) => f.id === id)?.family}", ui-sans-serif, system-ui`);

/** Every preset's fonts, so the gallery cards render in their own type. */
const PRESET_FONTS = googleFontsHref(PRESETS.flatMap((p) => [p.recipe.font?.heading ?? 'system', p.recipe.font?.body ?? 'system']));
const ALL_FONTS = googleFontsHref(FONTS.map((f) => f.id));

function PresetCard({ id, name, recipe: input, selected }: { id: string; name: string; recipe: RecipeInput; selected: boolean }) {
  const recipe = normalizeRecipe(input);
  const t = themeFor(recipe);
  const radius = Math.min(t.radius, 14);
  return (
    <button
      type="button"
      onClick={() => setRecipe({ ...input, preset: id })}
      aria-pressed={selected}
      className={`focus-visible:ring-ring flex flex-col gap-2 rounded-xl border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 ${
        selected ? 'border-foreground' : 'border-border hover:border-foreground/40'
      }`}>
      <span className="flex h-16 items-end justify-between rounded-lg p-2.5" style={{ background: t.resolved.light.muted }} aria-hidden>
        <span className="text-2xl leading-none" style={{ fontFamily: fontFamily(recipe.font.heading), color: t.resolved.light.foreground, fontWeight: 600 }}>
          Aa
        </span>
        <span
          className="h-5 w-10"
          style={{
            background: t.resolved.light.primary,
            borderRadius: recipe.controls === 'pill' ? 999 : radius,
            boxShadow: recipe.depth === 'hard' ? `2px 2px 0 ${t.resolved.light.foreground}` : undefined,
          }}
        />
      </span>
      <span className="px-0.5 text-xs font-medium">{name}</span>
    </button>
  );
}

export function ThemeStudio() {
  const { recipe, theme, isCommitted, canUndo, canRedo } = useLiveTheme();
  const { resolvedTheme, setTheme } = useSiteMode();
  const [phone, setPhone] = React.useState(PHONE_SCREENS[0].path);
  const [web, setWeb] = React.useState(WEB_SCREENS[0].path);
  const [hex, setHex] = React.useState(recipe.brand);
  React.useEffect(() => setHex(recipe.brand), [recipe.brand]);
  const adjusted = visibleAdjustments(theme.adjustments);
  const set = (input: RecipeInput) => setRecipe(input);

  // Undo / redo from the keyboard (not while typing in a field).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z') return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col lg:flex-row">
      {/* Previews of the font list: the studio is the one page that loads them all. */}
      {ALL_FONTS ? <link rel="stylesheet" href={ALL_FONTS} /> : null}
      {PRESET_FONTS ? <link rel="stylesheet" href={PRESET_FONTS} /> : null}

      <aside aria-label="Theme controls" className="border-border bg-card/40 w-full shrink-0 border-b lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:w-[360px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <Section title="Presets">
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <PresetCard key={p.id} id={p.id} name={p.name} recipe={p.recipe} selected={recipe.preset === p.id && sameRecipe(recipe, p.recipe)} />
            ))}
          </div>
        </Section>

        <Section title="Colour" lock="colour">
          <Field label="Brand" hint={recipe.brand.toUpperCase()}>
            <div className="flex flex-wrap items-center gap-2">
              {SWATCHES.map((s) => (
                <button
                  key={s.hex}
                  type="button"
                  aria-label={s.name}
                  aria-pressed={recipe.brand === s.hex}
                  onClick={() => set({ brand: s.hex })}
                  className="focus-visible:ring-ring size-7 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 motion-reduce:transition-none"
                  style={{ background: s.hex, boxShadow: recipe.brand === s.hex ? `0 0 0 2px var(--background), 0 0 0 4px ${s.hex}` : undefined }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="border-border relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border" style={{ background: recipe.brand }} title="Pick any colour">
                <span className="sr-only">Pick any colour</span>
                <input type="color" value={recipe.brand} onChange={(e) => set({ brand: e.target.value })} className="absolute inset-0 size-full cursor-pointer opacity-0" />
              </label>
              <input
                aria-label="Brand colour, hex"
                value={hex}
                spellCheck={false}
                onChange={(e) => {
                  setHex(e.target.value);
                  const v = e.target.value.trim().replace(/^#?/, '#');
                  if (/^#[0-9a-f]{6}$/i.test(v)) set({ brand: v.toLowerCase() });
                }}
                className="border-border bg-background focus-visible:ring-ring h-9 w-full rounded-lg border px-3 font-mono text-sm uppercase focus-visible:outline-none focus-visible:ring-2"
              />
            </div>
          </Field>
          <Field label="Neutral">
            <Segmented label="Neutral" value={recipe.neutral} options={ORDER.neutral} onChange={(neutral) => set({ neutral })} />
          </Field>
          {adjusted.length ? (
            <Popover>
              <PopoverTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-2 self-start text-xs">
                <ShieldCheckIcon className="size-4" aria-hidden />
                {adjusted.length} adjusted for contrast
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <AdjustmentList adjustments={adjusted} />
              </PopoverContent>
            </Popover>
          ) : (
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <ShieldCheckIcon className="size-4" aria-hidden /> Every pairing passes WCAG AA as picked.
            </p>
          )}
        </Section>

        <Section title="Type" lock="type">
          {(['heading', 'body'] as const).map((role) => (
            <Field key={role} label={role === 'heading' ? 'Headings' : 'Body'}>
              <select
                value={recipe.font[role]}
                onChange={(e) => set({ font: { [role]: e.target.value } as Recipe['font'] })}
                className="border-border bg-background focus-visible:ring-ring h-9 w-full rounded-lg border px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2"
                style={{ fontFamily: fontFamily(recipe.font[role]) }}>
                {(['sans', 'serif', 'display'] as const).map((category) => (
                  <optgroup key={category} label={category === 'sans' ? 'Sans' : category === 'serif' ? 'Serif' : 'Display'}>
                    {FONTS.filter((f) => f.category === category && !f.hidden).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.id === 'system' ? 'System (SF / Roboto)' : f.family}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
          ))}
          <p className="border-border rounded-lg border p-3" aria-hidden>
            <span className="block text-lg font-semibold leading-tight" style={{ fontFamily: fontFamily(recipe.font.heading) }}>
              Weekly check-in
            </span>
            <span className="text-muted-foreground mt-1 block text-sm" style={{ fontFamily: fontFamily(recipe.font.body) }}>
              Three habits done, two to go. Keep the streak.
            </span>
          </p>
        </Section>

        <Section title="Shape" lock="shape">
          <Field label="Corner radius">
            <Segmented
              label="Corner radius"
              value={recipe.radius}
              options={ORDER.radius}
              onChange={(radius) => set({ radius })}
              render={(r) => (
                <>
                  <span
                    aria-hidden
                    className="border-foreground/70 size-3 border-l-2 border-t-2"
                    style={{ borderTopLeftRadius: { none: 0, sm: 3, md: 4, lg: 5, xl: 8, '2xl': 10 }[r] }}
                  />
                  {LABELS[r]}
                </>
              )}
            />
          </Field>
          <Field label="Buttons and chips">
            <Segmented label="Buttons and chips" value={recipe.controls} options={ORDER.controls} onChange={(controls) => set({ controls })} />
          </Field>
          <Field label="Border">
            <Segmented label="Border" value={recipe.border} options={ORDER.border} onChange={(border) => set({ border })} />
          </Field>
        </Section>

        <Section title="Depth, icons, density" lock="depth">
          <Field label="Depth" hint="Cards, menus, dialogs">
            <Segmented label="Depth" value={recipe.depth} options={ORDER.depth} onChange={(depth) => set({ depth })} />
          </Field>
          <Field label="Icon stroke">
            <Segmented label="Icon stroke" value={recipe.stroke} options={ORDER.stroke} onChange={(stroke) => set({ stroke })} />
          </Field>
          <Field label="Density" hint="Control heights">
            <Segmented label="Density" value={recipe.density} options={ORDER.density} onChange={(density) => set({ density })} />
          </Field>
        </Section>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Theme studio</h1>
            <p className="text-muted-foreground text-sm">
              {presetLabel(recipe)} · <span className="font-mono">{theme.code}</span>
              {isCommitted ? ' · the kits’ current theme' : ''}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={shuffle} title="Shuffle everything that isn't locked" className="border-border hover:bg-accent focus-visible:ring-ring mr-1 inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2">
              <ShuffleIcon className="size-4" aria-hidden />
              Shuffle
            </button>
            <button type="button" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (⌘Z)" className="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2">
              <Undo2Icon className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo (⇧⌘Z)" className="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2">
              <Redo2Icon className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={reset} disabled={isCommitted} aria-label="Back to the kit's theme" title="Back to the kit's theme" className="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2">
              <RotateCcwIcon className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} aria-label="Toggle light and dark" className="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2">
              <SunIcon className="hidden size-4 dark:block" aria-hidden />
              <MoonIcon className="size-4 dark:hidden" aria-hidden />
            </button>
            <Popover>
              <PopoverTrigger className="bg-primary text-primary-foreground focus-visible:ring-ring ml-2 inline-flex h-9 items-center rounded-full px-4 text-sm font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                Use theme
              </PopoverTrigger>
              <PopoverContent align="end" className="max-h-[75vh] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto p-4">
                <ExportPanel theme={theme} />
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[auto_1fr]">
          <section aria-label="Mobile kit preview" className="flex flex-col items-center gap-3">
            <Segmented label="Mobile screen" value={phone} options={PHONE_SCREENS.map((s) => s.path)} onChange={setPhone} render={(p) => PHONE_SCREENS.find((s) => s.path === p)?.label} />
            <PhoneFrame key={phone} path={phone} title="Mobile kit, live" width={300} />
          </section>
          <section aria-label="Web kit preview" className="flex min-w-0 flex-col gap-3">
            <div className="self-start">
              <Segmented label="Web page" value={web} options={WEB_SCREENS.map((s) => s.path)} onChange={setWeb} render={(p) => WEB_SCREENS.find((s) => s.path === p)?.label} />
            </div>
            <BrowserFrame key={web} path={web} title="Web kit, live" />
          </section>
        </div>
      </main>
    </div>
  );
}
