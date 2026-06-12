import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import eslintReact from '@eslint-react/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

import type { Linter } from 'eslint';

const eslintConfig: Linter.Config[] = [
  {
    ignores: [
      'snapshot*',
      '**/dist/**',
      '**/esm/**',
      '**/lib/**',
      '**/cjs/**',
      '**/es/**',
      '**/node_modules/**',
      '**/static/**',
      '**/cypress/**',
      'script/test/cypress/**',
      '**/_site/**',
      'temp*',
      'packages/common/**',
      'packages/ai-core/**',
      '**/_usage/**',
      '**/_example-js/**',
      // auto-generated file
      '**/site/test-coverage.js',
    ],
  },
  {
    ...eslintReact.configs['recommended-typescript'],
    files: ['**/*.{ts,tsx,js,jsx}'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      // @ts-ignore
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-console': [
        'warn',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],
      'no-param-reassign': 'off',
      'guard-for-in': 'off',
      'no-use-before-define': 'off',
      'no-throw-literal': 'off',
      'no-bitwise': 'off',
      'no-useless-return': 'off',
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-continue': 'off',
      'no-return-assign': 'off',
      'no-restricted-syntax': 'off',
      'no-restricted-globals': 'off',
      'no-unneeded-ternary': 'off',
      'eol-last': 'error',
      'func-names': 'off',
      'consistent-return': 'off',
      'default-case': 'off',
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
      'max-len': 'off',
      'no-shadow': 'off',
      // Import
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // NodeJS 内置模块
            [
              '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib)(/.*|$)',
            ],
            // 副作用导入（例如 "dotenv/config"
            ['^\\u0000'],
            // 第三方包
            ['^react', '^\\w', '^@\\w'],
            // 内部路径别名
            ['^@/'],
            // 相对路径
            ['^\\.'],
            // 类型
            ['^react\\u0000$', '^@?\\w.*\\u0000$', '^@/.*\\u0000$', '^\\..*\\u0000$'],
            // css
            ['\\.css$', '\\.less$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      // TS
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      // React
      '@eslint-react/naming-convention-ref-name': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/static-components': 'off',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/web-api-no-leaked-timeout': 'off',
      '@eslint-react/exhaustive-deps': 'warn',
      '@eslint-react/no-nested-component-definitions': 'warn',
      '@eslint-react/no-missing-key': 'error',
      '@eslint-react/no-direct-mutation-state': 'error',
      '@eslint-react/rules-of-hooks': 'error',
      // Prettier
      'prettier/prettier': [
        'error',
        {
          // 一行最多 120 字符
          printWidth: 120,
          // 使用 2 个空格缩进
          tabWidth: 2,
          // 不使用缩进符，而使用空格
          useTabs: false,
          // 行尾需要有分号
          semi: true,
          // 使用单引号
          singleQuote: true,
          // 对象的 key 仅在必要时用引号
          quoteProps: 'as-needed',
          // jsx 不使用单引号，而使用双引号
          jsxSingleQuote: false,
          // 末尾需要有逗号
          trailingComma: 'all',
          // 大括号内的首尾需要空格
          bracketSpacing: true,
          // jsx 标签的反尖括号需要换行
          jsxBracketSameLine: false,
          // 箭头函数，只有一个参数的时候，也需要括号
          arrowParens: 'always',
          // 每个文件格式化的范围是文件的全部内容
          rangeStart: 0,
          rangeEnd: Infinity,
          // 不需要写文件开头的 @prettier
          requirePragma: false,
          // 不需要自动在文件开头插入 @prettier
          insertPragma: false,
          // 使用默认的折行标准
          proseWrap: 'preserve',
          // 根据显示样式决定 html 要不要折行
          htmlWhitespaceSensitivity: 'css',
          // vue 文件中的 script 和 style 内不用缩进
          vueIndentScriptAndStyle: false,
          // 换行符使用 lf
          endOfLine: 'lf',
        },
      ],
    },
  },
  // Override for example and test files
  {
    files: ['**/_example/**/*', '**/__tests__/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
  // Override for script files
  {
    files: ['script/**/*'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
