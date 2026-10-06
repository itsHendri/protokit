import type { Metadata } from 'next';
import { AssistantView } from '@/components/assistant/assistant-view';

export const metadata: Metadata = { title: 'Northwind Assistant' };

/** Sample: an AI product screen (the AI conversation pattern) built only from registry components. */
export default function AssistantPage() {
  return <AssistantView />;
}
