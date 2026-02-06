const { Given, Then, When } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const env = require('../config/env');

Given('I navigate to {string}', async function (url) {
    const targetUrl = env[url] || url;
    await this.page.goto(targetUrl);
});

Given('I am on the {string} page', async function (pageName) {
    if (pageName.toLowerCase() === 'login') {
        await this.page.goto(env.BASE_URL);
    } else {
        await this.page.goto(env.BASE_URL);
    }
});

When('I go back', async function () {
    await this.page.goBack();
});

When('I reload the page', async function () {
    await this.page.reload();
});

When('I accept the alert', async function () {
    this.page.once('dialog', dialog => dialog.accept());
});

When('I dismiss the alert', async function () {
    this.page.once('dialog', dialog => dialog.dismiss());
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
