const eslint = require('@eslint/js');
const playwright = require('eslint-plugin-playwright');

module.exports = [
    eslint.configs.recommended,
    playwright.configs['flat/recommended'],
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
            },
        },
        rules: {
            'playwright/missing-playwright-await': 'error',
            'playwright/no-page-pause': 'warn',
            'playwright/no-element-handle': 'warn',
            'playwright/no-eval': 'warn',
            'playwright/no-wait-for-timeout': 'warn',
            'playwright/no-standalone-expect': 'off',
            'playwright/prefer-web-first-assertions': 'off',
            'playwright/no-force-option': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
];
