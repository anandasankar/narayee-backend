import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    files: ['src/**/*.ts'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      quotes: ['error', 'single'],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 105,
          tabWidth: 2,
          trailingComma: 'all',
          endOfLine: 'auto',
        },
      ],

      'max-len': [
        'error',
        {
          code: 105,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'error',
      'no-console': 'warn',
    },
  },

  {
    files: ['*.config.js', '*.config.cjs', '*.config.mjs', '.husky/*'],

    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
];
