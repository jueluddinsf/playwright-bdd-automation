const { Given, Then, When } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const env = require('../config/env');

Given('I navigate to {string}', async function (url) {
    const targetUrl = env[url] || url;
    await this.page.goto(targetUrl);
});

Given('I am on the {string} page', async function (pagePath) {
    const baseUrl = env.BASE_URL || '';
    // Allows either a known env key (e.g. 'LOGIN') or a relative path (e.g. '/dashboard')
    const targetUrl = env[pagePath.toUpperCase()] || `${baseUrl}${pagePath}`;
    await this.page.goto(targetUrl);
});

Given('I navigate to the {string} url path', async function (path) {
    const baseUrl = env.BASE_URL || '';
    await this.page.goto(`${baseUrl}${path}`);
});

When('I go back', async function () {
    await this.page.goBack();
});

When('I go forward', async function () {
    await this.page.goForward();
});

When('I reload the page', async function () {
    await this.page.reload();
});

When('I accept the alert', async function () {
    this.page.once('dialog', (dialog) => dialog.accept());
});

When('I dismiss the alert', async function () {
    this.page.once('dialog', (dialog) => dialog.dismiss());
});

When('I take a screenshot', async function () {
    await this.page.screenshot({ path: `reports/screenshot-${Date.now()}.png` });
});

Then('the url should contain {string}', async function (text) {
    await expect(this.page).toHaveURL(new RegExp(text));
});

Then('the page title should be {string}', async function (title) {
    await expect(this.page).toHaveTitle(title);
});

Then('the page title should contain {string}', async function (text) {
    const title = await this.page.title();
    expect(title).toContain(text);
});

When('I wait for the page to load', async function () {
    await this.page.waitForLoadState('load');
});

When('I wait for network to be idle', async function () {
    // eslint-disable-next-line playwright/no-networkidle
    await this.page.waitForLoadState('networkidle');
});

When('I wait for the DOM to be ready', async function () {
    await this.page.waitForLoadState('domcontentloaded');
});
