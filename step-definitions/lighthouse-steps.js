const { Then } = require('@cucumber/cucumber');
const { playAudit } = require('playwright-lighthouse');

Then('the lighthouse metrics should be above the following thresholds:', { timeout: 120000 }, async function (dataTable) {
    // Convert cucumber datatable to thresholds object: { performance: 40, accessibility: 80, etc }
    const thresholds = {};
    dataTable.hashes().forEach(row => {
        thresholds[row.category] = parseInt(row.value, 10);
    });

    // Since we run headless:false by default, we use 9222.
    await playAudit({
        page: this.page,
        thresholds: thresholds,
        port: 9222,
        reports: {
            formats: {
                html: true, // Creates an HTML report
            },
            name: `lighthouse-${Date.now()}`,
            directory: `${process.cwd()}/lighthouse-reports`,
        },
    });
});
