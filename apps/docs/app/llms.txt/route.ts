import { mobileLlms, site } from '@/lib/llms';
import { docsLlms } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const body = [
    mobileLlms(),
    '## This site',
    '',
    `- [Install guide for agents](${site('/install.md')}): pick a path, then the rules`,
    `- [Everything in one file](${site('/llms-full.txt')})`,
    `- [shadcn registry (Expo + react-native-reusables)](${site('/r/native/registry.json')})`,
    '',
    await docsLlms.index(),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
