import { Callout } from 'fumadocs-ui/components/callout';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'fumadocs-ui/components/tabs';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BrowserFrame } from '@/components/browser-frame';
import { InlineMd } from '@/components/inline-md';
import { PhoneFrame } from '@/components/phone-frame';
import { componentUrl, getComponent, isPlatform, kits, PLATFORMS, registryItemFor, sourceUrl, type KitComponent, type Platform } from '@/lib/kit';
import { site } from '@/lib/llms';
import { codeThemes } from '@/lib/shared';

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORMS.flatMap((platform) => kits[platform].components.map((c) => ({ platform, id: c.id })));
}

async function resolve(props: PageProps<'/components/[platform]/[id]'>) {
  const { platform, id } = await props.params;
  if (!isPlatform(platform)) notFound();
  const c = getComponent(platform, id);
  if (!c) notFound();
  return { platform, c };
}

export async function generateMetadata(props: PageProps<'/components/[platform]/[id]'>): Promise<Metadata> {
  const { platform, c } = await resolve(props);
  return { title: `${c.title} · ${kits[platform].label}`, description: c.notes.replace(/`/g, '') || c.caption };
}

/** Where a component without its own Kitchen Sink demo is shown instead. */
const PREVIEWED_ELSEWHERE: Record<Platform, Record<string, string>> = {
  mobile: {
    text: 'The type scale is previewed in the kit under Foundations › Typography.',
    label: 'Label is shown with every field in Inputs & selection.',
    'kit-chip': 'Scaffolding, not a product component: the floating “Back to kit” pill in the sample apps.',
  },
  web: {
    label: 'Label is shown with every field in Inputs & selection.',
    'scroll-area': 'Used inside Command, Select and Sheet rather than on its own.',
  },
};

const upstreamName = (platform: Platform) => (platform === 'mobile' ? 'react-native-reusables' : 'shadcn/ui');

/** Shortens registry dependency URLs for the Details table. */
const depLabel = (d: string) =>
  d.replace(/^https:\/\/reactnativereusables\.com\/r\/nativewind\/(.*)\.json$/, 'rnr/$1').replace(/^https:\/\/ui\.shadcn\.com\/r\/styles\/[^/]+\/(.*)\.json$/, '$1');

export default async function ComponentPage(props: PageProps<'/components/[platform]/[id]'>) {
  const { platform, c } = await resolve(props);
  const k = kits[platform];
  const other: Platform = platform === 'mobile' ? 'web' : 'mobile';
  const twin = getComponent(other, c.id);

  const item = registryItemFor(platform, c);
  const index = k.components.indexOf(c);
  const prev = k.components[index - 1];
  const next = k.components[index + 1];
  const ours = c.install?.startsWith(`${k.namespace}/`) ?? false;
  const preview =
    c.preview === false ? (
      <Callout title="No live preview">{PREVIEWED_ELSEWHERE[platform][c.id] ?? 'Previewed elsewhere in the kit.'}</Callout>
    ) : null;

  return (
    <DocsPage full>
      <DocsTitle>{c.title}</DocsTitle>
      <DocsDescription>
        <InlineMd text={c.notes || c.caption || ''} />
      </DocsDescription>
      <DocsBody>
        {platform === 'web' ? (
          <figure className="not-prose mb-10 flex flex-col gap-3">
            {preview ?? <BrowserFrame path={`${k.kitchenSink}?section=${c.id}`} address={`/components#${c.id}`} title={`${c.title}, live preview`} viewport={{ width: 1024, height: 560 }} />}
            {preview ? null : (
              <figcaption className="text-muted-foreground text-xs">
                The real component, running in the web kit&apos;s static build at desktop width. Follows this site&apos;s theme.
              </figcaption>
            )}
          </figure>
        ) : null}

        <div className={`not-prose grid items-start gap-10 ${platform === 'mobile' ? 'lg:grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
          <div className="flex min-w-0 flex-col gap-8">
            {c.caption ? (
              <section aria-labelledby="usage">
                <h2 id="usage" className="mb-2 text-lg font-semibold">
                  Usage
                </h2>
                <p className="text-fd-foreground/90 leading-7">
                  <InlineMd text={c.caption} />
                </p>
              </section>
            ) : null}

            {c.api ? (
              <section aria-labelledby="api">
                <h2 id="api" className="mb-2 text-lg font-semibold">
                  API
                </h2>
                <DynamicCodeBlock options={{ themes: codeThemes }} lang="tsx" code={c.api} />
              </section>
            ) : null}

            <section aria-labelledby="get-it">
              <h2 id="get-it" className="mb-2 text-lg font-semibold">
                Get it
              </h2>
              <GetIt platform={platform} c={c} ours={ours} replacesUpstream={replacesUpstream(platform, item)} />
            </section>

            <section aria-labelledby="details">
              <h2 id="details" className="mb-2 text-lg font-semibold">
                Details
              </h2>
              <dl className="border-border divide-border divide-y rounded-xl border text-sm">
                <Row term="Exports">
                  <InlineMd text={c.exports.map((e) => `\`${e}\``).join(', ')} />
                </Row>
                <Row term="Source">
                  {c.files.map((f) => (
                    <a key={f} href={sourceUrl(platform, f)} className="block font-mono underline underline-offset-4">
                      apps/{platform}/{f}
                    </a>
                  ))}
                </Row>
                {item?.dependencies?.length ? <Row term="Packages">{item.dependencies.join(', ')}</Row> : null}
                {item?.registryDependencies?.length ? <Row term="Installs with">{item.registryDependencies.map(depLabel).join(', ')}</Row> : null}
                {c.aliases?.length ? <Row term="Also searched as">{c.aliases.join(', ')}</Row> : null}
                {c.install && !ours ? <Row term="Upstream">Unchanged from {upstreamName(platform)}; installs from their registry.</Row> : null}
                {twin ? (
                  <Row term={kits[other].label}>
                    <Link href={componentUrl(other, twin.id)} className="underline underline-offset-4">
                      {twin.title} in the {other} kit
                    </Link>
                  </Row>
                ) : null}
              </dl>
            </section>

            <nav aria-label="More components" className="flex justify-between gap-4 text-sm">
              {prev ? (
                <Link href={componentUrl(platform, prev.id)} className="hover:text-fd-primary">
                  ← {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={componentUrl(platform, next.id)} className="hover:text-fd-primary">
                  {next.title} →
                </Link>
              ) : null}
            </nav>
          </div>

          {platform === 'mobile' ? (
            <aside aria-label={`${c.title}, live`} className="lg:sticky lg:top-24">
              {preview ?? (
                <figure className="flex flex-col items-center gap-3">
                  <PhoneFrame path={`${k.kitchenSink}?section=${c.id}`} title={`${c.title}, live preview`} width={300} />
                  <figcaption className="text-muted-foreground max-w-[300px] text-center text-xs">
                    The real component, running in the kit&apos;s web build. Follows this site&apos;s theme.
                  </figcaption>
                </figure>
              )}
            </aside>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-10 text-xs">
          Agents: the whole registry is at <a href={site('/llms.txt')}>/llms.txt</a>; this component as registry JSON
          {ours && c.install ? (
            <>
              {' '}
              is <a href={`${k.registryPath}/${c.install.slice(k.namespace.length + 1)}.json`}>here</a>
            </>
          ) : null}
          .
        </p>
      </DocsBody>
    </DocsPage>
  );
}

/** True when installing the item also swaps in the kit's versions of upstream files (shadcn asks to overwrite). */
function replacesUpstream(platform: Platform, item: ReturnType<typeof registryItemFor>) {
  const ns = kits[platform].namespace;
  return !!item?.registryDependencies?.some((d) => d.startsWith(`${ns}/`) && !d.includes('/lib-') && !d.includes('/hook-') && !d.endsWith('/theme'));
}

function GetIt({ platform, c, ours, replacesUpstream }: { platform: Platform; c: KitComponent; ours: boolean; replacesUpstream: boolean }) {
  const command = c.install ? `npx shadcn@latest add ${c.install}` : null;
  const existing = platform === 'mobile' ? 'Existing Expo app' : 'Existing Next.js app';
  return (
    // Explicit values: Fumadocs builds tab ids from the label and only replaces its first space.
    <Tabs defaultValue="kit">
      <TabsList>
        <TabsTrigger value="kit">In the kit</TabsTrigger>
        {command ? <TabsTrigger value="existing">{existing}</TabsTrigger> : null}
      </TabsList>
      <TabsContent value="kit">
        <p className="text-muted-foreground mb-3 text-sm">Already in every copy of the {platform} kit:</p>
        <DynamicCodeBlock lang="tsx" code={`import { ${c.exports.join(', ')} } from '@/${c.files[0].replace(/\.tsx?$/, '')}';`} />
      </TabsContent>
      {command ? (
        <TabsContent value="existing">
          <p className="text-muted-foreground mb-3 text-sm">
            {!ours ? (
              <>Unchanged from {upstreamName(platform)}, so it installs from their registry:</>
            ) : (
              <>
                With {platform === 'mobile' ? 'react-native-reusables' : 'shadcn/ui'} set up and the kit&apos;s registry in{' '}
                <code>components.json</code> (
                <Link href="/docs/install" className="underline underline-offset-4">
                  install guide
                </Link>
                ):
              </>
            )}
          </p>
          <DynamicCodeBlock options={{ themes: codeThemes }} lang="bash" code={platform === 'mobile' ? `${command}\nnpx expo install --fix` : command} />
          {replacesUpstream ? (
            <p className="text-muted-foreground mt-3 text-sm">
              Replaces some {upstreamName(platform)} files with the kit&apos;s refined versions; answer yes when asked to
              overwrite (or add <code>--overwrite</code>).
            </p>
          ) : null}
        </TabsContent>
      ) : null}
    </Tabs>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr]">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}
