import { ArrowRightIcon } from 'lucide-react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { kit, kits, PLATFORMS, totalComponents } from '@/lib/kit';

export const metadata: Metadata = {
  title: 'Components',
  description: `Every component the ${kit.name} kits ship, for mobile and web.`,
};

const FOR: Record<string, string> = {
  mobile: 'Phone prototypes that run in Expo Go, a development build and the browser.',
  web: 'Dashboards, marketing pages and AI product interfaces.',
};

export default function ComponentsIndex() {
  return (
    <DocsPage full className="*:mx-auto *:w-full">
      <DocsTitle>Components</DocsTitle>
      <DocsDescription>
        {totalComponents} components across two kits on one set of tokens. Each kit’s list is the whole kit: an agent
        building a prototype may use those and nothing else.
      </DocsDescription>
      <DocsBody>
        <ul className="not-prose grid gap-4 md:grid-cols-2">
          {PLATFORMS.map((p) => {
            const k = kits[p];
            return (
              <li key={p}>
                <Link
                  href={`/components/${p}`}
                  className="border-border bg-card hover:bg-accent focus-visible:ring-ring flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors focus-visible:outline-none focus-visible:ring-2">
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-xl font-semibold">{k.label}</span>
                    <span className="bg-muted rounded-full px-2.5 py-0.5 text-sm tabular-nums">{k.components.length}</span>
                  </span>
                  <span className="text-muted-foreground leading-7">{FOR[p]}</span>
                  <span className="text-muted-foreground text-sm">{k.stack}</span>
                  <span className="text-muted-foreground flex flex-wrap gap-1.5 text-xs">
                    {k.categories.map((c) => (
                      <span key={c.id} className="border-border rounded-full border px-2 py-0.5">
                        {c.label}
                      </span>
                    ))}
                  </span>
                  <span className="text-primary mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium">
                    Browse the {p} kit <ArrowRightIcon className="size-4" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </DocsBody>
    </DocsPage>
  );
}
