import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
      },
    },
  },
  pluginJs.configs.recommended,

  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'eslint.config.js',
      'stylelint.config.cjs',
      '.github',
    ],
  },

  {
    files: ['**/__tests__/**/*.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {},
  },
];
