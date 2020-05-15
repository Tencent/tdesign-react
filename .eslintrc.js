module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        '@tencent/eslint-config-tencent',
    ],
    plugins: ['@typescript-eslint'],
    env: {
        browser: true,
        node: true,
    },
    settings: {
        react: {
            'pragma': 'React',
            'version': 'detect'
        }
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'react/display-name': 'off',
        'max-len': ['error', 140],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'indent': ["error", 4]
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
            '@typescript-eslint/explicit-function-return-type': ['error']
          }
        }
    ]
}