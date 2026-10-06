import { KitHeader } from '@/components/site/kit-header';

/**
 * The kit shell: Home · Components (the Kitchen Sink) · Foundations. A real prototype lives in its own
 * folder (app/<slug>/) with its own layout; it does not use this one.
 */
export default function KitLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <KitHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </>
  );
}
