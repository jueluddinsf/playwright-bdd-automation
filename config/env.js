const ENVIRONMENTS = {
    local: {
        BASE_URL: 'https://www.saucedemo.com',
        CREDENTIALS: {
            VALID: {
                USERNAME: 'standard_user',
                PASSWORD: 'secret_sauce',
            },
            INVALID: {
                USERNAME: 'invalid_user',
                PASSWORD: 'invalid_password',
            },
            EMPTY: {
                USERNAME: '',
                PASSWORD: '',
            },
        },
    },
    sat: {
        BASE_URL: 'https://www.saucedemo.com',
        CREDENTIALS: {
            VALID: {
                USERNAME: 'standard_user',
                PASSWORD: 'secret_sauce',
            },
            INVALID: {
                USERNAME: 'invalid_user',
                PASSWORD: 'invalid_password',
            },
            EMPTY: {
                USERNAME: '',
                PASSWORD: '',
            },
        },
    },
    stage: {
        BASE_URL: 'https://www.saucedemo.com',
        CREDENTIALS: {
            VALID: {
                USERNAME: 'standard_user',
                PASSWORD: 'secret_sauce',
            },
            INVALID: {
                USERNAME: 'invalid_user',
                PASSWORD: 'invalid_password',
            },
            EMPTY: {
                USERNAME: '',
                PASSWORD: '',
            },
        },
    },
    prod: {
        BASE_URL: 'https://www.saucedemo.com',
        CREDENTIALS: {
            VALID: {
                USERNAME: 'standard_user',
                PASSWORD: 'secret_sauce',
            },
            INVALID: {
                USERNAME: 'invalid_user',
                PASSWORD: 'invalid_password',
            },
            EMPTY: {
                USERNAME: '',
                PASSWORD: '',
            },
        },
    },
};

const ACTIVE_ENV = process.env.TEST_ENV || process.env.ENV || 'local';
const activeConfig = ENVIRONMENTS[ACTIVE_ENV];

if (!activeConfig) {
    throw new Error(
        `Unknown test environment "${ACTIVE_ENV}". Available environments: ${Object.keys(ENVIRONMENTS).join(', ')}`
    );
}

const BASE_URL = process.env.BASE_URL || activeConfig.BASE_URL;
process.env.BASE_URL = BASE_URL;

module.exports = {
    ACTIVE_ENV,
    ENVIRONMENTS,
    ...activeConfig,
    BASE_URL,
};
