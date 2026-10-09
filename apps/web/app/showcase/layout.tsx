import { KitChip } from '@/components/site/kit-chip';

/**
 * The showcase: real registry components in a masonry (and, under /typeset, long-form text beside them),
 * for the docs site's home page and theme studio. Not a sample to copy: it has no app shell. `data-autosize`
 * is what the embed bridge measures for `?autosize=1` (lib/embed.ts).
 */
export default function ShowcaseLayout({ children }: LayoutProps<'/showcase'>) {
  return (
    <div data-autosize className="mx-auto w-full max-w-[1600px] p-4 sm:p-6">
      <div className="kit-chrome mb-4 flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Showcase</h1>
        <KitChip />
      </div>
      {children}
    </div>
  );
}
