import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { base, react } from '@rss1102/eslint-config-tdesign';

export default [
  ...base,
  ...react,
  {
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
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooksPlugin,
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
      'import/first': 'off',
      'no-useless-assignment': 'off',
      'no-unused-vars': 'off',
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
      'simple-import-sort/exports': 'off',
      'simple-import-sort/imports': 'off',
    },
  },
  {
    files: ['**/_usage/**/*', '**/_example/**/*', '**/__tests__/**/*'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'simple-import-sort/imports': 'off',
    },
  },
  {
    files: ['**/_example/**/*', '**/__tests__/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
];
