module.exports = {
    env: {
        node: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:playwright/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        'playwright/missing-playwright-await': 'error',
        'playwright/no-page-pause': 'warn',
        'playwright/no-element-handle': 'warn',
        'playwright/no-eval': 'warn',
        'playwright/no-wait-for-timeout': 'warn',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
};
