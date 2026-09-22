import { CATEGORIES } from '@/components/devkit/categories';
import { DevKitHub } from '@/components/devkit/DevKitHub';
import { SECTIONS } from '@/components/devkit/registry';

/** The Kitchen Sink: every component the kit ships, grouped by function, searchable. */
export default function KitchenSink() {
  return (
    <DevKitHub
      categories={CATEGORIES}
      sections={SECTIONS}
      searchPlaceholder="Search components"
      initialOpen={['actions']}
    />
  );
}
