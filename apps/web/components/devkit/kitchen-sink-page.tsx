'use client';
import { useEmbedded } from '@/lib/embed';
import { KitchenSink } from './kitchen-sink';

/** The page is static; whether it is embedded is only known in the browser. */
export function KitchenSinkPage() {
  return <KitchenSink embedded={useEmbedded()} />;
}
