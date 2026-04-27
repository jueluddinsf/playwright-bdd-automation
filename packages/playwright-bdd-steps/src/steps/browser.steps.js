/**
 * browser.steps.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Gherkin steps for browser-level management:
 * tabs, dialogs/alerts, cookies, local/session storage, and viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { When } = require('@cucumber/cucumber');

// ─── Tab / Window Management ──────────────────────────────────────────────────

// Open a new blank tab in the current browser context.
// Usage:  When I open a new tab
When('I open a new tab', async function () {
    await this.page.evaluate(() => {
        window.open('about:blank', '_blank');
    });
});

// Close the current tab and switch focus back to the first remaining tab.
// Usage:  When I close the current tab
When('I close the current tab', async function () {
    await this.page.close();
    const pages = this.context.pages();
    if (pages.length > 0) {
        this.page = pages[0];
        await this.page.bringToFront();
    }
});

// Switch focus to a specific tab by its 1-based index.
// Usage:  When I switch to tab 2
When('I switch to tab {int}', async function (index) {
    const pages = this.context.pages();
    if (pages.length >= index) {
        this.page = pages[index - 1];
        await this.page.bringToFront();
    } else {
        throw new Error(`Tab at index ${index} does not exist. Only ${pages.length} tabs open.`);
    }
});

// Switch focus to the most recently opened tab.
// Usage:  When I switch to the last opened tab
When('I switch to the last opened tab', async function () {
    const pages = this.context.pages();
    this.page = pages[pages.length - 1];
    await this.page.bringToFront();
});

// Open a URL in a brand new tab and switch context to it automatically.
// Usage:  When I open "https://example.com" in a new tab
When('I open {string} in a new tab', async function (url) {
    const newPage = await this.context.newPage();
    await newPage.goto(url);
    this.page = newPage;
});

// Wait for a new tab to open (triggered by a link or button click) then switch to it.
// Use BEFORE the action that opens the new tab.
// Usage:  When I wait for a new tab to open
When('I wait for a new tab to open', async function () {
    const newPage = await this.context.waitForEvent('page');
    await newPage.waitForLoadState();
    this.page = newPage;
});

// ─── Dialog / Alert Handling ─────────────────────────────────────────────────
// IMPORTANT: Call these steps BEFORE the action that triggers the dialog.

// Accept the next browser alert, confirm, or prompt dialog.
// Usage:  When I accept the next alert
When('I accept the next alert', async function () {
    this.page.once('dialog', async (dialog) => {
        await dialog.accept();
    });
});

// Dismiss the next browser alert or confirm dialog.
// Usage:  When I dismiss the next alert
When('I dismiss the next alert', async function () {
    this.page.once('dialog', async (dialog) => {
        await dialog.dismiss();
    });
});

// Type text into the next prompt dialog then accept it.
// Usage:  When I type "John" into the next alert
When('I type {string} into the next alert', async function (text) {
    this.page.once('dialog', async (dialog) => {
        await dialog.accept(text);
    });
});

// ─── Cookie Management ────────────────────────────────────────────────────────

// Clear all cookies from the browser context (full logout simulation).
// Usage:  When I clear cookies
When('I clear cookies', async function () {
    await this.context.clearCookies();
});

// Set a specific cookie on the current page's domain.
// Usage:  When I set "auth_token" cookie to "eyJhbGciOiJIUzI1NiJ9"
When('I set {string} cookie to {string}', async function (name, value) {
    const url = this.page.url();
    await this.context.addCookies([{ name, value, url }]);
});

// Read a cookie's value and store it in this.storedValue for later use.
// Usage:  When I get the "session_id" cookie value
When('I get the {string} cookie value', async function (name) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find((c) => c.name === name);
    this.storedValue = cookie ? cookie.value : null;
});

// ─── Local Storage Management ─────────────────────────────────────────────────

// Clear all items from the browser's localStorage.
// Usage:  When I clear local storage
When('I clear local storage', async function () {
    await this.page.evaluate(() => window.localStorage.clear());
});

// Set a localStorage key/value pair on the current page.
// Usage:  When I set "featureFlag" local storage value to "enabled"
When('I set {string} local storage value to {string}', async function (key, value) {
    await this.page.evaluate(
        ({ k, v }) => {
            window.localStorage.setItem(k, v);
        },
        { k: key, v: value }
    );
});

// Read a localStorage value and store it in this.storedValue for later use.
// Usage:  When I get the "featureFlag" local storage value
When('I get the {string} local storage value', async function (key) {
    this.storedValue = await this.page.evaluate((k) => window.localStorage.getItem(k), key);
});

// ─── Session Storage Management ───────────────────────────────────────────────

// Clear all items from the browser's sessionStorage.
// Usage:  When I clear session storage
When('I clear session storage', async function () {
    await this.page.evaluate(() => window.sessionStorage.clear());
});

// ─── Viewport / Window Size ───────────────────────────────────────────────────

// Resize the browser window to specific pixel dimensions.
// Usage:  When I set window size to 1280 by 720
When('I set window size to {int} by {int}', async function (width, height) {
    await this.page.setViewportSize({ width, height });
});
