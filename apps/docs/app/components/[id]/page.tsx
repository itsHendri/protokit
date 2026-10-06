import { Callout } from 'fumadocs-ui/components/callout';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'fumadocs-ui/components/tabs';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { InlineMd } from '@/components/inline-md';
import { PhoneFrame } from '@/components/phone-frame';
import { components, getComponent, kit, registryItemFor, sourceUrl } from '@/lib/kit';
import { site } from '@/lib/llms';
import { codeThemes } from '@/lib/shared';

export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((c) => ({ id: c.id }));
}

export async function generateMetadata(props: PageProps<'/components/[id]'>): Promise<Metadata> {
  const { id } = await props.params;
  const c = getComponent(id);
  if (!c) notFound();
  return { title: c.title, description: c.notes.replace(/`/g, '') || c.caption };
}

/** Where a component without its own Kitchen Sink demo is shown instead. */
const PREVIEWED_ELSEWHERE: Record<string, string> = {
  text: 'The type scale is previewed in the kit under Foundations › Typography.',
  label: 'Label is shown with every field in Inputs & selection.',
  'kit-chip': 'Scaffolding, not a product component: the floating “Back to kit” pill in the sample apps.',
};

export default async function ComponentPage(props: PageProps<'/components/[id]'>) {
  const { id } = await props.params;
  const c = getComponent(id);
  if (!c) notFound();

  const item = registryItemFor(c);
  const index = components.indexOf(c);
  const prev = components[index - 1];
  const next = components[index + 1];
  const installCommand = c.install ? `npx shadcn@latest add ${c.install}` : null;

  return (
    <DocsPage full>
      <DocsTitle>{c.title}</DocsTitle>
      <DocsDescription>
        <InlineMd text={c.notes || c.caption || ''} />
      </DocsDescription>
      <DocsBody>
        <div className="not-prose grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
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
              {/* Explicit values: Fumadocs builds tab ids from the label and only replaces its first space. */}
              <Tabs defaultValue="kit">
                <TabsList>
                  <TabsTrigger value="kit">In the kit</TabsTrigger>
                  {installCommand ? <TabsTrigger value="expo">Existing Expo app</TabsTrigger> : null}
                </TabsList>
                <TabsContent value="kit">
                  <p className="text-muted-foreground mb-3 text-sm">Already in every copy of the mobile kit:</p>
                  <DynamicCodeBlock
                    lang="tsx"
                    code={`import { ${c.exports.join(', ')} } from '@/${c.files[0].replace(/\.tsx?$/, '')}';`}
                  />
                </TabsContent>
                {installCommand ? (
                  <TabsContent value="expo">
                    <p className="text-muted-foreground mb-3 text-sm">
                      With react-native-reusables set up and the registry in <code>components.json</code> (
                      <Link href="/docs/install" className="underline underline-offset-4">
                        install guide
                      </Link>
                      ):
                    </p>
                    <DynamicCodeBlock options={{ themes: codeThemes }} lang="bash" code={`${installCommand}\nnpx expo install --fix`} />
                    {item?.registryDependencies?.some((d) => d.startsWith(`${kit.registry.native}/`) && !d.includes('/lib-') && !d.endsWith('/theme')) ? (
                      <p className="text-muted-foreground mt-3 text-sm">
                        Replaces some react-native-reusables files with the kit&apos;s refined versions; answer yes when
                        asked to overwrite (or add <code>--overwrite</code>).
                      </p>
                    ) : null}
                  </TabsContent>
                ) : null}
              </Tabs>
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
                    <a key={f} href={sourceUrl(f)} className="block font-mono underline underline-offset-4">
                      apps/mobile/{f}
                    </a>
                  ))}
                </Row>
                {item?.dependencies?.length ? <Row term="Packages">{item.dependencies.join(', ')}</Row> : null}
                {item?.registryDependencies?.length ? (
                  <Row term="Installs with">{item.registryDependencies.map((d) => d.replace(/^https:\/\/reactnativereusables\.com\/r\/nativewind\/(.*)\.json$/, 'rnr/$1')).join(', ')}</Row>
                ) : null}
                {c.aliases?.length ? <Row term="Also searched as">{c.aliases.join(', ')}</Row> : null}
                {c.install?.startsWith('https://') ? (
                  <Row term="Upstream">Unchanged from react-native-reusables; installs from their registry.</Row>
                ) : null}
              </dl>
            </section>

            <nav aria-label="More components" className="flex justify-between gap-4 text-sm">
              {prev ? (
                <Link href={`/components/${prev.id}`} className="hover:text-fd-primary">
                  ← {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/components/${next.id}`} className="hover:text-fd-primary">
                  {next.title} →
                </Link>
              ) : null}
            </nav>
          </div>

          <aside aria-label={`${c.title}, live`} className="lg:sticky lg:top-24">
            {c.preview === false ? (
              <Callout title="No live preview">{PREVIEWED_ELSEWHERE[c.id] ?? 'Previewed elsewhere in the kit.'}</Callout>
            ) : (
              <figure className="flex flex-col items-center gap-3">
                <PhoneFrame path={`/kitchen-sink?section=${c.id}`} title={`${c.title}, live preview`} width={300} />
                <figcaption className="text-muted-foreground max-w-[300px] text-center text-xs">
                  The real component, running in the kit&apos;s web build. Follows this site&apos;s theme.
                </figcaption>
              </figure>
            )}
          </aside>
        </div>
        <p className="text-muted-foreground mt-10 text-xs">
          Agents: the whole registry is at <a href={site('/llms.txt')}>/llms.txt</a>; this component as registry JSON
          {c.install?.startsWith(`${kit.registry.native}/`) ? (
            <>
              {' '}
              is <a href={`/r/native/${c.install.slice(kit.registry.native.length + 1)}.json`}>here</a>
            </>
          ) : null}
          .
        </p>
      </DocsBody>
    </DocsPage>
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
