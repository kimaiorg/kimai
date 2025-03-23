// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Allow `any` type but warn
      '@typescript-eslint/no-floating-promises': 'warn', // Warn about unhandled promises
      '@typescript-eslint/no-unsafe-argument': 'warn', // Warn about unsafe argument types

      // JavaScript/ESLint rules
      'no-console': 'warn', // Warn on console usage
      'no-unused-vars': 'warn', // Warn on unused variables
      eqeqeq: 'warn', // Warn on non-strict equality operators (use `===` and `!==` instead)
      curly: 'warn', // Warn if `if` and `else` blocks are not wrapped in curly braces
      quotes: ['warn', 'single'], // Warn on quotes style violation (enforce single quotes)
      semi: ['warn', 'always'], // Warn about missing semicolons

      // Prettier-related rule (integrated with ESLint)
      'prettier/prettier': 'warn', // Warn about Prettier formatting violations
    },
  },
);
