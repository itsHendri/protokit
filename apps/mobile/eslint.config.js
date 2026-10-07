// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'tokens/generated/*'],
  },
  {
    // Hex colours reach components through usePalette(), which follows a runtime theme override
    // (the docs site's theme picker); the generated THEME and NAV_THEME don't.
    files: ['app/**', 'components/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/theme',
              importNames: ['THEME', 'NAV_THEME'],
              message: 'Use usePalette() / useNavTheme() from @/lib/palette-context.',
            },
          ],
        },
      ],
    },
  },
]);
