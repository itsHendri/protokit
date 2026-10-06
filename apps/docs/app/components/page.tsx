import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { InlineMd } from '@/components/inline-md';
import { categories, components, componentsIn, kit, previewed } from '@/lib/kit';

export const metadata: Metadata = {
  title: 'Components',
  description: `Every component the ${kit.name} mobile kit ships, by function.`,
};

export default function ComponentsIndex() {
  return (
    <DocsPage full>
      <DocsTitle>Components</DocsTitle>
      <DocsDescription>
        {components.length} components in {categories.length} categories, {previewed.length} of them previewed live. This list
        is the whole kit: an agent building a prototype may use these and nothing else.
      </DocsDescription>
      <DocsBody>
        {categories.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="not-prose mb-10">
            <h2 id={`cat-${cat.id}`} className="mb-1 text-xl font-semibold">
              {cat.label}
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">{cat.blurb}</p>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {componentsIn(cat.id).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/components/${c.id}`}
                    className="border-border bg-card hover:bg-accent focus-visible:ring-ring block h-full rounded-xl border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2">
                    <span className="block font-medium">{c.title}</span>
                    <span className="text-muted-foreground mt-1 line-clamp-2 block text-sm">
                      <InlineMd text={c.notes || c.caption || c.exports.join(' / ')} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </DocsBody>
    </DocsPage>
  );
}
