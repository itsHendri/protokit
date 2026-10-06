import { mobileLlms } from '@/lib/llms';
import { docsLlms } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  return new Response(`${mobileLlms()}\n\n${await docsLlms.full()}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
