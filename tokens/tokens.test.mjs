// npm run test:tokens — the token build's guarantees, independent of the brand in tokens.json.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { contrast, hexToOklch, hexToOklchParts, oklchPartsToHex } from './lib/color.mjs';
import { checkContrast, contrastFailures } from './lib/contrast.mjs';
import { group, loadTokens, radiusCalc } from './lib/resolve.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ctx = await loadTokens(join(root, 'tokens/tokens.json'));

test('oklch round-trips every token colour to the same 8-bit hex', () => {
  for (const c of ctx.colors) {
    for (const hex of [c.light, c.dark]) {
      const [L, C, H] = hexToOklch(hex).slice(6, -1).split(' ').map(Number);
      assert.equal(oklchPartsToHex([L, C, H]), hex, `${c.name}: ${hex}`);
    }
  }
});

test('oklch round-trips the sRGB corners and a deterministic sweep', () => {
  for (let n = 0; n < 0x1000000; n += 0x10101 * 7 + 13) {
    const hex = '#' + n.toString(16).padStart(6, '0');
    assert.doesNotThrow(() => hexToOklch(hex), hex);
  }
  for (const hex of ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#07f3ea']) {
    assert.equal(oklchPartsToHex(hexToOklchParts(hex)), hex);
  }
});

test('with the default base, every rounded-* class equals its primitive', () => {
  const prim = Object.fromEntries(group(ctx.prim, ['radius']).map((t) => [t.key, t.value]));
  for (const { name, offset } of ctx.radius.steps) {
    assert.equal(ctx.radius.base + offset, prim[name], `rounded-${name}`);
  }
  assert.equal(radiusCalc(0), 'var(--radius)');
  assert.equal(radiusCalc(-4), 'calc(var(--radius) - 4px)');
});

test('the shipped palette passes the contrast gate', () => {
  assert.deepEqual(checkContrast(ctx.colors), []);
});

test('the gate rejects white text on an amber fill and amber ink on white', () => {
  const failures = contrastFailures(
    { background: '#ffffff', card: '#ffffff', foreground: '#09090b', warning: '#f59e0b', 'warning-foreground': '#ffffff' },
    'light'
  );
  assert.ok(failures.some((f) => f.includes('warning-foreground on warning')));
  assert.ok(failures.some((f) => f.includes('text-warning on background')));
  assert.ok(contrast('#000000', '#ffffff') > 20);
});

test('every generated file is up to date', () => {
  execFileSync(process.execPath, [join(root, 'tokens/cli.mjs'), 'check', '--root', root], { stdio: 'pipe' });
});
