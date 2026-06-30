module.exports = {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'simple-import-sort', 'prettier'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': [
      'warn',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],

    // code style config
    'no-param-reassign': 'off',
    'guard-for-in': 'off',
    'no-use-before-define': 'off',
    'no-throw-literal': 'off',
    'no-unused-expressions': 'off',
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
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        quoteProps: 'as-needed',
        jsxSingleQuote: false,
        trailingComma: 'all',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'always',
        proseWrap: 'preserve',
        htmlWhitespaceSensitivity: 'css',
        endOfLine: 'lf',
      },
    ],
    // import config
    'import/order': 'off',
    'import/extensions': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'import/no-relative-packages': 'off',
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
    // typescript config
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': ['off', 2],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    // react config
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['**/_example/**/*', '**/__tests__/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
