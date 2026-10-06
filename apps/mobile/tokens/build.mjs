#!/usr/bin/env node
/**
 * tokens/build.mjs — `npm run tokens:build`. Kept so the command and its docs stay stable; the work
 * happens in tokens/cli.mjs (`kit-tokens build`), driven by tokens/tokens.config.json.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { run } from './cli.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
await run(['build', '--root', root, ...process.argv.slice(2)]);
