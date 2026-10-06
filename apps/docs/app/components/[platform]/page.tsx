import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { InlineMd } from '@/components/inline-md';
import { componentsIn, componentUrl, isPlatform, kit, kits, PLATFORMS } from '@/lib/kit';

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORMS.map((platform) => ({ platform }));
}

export async function generateMetadata(props: PageProps<'/components/[platform]'>): Promise<Metadata> {
  const { platform } = await props.params;
  if (!isPlatform(platform)) notFound();
  return {
    title: `${kits[platform].label} components`,
    description: `Every component the ${kit.name} ${platform} kit ships, by function.`,
  };
}

export default async function PlatformComponents(props: PageProps<'/components/[platform]'>) {
  const { platform } = await props.params;
  if (!isPlatform(platform)) notFound();
  const k = kits[platform];
  return (
    <DocsPage full>
      <DocsTitle>{k.label} components</DocsTitle>
      <DocsDescription>
        {k.components.length} components in {k.categories.length} categories, {k.previewed.length} of them previewed live. {k.stack}.
        This list is the whole kit: an agent building a prototype may use these and nothing else.
      </DocsDescription>
      <DocsBody>
        {k.categories.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="not-prose mb-10">
            <h2 id={`cat-${cat.id}`} className="mb-1 scroll-mt-24 text-xl font-semibold">
              {cat.label}
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">{cat.blurb}</p>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {componentsIn(platform, cat.id).map((c) => (
                <li key={c.id}>
                  <Link
                    href={componentUrl(platform, c.id)}
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
