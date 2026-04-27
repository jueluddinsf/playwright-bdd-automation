const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LocatorManager = require('../utils/LocatorManager');

Then('I should see {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeVisible();
});

Then('I should not see {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeHidden();
});

Then('the element {string} should be visible', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeVisible();
});

Then('the element {string} should be hidden', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeHidden();
});

Then('the element {string} should be focused', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeFocused();
});

Then('the element {string} should contain text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toContainText(text);
});

Then('the element {string} should have exact text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveText(text);
});

Then('the element {string} should not contain text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toContainText(text);
});

Then('the element {string} should not have exact text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toHaveText(text);
});

Then('the element {string} should have attribute {string} with value {string}', async function (key, attr, value) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute(attr, value);
});

Then('the element {string} should be enabled', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeEnabled();
});

Then('the element {string} should be disabled', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeDisabled();
});

Then('the element {string} should be checked', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeChecked();
});

Then('I should see {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveCount(count);
});

Then('the element {string} should have value {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveValue(value);
});

Then('the element {string} should contain value {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    const inputValue = await this.page.locator(selector).inputValue();
    expect(inputValue).toContain(value);
});

Then('the element {string} should not contain value {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    const inputValue = await this.page.locator(selector).inputValue();
    expect(inputValue).not.toContain(value);
});

Then('the element {string} should have class {string}', async function (key, className) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveClass(new RegExp(className));
});

Then('the url should be {string}', async function (url) {
    await expect(this.page).toHaveURL(url);
});

Then('the element {string} should be editable', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeEditable();
});

Then('the element {string} should not be editable', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeEditable();
});

Then('the element {string} should have attribute {string}', async function (key, attr) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute(attr, /.*/);
});

Then('the element {string} should not have attribute {string}', async function (key, attr) {
    const selector = LocatorManager.getSelector(key);
    const hasAttr = await this.page.locator(selector).evaluate((el, a) => el.hasAttribute(a), attr);
    expect(hasAttr).toBe(false);
});

Then('I should see text {string}', async function (text) {
    await expect(this.page.locator('body')).toContainText(text);
});

Then('I should not see text {string}', async function (text) {
    await expect(this.page.locator('body')).not.toContainText(text);
});
