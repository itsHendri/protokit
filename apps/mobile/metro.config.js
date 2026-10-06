const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// NativeWind resolves these against the working directory, not this file. Absolute paths keep them
// right when Metro starts from the monorepo root (`npm run ios` there, or `-w apps/mobile`).
module.exports = withNativeWind(config, {
  input: path.join(__dirname, 'global.css'),
  configPath: path.join(__dirname, 'tailwind.config.js'),
  // nativewind-env.d.ts is committed and already in tsconfig. Generating it is cwd-relative and, given an
  // absolute path, writes this machine's path into tsconfig.json, so it stays off.
  disableTypeScriptGeneration: true,
  inlineRem: 16,
});
