// npm test -w packages/tokens — the theme generator's guarantees.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { contrastFailures } from '../lib/contrast.mjs';
import { loadTokens } from '../lib/resolve.mjs';
import { resolveTree } from '../lib/theme/refs.mjs';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(pkg, '../..');
const sources = {
  fixture: join(pkg, 'test/fixtures/tokens.json'),
  mobile: join(repo, 'apps/mobile/tokens/tokens.json'),
};

for (const [name, path] of Object.entries(sources)) {
  test(`refs.mjs resolves ${name} tokens.json exactly as Style Dictionary does`, async () => {
    const source = JSON.parse(readFileSync(path, 'utf8'));
    const sd = await loadTokens(path);
    const sdBy = (list) => Object.fromEntries(list.map((t) => [t.path.join('.'), t.$value]));
    const ours = (mode) => Object.fromEntries(resolveTree(source, mode).map((t) => [t.path.join('.'), t.$value]));
    assert.deepEqual(ours('light'), { ...sdBy(sd.prim), ...sdBy(sd.semLight) });
    assert.deepEqual(ours('dark'), { ...sdBy(sd.prim), ...sdBy(sd.semDark) });
  });
}

test('refs.mjs reports missing and circular references', () => {
  assert.throws(() => resolveTree({ a: { $value: '{b}' } }, 'light'), /Unresolved reference \{b\}/);
  assert.throws(() => resolveTree({ a: { $value: '{b}' }, b: { $value: '{a}' } }, 'light'), /Circular reference/);
});

test('strict contrast adds tones as ink on muted and accent', () => {
  const hex = { background: '#ffffff', card: '#ffffff', muted: '#d4d4d8', accent: '#ffffff', primary: '#2563eb' };
  assert.deepEqual(contrastFailures(hex, 'light'), []);
  const strict = contrastFailures(hex, 'light', { strict: true });
  assert.equal(strict.length, 1);
  assert.match(strict[0], /text-primary on muted/);
});
