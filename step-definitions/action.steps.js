const { When } = require('@cucumber/cucumber');
const clickActions = require('../actions/ClickActions');
const inputActions = require('../actions/InputActions');
const LocatorManager = require('../utils/LocatorManager');

When('I click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector);
});

When('I click {string} {int} times', async function (key, count) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector, { clickCount: count });
});

When('I double click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.doubleClick(this.page, selector);
});

When('I right click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.rightClick(this.page, selector);
});

When('I click {string} if present', async function (key) {
    const selector = LocatorManager.getSelector(key);
    const element = this.page.locator(selector).first();
    if (await element.isVisible()) {
        await clickActions.click(this.page, selector);
    }
});

When('I click on text {string}', async function (text) {
    await clickActions.click(this.page, `text=${text}`);
});

When('I fill {string} with {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.fill(this.page, selector, value);
});

When('I type {string} into {string}', async function (value, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.type(this.page, selector, value);
});

When('I type {string} into {string} and press Enter', async function (value, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.type(this.page, selector, value);
    await inputActions.press(this.page, selector, 'Enter');
});

When('I clear {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.clear(this.page, selector);
});

When('I clear {string} and type {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.clear(this.page, selector);
    await inputActions.type(this.page, selector, text);
});

When('I clear {string} and fill {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.clear(this.page, selector);
    await inputActions.fill(this.page, selector, text);
});

When('I select option {string} from {string}', async function (option, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.selectOption(this.page, selector, option);
});

When('I select option by text {string} from {string}', async function (label, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.selectOptionByLabel(this.page, selector, label);
});

When('I select option by index {int} from {string}', async function (index, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.selectOptionByIndex(this.page, selector, index);
});

When('I check {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.check(this.page, selector);
});

When('I uncheck {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.uncheck(this.page, selector);
});

When('I upload file {string} to {string}', async function (filePath, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.uploadFile(this.page, selector, filePath);
});

When('I press {string} on {string}', async function (pressKey, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.press(this.page, selector, pressKey);
});

When('I press {string} on {string} {int} times', async function (pressKey, key, count) {
    const selector = LocatorManager.getSelector(key);
    for (let i = 0; i < count; i++) {
        await inputActions.press(this.page, selector, pressKey);
    }
});

When('I hover over {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.hover(this.page, selector);
});

When('I drag {string} to {string}', async function (sourceKey, targetKey) {
    const source = LocatorManager.getSelector(sourceKey);
    const target = LocatorManager.getSelector(targetKey);
    await clickActions.dragAndDrop(this.page, source, target);
});

When('I scroll to {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.scroll(this.page, selector);
});

When('I focus on {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.focus(this.page, selector);
});

When('I force click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector, { force: true });
});

When('I click coordinates {int}, {int} in {string}', async function (x, y, key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector, { position: { x, y } });
});

When('I scroll to the top of the page', async function () {
    await this.page.evaluate(() => window.scrollTo(0, 0));
});

When('I scroll to the bottom of the page', async function () {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

When('I scroll by {int} pixels vertically and {int} pixels horizontally', async function (y, x) {
    await this.page.mouse.wheel(x, y);
});

When('I save the downloaded file from {string} as {string}', async function (key, path) {
    const selector = LocatorManager.getSelector(key);
    const downloadPromise = this.page.waitForEvent('download');
    await clickActions.click(this.page, selector);
    const download = await downloadPromise;
    await download.saveAs(path);
});

When('I click {string} inside frame {string}', async function (elementKey, frameKey) {
    const frameSelector = LocatorManager.getSelector(frameKey);
    const elementSelector = LocatorManager.getSelector(elementKey);
    const frame = this.page.frameLocator(frameSelector);
    await clickActions.click(frame, elementSelector);
});

When('I type {string} into {string} inside frame {string}', async function (value, elementKey, frameKey) {
    const frameSelector = LocatorManager.getSelector(frameKey);
    const elementSelector = LocatorManager.getSelector(elementKey);
    const frame = this.page.frameLocator(frameSelector);
    await inputActions.type(frame, elementSelector, value);
});

When('I press the {string} key globally', async function (key) {
    await this.page.keyboard.press(key);
});

// ─── List / Collection Interactions ──────────────────────────────────────────

/**
 * Click the Nth element in a collection (1-based index).
 * @example When I click the 3rd item in "SearchResults"
 */
When('I click the {int} item in {string}', async function (index, key) {
    const selector = LocatorManager.getSelector(key);
    await this.page
        .locator(selector)
        .nth(index - 1)
        .click();
});

/**
 * Click the first element in a collection that contains specific visible text.
 * @example When I click "ProductCard" containing text "iPhone 15"
 */
When('I click {string} containing text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).filter({ hasText: text }).first().click();
});

/**
 * Scroll inside a specific overflow container by a pixel offset.
 * @example When I scroll "ResultsList" by 500 pixels
 */
When('I scroll {string} by {int} pixels', async function (key, pixels) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).evaluate((el, px) => {
        el.scrollTop += px;
    }, pixels);
});

// ─── Debounce-safe Typing ─────────────────────────────────────────────────────

/**
 * Type character-by-character with a delay — triggers onChange/debounce handlers.
 * @example When I slowly type "hello" into "SearchField"
 */
When('I slowly type {string} into {string}', async function (value, key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).pressSequentially(value, { delay: 80 });
});

// ─── Keyboard Navigation ──────────────────────────────────────────────────────

/**
 * Move keyboard focus forward N times using the Tab key.
 * @example When I press Tab 3 times
 */
When('I press Tab {int} times', async function (count) {
    for (let i = 0; i < count; i++) {
        await this.page.keyboard.press('Tab');
    }
});

/**
 * Press Escape — closes modals, dropdowns, and overlays.
 * @example When I press Escape
 */
When('I press Escape', async function () {
    await this.page.keyboard.press('Escape');
});

/**
 * Press Enter on a specific element — triggers form submission or button actions.
 * @example When I press Enter on "SearchButton"
 */
When('I press Enter on {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).press('Enter');
});
