const { When } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LocatorManager = require('../utils/LocatorManager');

When('I wait for {int} seconds', async function (seconds) {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(seconds * 1000);
});

When('I wait for {string} to be visible', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'visible' });
});

When('I wait for {string} to be hidden', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'hidden' });
});

When('I wait for {string} to be attached', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'attached' });
});

When('I wait for {string} to be detached', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'detached' });
});

When('I wait for text {string} to appear', async function (text) {
    await this.page.locator('body').waitFor({ state: 'visible' });
    await expect(this.page.locator('body')).toContainText(text, { timeout: 15000 });
});
