/**
 * wait.steps.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Gherkin steps for waiting and synchronization.
 *
 * BEST PRACTICE:
 *   Prefer element-based waits over fixed time waits.
 *   Use "I wait for {element} to be visible" instead of "I wait for N seconds".
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { When } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LocatorManager = require('../utils/LocatorManager');

// Wait a fixed number of seconds. Use sparingly — prefer element-based waits.
// Usage:  When I wait for 2 seconds
When('I wait for {int} seconds', async function (seconds) {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(seconds * 1000);
});

// Wait until a specific element becomes visible on the page.
// Usage:  When I wait for "SuccessBanner" to be visible
When('I wait for {string} to be visible', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'visible' });
});

// Wait until a specific element is no longer visible (e.g. spinner disappears).
// Usage:  When I wait for "LoadingSpinner" to be hidden
When('I wait for {string} to be hidden', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'hidden' });
});

// Wait until an element is present in the DOM (even if not visible yet).
// Usage:  When I wait for "DropdownMenu" to be attached
When('I wait for {string} to be attached', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'attached' });
});

// Wait until an element is completely removed from the DOM.
// Usage:  When I wait for "ModalOverlay" to be detached
When('I wait for {string} to be detached', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).waitFor({ state: 'detached' });
});

// Wait for a specific text string to appear anywhere on the page (15s timeout).
// Usage:  When I wait for text "Order placed successfully" to appear
When('I wait for text {string} to appear', async function (text) {
    await this.page.locator('body').waitFor({ state: 'visible' });
    await expect(this.page.locator('body')).toContainText(text, { timeout: 15000 });
});
