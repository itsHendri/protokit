import { FOUNDATIONS } from '@/components/devkit/categories';
import { DevKitHub } from '@/components/devkit/DevKitHub';
import { FOUNDATION_SECTIONS } from '@/components/devkit/registry';

/** Foundations: the design tokens, tap-to-copy. */
export default function Foundations() {
  return (
    <DevKitHub
      categories={FOUNDATIONS}
      sections={FOUNDATION_SECTIONS}
      searchPlaceholder="Search tokens"
      initialOpen={['color']}
    />
  );
}
