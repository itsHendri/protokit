import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions('docs');
  return (
    // The notebook layout under the shared top bar (nav mode 'top'); the tree is the sidebar.
    <DocsLayout tree={source.getPageTree()} {...base} nav={{ ...base.nav, mode: 'top' }}>
      {children}
    </DocsLayout>
  );
}
