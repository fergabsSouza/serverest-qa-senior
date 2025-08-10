// eslint.config.cjs
const tseslint = require('typescript-eslint');
const cypress = require('eslint-plugin-cypress');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
  {
    ignores: [
        'node_modules',
        'dist',
        'cypress/videos',
        'cypress/screenshots',
        'eslint.config.cjs',
        'scripts/check-exports.cjs',
    ],
  },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Deixa o TypeScript acusar parâmetros/variáveis não usados,
      // mas usamos o plugin para pegas extras e autofix de imports:
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Marca e permite autofix de imports não usados:
      'unused-imports/no-unused-imports': 'error',

      // Garante que variáveis não usadas também sejam pegas aqui (permite args/vars com _):
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['cypress/**/*.ts'],
    ...cypress.configs.recommended,
  }
);
