// npm test -w packages/tokens — the token build's guarantees, independent of any app's brand.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { contrast, hexToOklch, hexToOklchParts, oklchPartsToHex } from '../lib/color.mjs';
import { checkContrast, contrastFailures } from '../lib/contrast.mjs';
import { group, loadTokens, radiusCalc } from '../lib/resolve.mjs';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(pkg, 'cli.mjs');
const fixture = join(pkg, 'test/fixtures/tokens.json');
const ctx = await loadTokens(fixture);

const temps = [];
after(() => temps.forEach((t) => rmSync(t, { recursive: true, force: true })));

/** A throwaway app root with the fixture tokens and a config that asks for every target. */
function appRoot(tokens = JSON.parse(readFileSync(fixture, 'utf8'))) {
  const root = mkdtempSync(join(tmpdir(), 'kit-tokens-'));
  temps.push(root);
  cpSync(join(pkg, 'test/fixtures'), join(root, 'tokens'), { recursive: true });
  writeFileSync(join(root, 'tokens/tokens.json'), JSON.stringify(tokens));
  writeFileSync(
    join(root, 'tokens/tokens.config.json'),
    JSON.stringify({
      source: 'tokens/tokens.json',
      targets: {
        nativewind3: { css: 'global.css', tailwind: 'tokens/generated/tailwind.theme.js' },
        'ts-theme': { out: 'lib/theme.ts', navTheme: 'expo-router/react-navigation' },
        figma: { out: 'tokens/generated/figma-theme.mjs' },
        'shadcn-web': { out: 'tokens/generated/web.css' },
        'registry-theme': { out: 'tokens/generated/theme.registry.json' },
        'design-md': { out: 'DESIGN.md' },
        llms: { out: 'tokens/generated/llms-tokens.md' },
      },
    })
  );
  return root;
}

const runCli = (args, opts) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', ...opts });

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

test('the fixture palette passes the contrast gate', () => {
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

test('build writes every target, then check passes', () => {
  const root = appRoot();
  const build = runCli(['build', '--root', root]);
  assert.equal(build.status, 0, build.stderr);
  for (const f of ['global.css', 'lib/theme.ts', 'tokens/generated/web.css', 'DESIGN.md', 'tokens/generated/theme.registry.json']) {
    assert.ok(existsSync(join(root, f)), f);
  }
  assert.match(readFileSync(join(root, 'tokens/generated/web.css'), 'utf8'), /@theme inline/);
  const check = runCli(['check', '--root', root]);
  assert.equal(check.status, 0, check.stderr);
});

test('check fails when a generated file is stale', () => {
  const root = appRoot();
  runCli(['build', '--root', root]);
  writeFileSync(join(root, 'global.css'), '/* edited by hand */');
  const check = runCli(['check', '--root', root]);
  assert.equal(check.status, 1);
  assert.match(check.stderr, /global\.css/);
});

test('build refuses a palette below AA and writes nothing', () => {
  const tokens = JSON.parse(readFileSync(fixture, 'utf8'));
  tokens.semantic.color['primary-foreground'].$value.light = '#93c5fd';
  const root = appRoot(tokens);
  const build = runCli(['build', '--root', root]);
  assert.equal(build.status, 1);
  assert.match(build.stderr, /primary-foreground on primary/);
  assert.ok(!existsSync(join(root, 'global.css')));
});

test('runs through a symlinked bin, the way npm installs it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kit-tokens-bin-'));
  temps.push(dir);
  symlinkSync(cli, join(dir, 'kit-tokens'));
  const version = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')).version;
  assert.equal(execFileSync(process.execPath, [join(dir, 'kit-tokens'), '--version'], { encoding: 'utf8' }).trim(), version);
});
