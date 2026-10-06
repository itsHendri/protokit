import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { componentsTree } from '@/lib/components-tree';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/components'>) {
  return (
    <DocsLayout tree={componentsTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
