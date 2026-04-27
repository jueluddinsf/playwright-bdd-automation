/**
 * action.steps.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Gherkin steps for ALL user interaction actions:
 * clicking, typing, selecting, scrolling, keyboard, drag & drop, iframes, etc.
 *
 * HOW TO USE:
 *   All {string} parameters refer to a KEY in your locators JSON file
 *   (e.g. locators/web.json). The framework resolves the key to a CSS/XPath
 *   selector automatically via LocatorManager — no selectors in feature files.
 *
 * EXAMPLE LOCATORS FILE (locators/web.json):
 *   {
 *     "LoginButton":   "#login-btn",
 *     "EmailField":    "input[name='email']",
 *     "SearchFrame":   "#search-iframe"
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { When } = require('@cucumber/cucumber');
const clickActions = require('../actions/ClickActions');
const inputActions = require('../actions/InputActions');
const LocatorManager = require('../utils/LocatorManager');

// ─── Click Steps ─────────────────────────────────────────────────────────────

// Click an element by its locator key.
// Usage:  When I click "LoginButton"
When('I click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector);
});

// Click an element multiple times.
// Usage:  When I click "IncrementButton" 3 times
When('I click {string} {int} times', async function (key, count) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector, { clickCount: count });
});

// Double-click an element (e.g. to select text or trigger edit mode).
// Usage:  When I double click "TableCell"
When('I double click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.doubleClick(this.page, selector);
});

// Right-click an element to open a context menu.
// Usage:  When I right click "FileItem"
When('I right click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.rightClick(this.page, selector);
});

// Click an element only if it is currently visible — skips if not present.
// Usage:  When I click "CookieBanner" if present
When('I click {string} if present', async function (key) {
    const selector = LocatorManager.getSelector(key);
    const element = this.page.locator(selector).first();
    if (await element.isVisible()) {
        await clickActions.click(this.page, selector);
    }
});

// Click any element that contains the specified visible text.
// Usage:  When I click on text "Accept All"
When('I click on text {string}', async function (text) {
    await clickActions.click(this.page, `text=${text}`);
});

// Force-click an element even if it is overlapped or hidden.
// Use as a last resort — prefer fixing the locator or wait steps first.
// Usage:  When I force click "HiddenCheckbox"
When('I force click {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector, { force: true });
});

// Click at specific pixel coordinates WITHIN an element bounding box.
// Usage:  When I click coordinates 10, 20 in "Canvas"
When('I click coordinates {int}, {int} in {string}', async function (x, y, key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.click(this.page, selector, { position: { x, y } });
});

// Click the Nth item in a list/collection (1-based index).
// Usage:  When I click the 2 item in "SearchResults"
When('I click the {int} item in {string}', async function (index, key) {
    const selector = LocatorManager.getSelector(key);
    await this.page
        .locator(selector)
        .nth(index - 1)
        .click();
});

// Click the first element in a group that contains a specific text string.
// Usage:  When I click "ProductCard" containing text "iPhone 15"
When('I click {string} containing text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).filter({ hasText: text }).first().click();
});

// ─── Type / Fill Steps ───────────────────────────────────────────────────────

// Instantly fill an input field (uses Playwright fill — clears first).
// Usage:  When I fill "EmailField" with "user@example.com"
When('I fill {string} with {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.fill(this.page, selector, value);
});

// Type into a field character-by-character (simulates real keyboard input).
// Usage:  When I type "hello world" into "SearchField"
When('I type {string} into {string}', async function (value, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.type(this.page, selector, value);
});

// Type into a field and immediately press Enter (e.g. search forms).
// Usage:  When I type "playwright" into "SearchBar" and press Enter
When('I type {string} into {string} and press Enter', async function (value, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.type(this.page, selector, value);
    await inputActions.press(this.page, selector, 'Enter');
});

// Type character-by-character with 80ms delay — triggers debounce/onChange handlers.
// Usage:  When I slowly type "hello" into "AutocompleteField"
When('I slowly type {string} into {string}', async function (value, key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).pressSequentially(value, { delay: 80 });
});

// Clear an input field completely.
// Usage:  When I clear "SearchField"
When('I clear {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.clear(this.page, selector);
});

// Clear then type into an input (atomic — prevents stale value issues).
// Usage:  When I clear "QuantityField" and type "5"
When('I clear {string} and type {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.clear(this.page, selector);
    await inputActions.type(this.page, selector, text);
});

// Clear then fill an input (uses fill for speed — does NOT simulate keystrokes).
// Usage:  When I clear "EmailField" and fill "new@example.com"
When('I clear {string} and fill {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.clear(this.page, selector);
    await inputActions.fill(this.page, selector, text);
});

// Fill a field inside an iframe.
// Usage:  When I fill "CardNumber" inside frame "PaymentFrame" with "4111111111111111"
When('I fill {string} inside frame {string} with {string}', async function (elementKey, frameKey, value) {
    const frameSelector = LocatorManager.getSelector(frameKey);
    const elementSelector = LocatorManager.getSelector(elementKey);
    const frame = this.page.frameLocator(frameSelector);
    await frame.locator(elementSelector).fill(value);
});

// Blur (unfocus) an element — triggers onBlur/onChange validation in React/Angular.
// Usage:  When I blur "EmailField"
When('I blur {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).blur();
});

// ─── Dropdown / Select Steps ─────────────────────────────────────────────────

// Select a dropdown option by its value attribute.
// Usage:  When I select option "US" from "CountryDropdown"
When('I select option {string} from {string}', async function (option, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.selectOption(this.page, selector, option);
});

// Select a dropdown option by its visible label text.
// Usage:  When I select option by text "United States" from "CountryDropdown"
When('I select option by text {string} from {string}', async function (label, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.selectOptionByLabel(this.page, selector, label);
});

// Select a dropdown option by its zero-based position index.
// Usage:  When I select option by index 2 from "CountryDropdown"
When('I select option by index {int} from {string}', async function (index, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.selectOptionByIndex(this.page, selector, index);
});

// ─── Checkbox / Radio Steps ───────────────────────────────────────────────────

// Check a checkbox or radio button.
// Usage:  When I check "TermsCheckbox"
When('I check {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.check(this.page, selector);
});

// Uncheck a checkbox.
// Usage:  When I uncheck "NewsletterCheckbox"
When('I uncheck {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.uncheck(this.page, selector);
});

// ─── File Upload ─────────────────────────────────────────────────────────────

// Upload a file by setting its path on a file input element.
// Usage:  When I upload file "fixtures/resume.pdf" to "FileUploadInput"
When('I upload file {string} to {string}', async function (filePath, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.uploadFile(this.page, selector, filePath);
});

// Trigger a file download by clicking an element and save it to disk.
// Usage:  When I save the downloaded file from "DownloadLink" as "reports/data.csv"
When('I save the downloaded file from {string} as {string}', async function (key, path) {
    const selector = LocatorManager.getSelector(key);
    const downloadPromise = this.page.waitForEvent('download');
    await clickActions.click(this.page, selector);
    const download = await downloadPromise;
    await download.saveAs(path);
});

// ─── Keyboard Steps ───────────────────────────────────────────────────────────

// Press a key on a specific element (e.g. Tab, Enter, ArrowDown).
// Usage:  When I press "ArrowDown" on "Dropdown"
When('I press {string} on {string}', async function (pressKey, key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.press(this.page, selector, pressKey);
});

// Press a key on a specific element multiple times.
// Usage:  When I press "ArrowDown" on "Dropdown" 3 times
When('I press {string} on {string} {int} times', async function (pressKey, key, count) {
    const selector = LocatorManager.getSelector(key);
    for (let i = 0; i < count; i++) {
        await inputActions.press(this.page, selector, pressKey);
    }
});

// Press a key globally (not targeted at an element). Supports combos like "Control+K".
// Usage:  When I press the "Control+K" key globally
When('I press the {string} key globally', async function (key) {
    await this.page.keyboard.press(key);
});

// Move keyboard focus forward N steps using Tab.
// Usage:  When I press Tab 3 times
When('I press Tab {int} times', async function (count) {
    for (let i = 0; i < count; i++) {
        await this.page.keyboard.press('Tab');
    }
});

// Press Escape — closes modals, dismisses dropdowns, cancels dialogs.
// Usage:  When I press Escape
When('I press Escape', async function () {
    await this.page.keyboard.press('Escape');
});

// Press Enter on a specific element to submit a form or trigger an action.
// Usage:  When I press Enter on "SearchButton"
When('I press Enter on {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).press('Enter');
});

// Hold a key down (combine with "release key" for modifier key sequences).
// Usage:  When I hold down key "Shift"
When('I hold down key {string}', async function (key) {
    await this.page.keyboard.down(key);
});

// Release a previously held key.
// Usage:  When I release key "Shift"
When('I release key {string}', async function (key) {
    await this.page.keyboard.up(key);
});

// ─── Mouse / Hover Steps ──────────────────────────────────────────────────────

// Hover over an element to reveal tooltips or dropdown menus.
// Usage:  When I hover over "UserMenuButton"
When('I hover over {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await clickActions.hover(this.page, selector);
});

// Move the mouse to absolute page coordinates (no click).
// Usage:  When I move mouse to coordinates 200, 400
When('I move mouse to coordinates {int}, {int}', async function (x, y) {
    await this.page.mouse.move(x, y);
});

// Drag an element to another element (e.g. Kanban cards, sortable lists).
// Usage:  When I drag "TodoCard" to "DoneColumn"
When('I drag {string} to {string}', async function (sourceKey, targetKey) {
    const source = LocatorManager.getSelector(sourceKey);
    const target = LocatorManager.getSelector(targetKey);
    await clickActions.dragAndDrop(this.page, source, target);
});

// ─── Focus Steps ──────────────────────────────────────────────────────────────

// Set keyboard focus on an element (does not click it).
// Usage:  When I focus on "EmailField"
When('I focus on {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.focus(this.page, selector);
});

// ─── Form Submission ─────────────────────────────────────────────────────────

// Submit a form programmatically by finding its closest <form> element.
// Usage:  When I submit the form "LoginForm"
When('I submit the form {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).evaluate((el) => {
        const form = el.closest('form') || el.querySelector('form');
        if (form) form.submit();
        else throw new Error('No form found for selector');
    });
});

// ─── Scroll Steps ─────────────────────────────────────────────────────────────

// Scroll the page so a specific element enters the viewport.
// Usage:  When I scroll to "FooterSection"
When('I scroll to {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await inputActions.scroll(this.page, selector);
});

// Scroll the page all the way to the very top.
// Usage:  When I scroll to the top of the page
When('I scroll to the top of the page', async function () {
    await this.page.evaluate(() => window.scrollTo(0, 0));
});

// Scroll the page all the way to the very bottom.
// Usage:  When I scroll to the bottom of the page
When('I scroll to the bottom of the page', async function () {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

// Scroll using the mouse wheel by exact pixel amounts.
// Usage:  When I scroll by 300 pixels vertically and 0 pixels horizontally
When('I scroll by {int} pixels vertically and {int} pixels horizontally', async function (y, x) {
    await this.page.mouse.wheel(x, y);
});

// Scroll inside a specific scrollable container element by a pixel amount.
// Usage:  When I scroll "ResultsList" by 500 pixels
When('I scroll {string} by {int} pixels', async function (key, pixels) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).evaluate((el, px) => {
        el.scrollTop += px;
    }, pixels);
});

// ─── IFrame Interaction ───────────────────────────────────────────────────────

// Click an element that lives inside an iframe.
// Usage:  When I click "SubmitButton" inside frame "PaymentFrame"
When('I click {string} inside frame {string}', async function (elementKey, frameKey) {
    const frameSelector = LocatorManager.getSelector(frameKey);
    const elementSelector = LocatorManager.getSelector(elementKey);
    const frame = this.page.frameLocator(frameSelector);
    await clickActions.click(frame, elementSelector);
});

// Type text into an element inside an iframe.
// Usage:  When I type "4111111111111111" into "CardNumberInput" inside frame "PaymentFrame"
When('I type {string} into {string} inside frame {string}', async function (value, elementKey, frameKey) {
    const frameSelector = LocatorManager.getSelector(frameKey);
    const elementSelector = LocatorManager.getSelector(elementKey);
    const frame = this.page.frameLocator(frameSelector);
    await inputActions.type(frame, elementSelector, value);
});

// ─── Timing Utilities ─────────────────────────────────────────────────────────

// Wait for an exact number of milliseconds.
// Use sparingly — prefer element-based waits in wait.steps.js instead.
// Usage:  When I wait for 500 milliseconds
When('I wait for {int} milliseconds', async function (ms) {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(ms);
});
