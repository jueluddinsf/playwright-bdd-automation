const { When } = require('@cucumber/cucumber');
const LocatorManager = require('../utils/LocatorManager');

When('I wait for {int} seconds', async function (seconds) {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(seconds * 1000);
});

When('I wait for {string} to be visible', async function (key) {
    const selector = LocatorManager.getSelector(key);
    // eslint-disable-next-line playwright/no-wait-for-selector
    await this.page.waitForSelector(selector, { state: 'visible' });
});

When('I wait for {string} to be hidden', async function (key) {
    const selector = LocatorManager.getSelector(key);
    // eslint-disable-next-line playwright/no-wait-for-selector
    await this.page.waitForSelector(selector, { state: 'hidden' });
});

When('I wait for {string} to be attached', async function (key) {
    const selector = LocatorManager.getSelector(key);
    // eslint-disable-next-line playwright/no-wait-for-selector
    await this.page.waitForSelector(selector, { state: 'attached' });
});

When('I wait for {string} to be detached', async function (key) {
    const selector = LocatorManager.getSelector(key);
    // eslint-disable-next-line playwright/no-wait-for-selector
    await this.page.waitForSelector(selector, { state: 'detached' });
});
