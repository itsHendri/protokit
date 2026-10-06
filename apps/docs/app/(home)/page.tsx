import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { CopyPrompt } from '@/components/copy-prompt';
import { PhoneFrame } from '@/components/phone-frame';
import { categories, colorNames, components, componentsIn, kit, previewed } from '@/lib/kit';

const STEPS = [
  {
    title: 'Give an agent a brief',
    body: 'A meeting transcript, a few notes or a feature list. The transcript-to-prototype skill turns it into a short brief and a screen list before any code.',
  },
  {
    title: 'It builds from the registry only',
    body: `${components.length} registered components, each with an API, usage notes and a live demo. If something is missing, the agent says so instead of inventing it.`,
  },
  {
    title: 'You get a themed prototype',
    body: 'Light and dark, on your brand, on a phone in minutes. Every screen uses the same tokens, spacing and patterns, so it looks designed, not generated.',
  },
];

const GUARDRAILS = [
  ['One token file', `tokens.json (W3C format) builds the CSS variables, TypeScript theme, Figma variables and DESIGN.md. ${colorNames.length} semantic colours, no hex in screens.`],
  ['Contrast that cannot regress', 'The token build refuses any palette where text on its surface, or a status colour used as text, falls below WCAG AA, in either theme.'],
  ['A registry agents can read', 'DESIGN_SYSTEM.md, llms.txt and a shadcn registry are generated from one list, so the docs, the agent and the code never disagree.'],
  ['A quality gate', 'The qc-pass skill runs typecheck, lint, the token and registry checks, then looks at the screens on a simulator in both themes.'],
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-4 py-12 sm:px-6 md:py-20">
      {/* Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col gap-6">
          <p className="text-primary text-sm font-semibold">{kit.name} · open source, MIT</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Hand an agent a brief. Get a prototype that looks designed.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-8">
            {kit.name} is a set of prototype kits that coding agents build from. A themed component registry, design
            tokens with a contrast gate, and rules that keep every screen inside what the kit ships. Mobile today, web next.
          </p>
          <CopyPrompt className="max-w-2xl" />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/components"
              className="border-border hover:bg-accent focus-visible:ring-ring inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2">
              Browse {components.length} components <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
            <Link
              href="/docs"
              className="hover:bg-accent focus-visible:ring-ring inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2">
              How it works
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <PhoneFrame path="/shop" title="Shop sample app, live" width={290} />
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how" className="flex flex-col gap-8">
        <h2 id="how" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Brief in, prototype out
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full text-sm font-semibold">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-7">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Screens */}
      <section aria-labelledby="screens" className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 id="screens" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Two sample apps, built only from the kit
            </h2>
            <p className="text-muted-foreground leading-7">
              A shop with cart, checkout and order tracking, and a habit tracker with streaks and insights. They are
              the worked examples an agent copies the structure of. Both live, both follow this page&apos;s theme.
            </p>
          </div>
          <Link href="/screens" className="text-primary inline-flex items-center gap-1 text-sm font-medium">
            All screens <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <PhoneFrame path="/habits" title="Habit tracker sample app, live" width={260} />
          <PhoneFrame path="/kitchen-sink?open=data" title="Kitchen Sink, data display, live" width={260} />
        </div>
      </section>

      {/* Catalogue */}
      <section aria-labelledby="catalogue" className="flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 id="catalogue" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything a screen needs, and nothing else
          </h2>
          <p className="text-muted-foreground leading-7">
            {previewed.length} live previews across {categories.length} categories, from buttons and list rows to charts,
            sheets, a camera and Face ID that fall back to simulated versions where the real thing cannot run.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/components#cat-${cat.id}`}
                className="border-border bg-card hover:bg-accent focus-visible:ring-ring flex h-full items-start justify-between gap-4 rounded-xl border p-4 focus-visible:outline-none focus-visible:ring-2">
                <span>
                  <span className="block font-medium">{cat.label}</span>
                  <span className="text-muted-foreground block text-sm">{cat.blurb}</span>
                </span>
                <span className="bg-muted rounded-full px-2.5 py-0.5 text-sm tabular-nums">{componentsIn(cat.id).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Guardrails */}
      <section aria-labelledby="guardrails" className="flex flex-col gap-8">
        <h2 id="guardrails" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Guardrails, not guidelines
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {GUARDRAILS.map(([title, body]) => (
            <li key={title} className="flex gap-3">
              <CheckIcon className="text-success mt-1 size-5 shrink-0" aria-hidden />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-1 leading-7">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Platforms */}
      <section aria-labelledby="platforms" className="grid gap-6 md:grid-cols-2">
        <h2 id="platforms" className="sr-only">
          Platforms
        </h2>
        <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-6">
          <p className="text-success text-sm font-semibold">Available</p>
          <h3 className="text-xl font-semibold">Mobile kit</h3>
          <p className="text-muted-foreground leading-7">
            Expo, React Native and NativeWind on react-native-reusables. Runs on a phone through Expo Go or a development
            build, and in the browser.
          </p>
          <Link href="/docs/mobile" className="text-primary mt-auto inline-flex items-center gap-1 text-sm font-medium">
            Mobile setup <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="border-border flex flex-col gap-3 rounded-2xl border border-dashed p-6">
          <p className="text-muted-foreground text-sm font-semibold">Coming next</p>
          <h3 className="text-xl font-semibold">Web kit</h3>
          <p className="text-muted-foreground leading-7">
            Next.js and shadcn/ui on the same tokens: dashboards, marketing pages, AI product screens and the web version
            of a mobile prototype, from one brand file.
          </p>
          <Link href="/docs/web" className="text-primary mt-auto inline-flex items-center gap-1 text-sm font-medium">
            What&apos;s planned <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* For agents */}
      <section aria-labelledby="agents" className="border-border flex flex-col gap-4 rounded-2xl border p-6 sm:p-8">
        <h2 id="agents" className="text-2xl font-semibold tracking-tight">
          Built to be read by agents
        </h2>
        <p className="text-muted-foreground max-w-3xl leading-7">
          Everything on this site is also available as plain text: the install guide an agent follows, an index of every
          component with its API, and a shadcn registry so an existing Expo app can pull in single components.
        </p>
        <ul className="flex flex-wrap gap-3 text-sm">
          {[
            ['/install.md', 'install.md'],
            ['/llms.txt', 'llms.txt'],
            ['/llms-full.txt', 'llms-full.txt'],
            ['/r/native/registry.json', 'registry.json'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="bg-muted hover:bg-accent rounded-full px-3 py-1.5 font-mono">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="text-muted-foreground border-border flex flex-wrap justify-between gap-4 border-t pt-8 text-sm">
        <p>
          {kit.name} is MIT licensed. <a href={kit.repo} className="underline underline-offset-4">Source on GitHub</a>.
        </p>
        <p>
          Questions, ideas or a project in mind?{' '}
          <a href={`${kit.repo}/issues`} className="underline underline-offset-4">
            Open an issue
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
