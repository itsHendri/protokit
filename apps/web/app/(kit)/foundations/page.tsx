import type { Metadata } from 'next';
import theme from '@/tokens/generated/theme.registry.json';
import { TOKENS } from '@/lib/theme';

export const metadata: Metadata = { title: 'Foundations' };

const colors = Object.keys(theme.web.cssVars.light).filter((k) => k !== 'radius');
const fills = colors.filter((n) => !n.endsWith('-foreground'));
/** Literal class names: Tailwind only generates classes it can read in the source. */
const RADIUS_CLASS: Record<string, string> = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl' };

/** The design tokens, rendered with the live CSS variables so they follow the theme. */
export default function FoundationsPage() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Foundations</h1>
        <p className="text-muted-foreground max-w-2xl">
          From tokens/tokens.json. Use the class names (<code>bg-primary</code>, <code>p-4</code>, <code>rounded-lg</code>), never the values.
        </p>
      </header>

      <section aria-labelledby="colour" className="flex flex-col gap-4">
        <h2 id="colour" className="text-xl font-semibold">
          Colour
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {fills.map((name) => {
            const fg = colors.includes(`${name}-foreground`) ? `${name}-foreground` : null;
            return (
              <li key={name} className="border-border overflow-hidden rounded-xl border">
                <div className="flex h-16 items-end p-2 text-sm font-medium" style={{ background: `var(--${name})`, color: fg ? `var(--${fg})` : undefined }}>
                  {fg ? 'Aa' : null}
                </div>
                <div className="bg-card p-2">
                  <code className="text-xs">bg-{name}</code>
                  {fg ? <p className="text-muted-foreground text-xs">text-{fg}</p> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="radius" className="flex flex-col gap-4">
        <h2 id="radius" className="text-xl font-semibold">
          Radius
        </h2>
        <ul className="flex flex-wrap gap-4">
          {Object.entries(TOKENS.radius)
            .filter(([k]) => k in RADIUS_CLASS)
            .map(([k, v]) => (
              <li key={k} className="flex flex-col items-center gap-2">
                <div className={`bg-muted border-border size-16 border ${RADIUS_CLASS[k]}`} />
                <code className="text-xs">
                  rounded-{k} · {v}
                </code>
              </li>
            ))}
        </ul>
      </section>

      <section aria-labelledby="spacing" className="flex flex-col gap-4">
        <h2 id="spacing" className="text-xl font-semibold">
          Spacing
        </h2>
        <ul className="flex flex-col gap-2">
          {Object.entries(TOKENS.space).map(([k, v]) => (
            <li key={k} className="flex items-center gap-3">
              <code className="w-14 text-xs">p-{k}</code>
              <span className="bg-primary/60 h-3 rounded-sm" style={{ width: v }} />
              <span className="text-muted-foreground text-xs">{v}px</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="type" className="flex flex-col gap-4">
        <h2 id="type" className="text-xl font-semibold">
          Type
        </h2>
        <ul className="flex flex-col gap-3">
          {Object.entries(TOKENS.fontSize)
            .reverse()
            .map(([k, v]) => (
              <li key={k} className="flex items-baseline gap-4">
                <code className="text-muted-foreground w-24 shrink-0 text-xs">
                  text-{k} · {v}
                </code>
                <span style={{ fontSize: v }}>Prototypes that look designed</span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
