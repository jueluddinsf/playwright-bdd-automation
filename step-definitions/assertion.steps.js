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

Then('the element {string} should be in the viewport', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeInViewport();
});

Then('the element {string} should not be in the viewport', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeInViewport();
});

Then('the element {string} css property {string} should be {string}', async function (key, property, value) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveCSS(property, value);
});

Then('the element {string} should not be checked', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeChecked();
});

Then('the element {string} should not be focused', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeFocused();
});

Then('the element {string} should be empty', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeEmpty();
});

Then('the element {string} should not be empty', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeEmpty();
});

Then('I should see more than {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    const actual = await this.page.locator(selector).count();
    expect(actual).toBeGreaterThan(count);
});

Then('I should see fewer than {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    const actual = await this.page.locator(selector).count();
    expect(actual).toBeLessThan(count);
});

Then('I should see at least {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    const actual = await this.page.locator(selector).count();
    expect(actual).toBeGreaterThanOrEqual(count);
});

// ─── Accessibility Assertions ───────────────────────────────────────────────────

/**
 * Assert the placeholder text of a form input.
 * @example Then the element "SearchField" placeholder should be "Search here..."
 */
Then('the element {string} placeholder should be {string}', async function (key, placeholder) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('placeholder', placeholder);
});

/**
 * Assert the ARIA role of an element for accessibility compliance.
 * @example Then the element "SubmitButton" should have role "button"
 */
Then('the element {string} should have role {string}', async function (key, role) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('role', role);
});

/**
 * Assert the aria-label of an element.
 * @example Then the element "CloseIcon" should have aria-label "Close dialog"
 */
Then('the element {string} should have aria-label {string}', async function (key, label) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('aria-label', label);
});

/**
 * Assert the tab index of an element (useful for keyboard navigation testing).
 * @example Then the element "SkipLink" should have tabindex "0"
 */
Then('the element {string} should have tabindex {string}', async function (key, tabindex) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('tabindex', tabindex);
});

// ─── IFrame Assertions ─────────────────────────────────────────────────────

Then('the element {string} inside frame {string} should be visible', async function (elementKey, frameKey) {
    const frameSelector = LocatorManager.getSelector(frameKey);
    const elementSelector = LocatorManager.getSelector(elementKey);
    await expect(this.page.frameLocator(frameSelector).locator(elementSelector)).toBeVisible();
});

Then(
    'the element {string} inside frame {string} should have text {string}',
    async function (elementKey, frameKey, text) {
        const frameSelector = LocatorManager.getSelector(frameKey);
        const elementSelector = LocatorManager.getSelector(elementKey);
        await expect(this.page.frameLocator(frameSelector).locator(elementSelector)).toHaveText(text);
    }
);

Then(
    'the element {string} inside frame {string} should contain text {string}',
    async function (elementKey, frameKey, text) {
        const frameSelector = LocatorManager.getSelector(frameKey);
        const elementSelector = LocatorManager.getSelector(elementKey);
        await expect(this.page.frameLocator(frameSelector).locator(elementSelector)).toContainText(text);
    }
);

// ─── Visual Regression ─────────────────────────────────────────────────────

Then('the page screenshot should match {string}', async function (snapshotName) {
    await expect(this.page).toHaveScreenshot(snapshotName);
});

Then('the element {string} screenshot should match {string}', async function (key, snapshotName) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveScreenshot(snapshotName);
});
