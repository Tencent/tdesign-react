import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { tdesign } from '@tdesign/eslint-config';

export default tdesign(
  {
    preset: 'react',
    tests: true,
  },
  {
    name: 'tdesign-react/ignores',
    ignores: [
      '**/dist/**',
      '**/es/**',
      '**/esm/**',
      '**/lib/**',
      '**/cjs/**',
      '**/_example-js/**',
      '**/node_modules/**',
      'snapshot*/**',
      'static/**',
      'cypress/**',
      'script/test/cypress/**',
      '_site/**',
      'temp*/**',
      'packages/common/**',
      'packages/ai-core/**',
      'site/engineering/static/**',
      'packages/components/**/type.ts',
    ],
  },
  {
    name: 'tdesign-react/overrides',
    files: ['**/*.{ts,tsx}'],
    plugins: { import: importPlugin, 'react-hooks': reactHooksPlugin },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lodash',
              message: 'Please use lodash-es instead.',
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      'import/first': 'off',
      'no-useless-assignment': 'off',
      'no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off',
      'simple-import-sort/exports': 'off',
      'simple-import-sort/imports': 'off',
    },
  },
  {
    name: 'tdesign-react/hooks',
    files: ['**/*.tsx'],
    rules: {
      'react-hooks/component-hook-factories': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/globals': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/void-use-memo': 'off',
    },
  },
  {
    name: 'tdesign-react/test-overrides',
    files: ['**/_usage/**/*', '**/_example/**/*', '**/__tests__/**/*'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'simple-import-sort/imports': 'off',
    },
  },
  {
    name: 'tdesign-react/test-hook-overrides',
    files: ['**/_usage/**/*.tsx', '**/_example/**/*.tsx', '**/__tests__/**/*.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    name: 'tdesign-react/example-overrides',
    files: ['**/_example/**/*', '**/__tests__/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
);
