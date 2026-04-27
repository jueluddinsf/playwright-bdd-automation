module.exports = {
    default: {
        // ── Feature files organized by domain ───────────────────────────────
        paths: ['features/**/*.feature'],

        require: [
            // ── Shared step library (READ-ONLY — maintained by QA Platform team)
            // DO NOT edit files inside node_modules. Raise a request to update the package.
            'node_modules/playwright-bdd-steps/src/steps/**/*.js',

            // ── Project-specific steps (app login flows, performance, custom assertions)
            // Add your own steps here — do NOT re-implement what's already in the package.
            'step-definitions/**/*.js',

            // ── Cucumber lifecycle hooks (Before/After scenario setup)
            'setup/hooks.js',
        ],
        format: ['progress', 'html:reports/report.html'],
        parallel: 1,
        timeout: 60 * 1000,
        formatOptions: {
            snippetInterface: 'async-await',
        },
    },
};
