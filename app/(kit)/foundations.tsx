import { FOUNDATIONS } from '@/components/devkit/categories';
import { DevKitHub } from '@/components/devkit/DevKitHub';
import { FOUNDATION_SECTIONS } from '@/components/devkit/registry';
import type { FoundationId } from '@/components/devkit/types';
import { useLocalSearchParams } from 'expo-router';

/** Foundations: the design tokens, tap-to-copy. Deep link: /foundations?open=type */
export default function Foundations() {
  const { open } = useLocalSearchParams<{ open?: string }>();
  const valid = FOUNDATIONS.some((f) => f.id === open) ? (open as FoundationId) : undefined;
  return (
    <DevKitHub
      key={open ?? 'default'}
      categories={FOUNDATIONS}
      sections={FOUNDATION_SECTIONS}
      searchPlaceholder="Search tokens"
      initialOpen={[valid ?? 'color']}
      focus={valid}
    />
  );
}
