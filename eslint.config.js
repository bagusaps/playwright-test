// eslint.config.js (Flat Config ESLint v9)
import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
// (opsional) import playwright from 'eslint-plugin-playwright';

export default [
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**'] },

  js.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.node, ...globals.browser },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      // playwright,
    },
    rules: {
      ...prettierConfig.rules,                // matikan rules yang konflik dgn Prettier
      'prettier/prettier': ['error', {       // format style
        singleQuote: true,
        semi: true,
        printWidth: 100,
        trailingComma: 'all',
      }],
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],

      // (opsional) rekomendasi Playwright:
      // ...playwright.configs['flat/recommended'].rules,
      // 'playwright/no-page-pause': 'warn',
    },
  },
];
