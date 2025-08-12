const tseslint = require('typescript-eslint');
const cypress = require('eslint-plugin-cypress');
const unusedImports = require('eslint-plugin-unused-imports');

const isCI = process.env.CI === 'true';

module.exports = tseslint.config(
  // Ignorados
  {
    ignores: [
      'node_modules',
      'dist',
      'cypress/videos',
      'cypress/screenshots',
      'eslint.config.cjs',
      'scripts/check-exports.cjs'
    ],
  },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['cypress/**/*.ts'],
    ...cypress.configs.recommended,
  },

  {
    files: ['cypress/e2e/ui/**/*.ts', 'cypress/support/*.ts'],
    rules: {
      'cypress/unsafe-to-chain-command': isCI ? 'error' : 'off',
    },
  }
);
