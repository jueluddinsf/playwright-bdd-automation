/**
 * navigation.steps.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Gherkin steps for page navigation, browser history,
 * screenshots, alerts, URL/title assertions, and page load waits.
 *
 * HOW TO USE:
 *   {string} URL parameters can be:
 *   - A full URL:            "https://example.com"
 *   - A BASE_URL env key:    "LOGIN" (resolves to env.LOGIN)
 *   - A relative path:       "/dashboard" (appended to BASE_URL)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { Given, When } = require('@cucumber/cucumber');

// Navigate to a full URL or a process.env key (e.g. BASE_URL, LOGIN_URL).
// Usage:  Given I navigate to "https://example.com"
// Usage:  Given I navigate to "LOGIN_URL"   (reads process.env.LOGIN_URL)
Given('I navigate to {string}', async function (url) {
    const targetUrl = process.env[url] || url;
    await this.page.goto(targetUrl);
});

// Navigate to a named page — resolves a process.env key OR appends to BASE_URL.
// Usage:  Given I am on the "login" page         → goes to process.env.BASE_URL + /login
// Usage:  Given I am on the "LOGIN_URL" page     → goes to process.env.LOGIN_URL
Given('I am on the {string} page', async function (pagePath) {
    const baseUrl = process.env.BASE_URL || '';
    const targetUrl = process.env[pagePath.toUpperCase()] || `${baseUrl}${pagePath}`;
    await this.page.goto(targetUrl);
});

// Navigate to a relative path appended to the BASE_URL from your .env file.
// Usage:  Given I navigate to the "/dashboard" url path
// Usage:  Given I navigate to the "/admin/reports" url path
Given('I navigate to the {string} url path', async function (urlPath) {
    const baseUrl = process.env.BASE_URL || '';
    await this.page.goto(`${baseUrl}${urlPath}`);
});

// Click the browser Back button (go to the previous page in history).
// Usage:  When I go back
When('I go back', async function () {
    await this.page.goBack();
});

// Click the browser Forward button (go to the next page in history).
// Usage:  When I go forward
When('I go forward', async function () {
    await this.page.goForward();
});

// Reload/refresh the current page.
// Usage:  When I reload the page
When('I reload the page', async function () {
    await this.page.reload();
});

// Register a one-time listener to ACCEPT the next browser alert/confirm dialog.
// Must be called BEFORE the action that triggers the dialog.
// Usage:  When I accept the alert
When('I accept the alert', async function () {
    this.page.once('dialog', (dialog) => dialog.accept());
});

// Register a one-time listener to DISMISS the next browser alert/confirm dialog.
// Usage:  When I dismiss the alert
When('I dismiss the alert', async function () {
    this.page.once('dialog', (dialog) => dialog.dismiss());
});

// Take a screenshot and save it to the reports/ folder with a timestamp.
// Usage:  When I take a screenshot
When('I take a screenshot', async function () {
    await this.page.screenshot({ path: `reports/screenshot-${Date.now()}.png` });
});

// ─── Page Load State Waits ────────────────────────────────────────────────────

// Wait for the page "load" event (all resources including images loaded).
// Usage:  When I wait for the page to load
When('I wait for the page to load', async function () {
    await this.page.waitForLoadState('load');
});

// Wait for the network to become completely idle (no pending requests).
// Use for SPAs after navigation or heavy AJAX calls. Use sparingly.
// Usage:  When I wait for network to be idle
When('I wait for network to be idle', async function () {
    // eslint-disable-next-line playwright/no-networkidle
    await this.page.waitForLoadState('networkidle');
});

// Wait for the DOM to be parsed and ready (faster than full page load).
// Usage:  When I wait for the DOM to be ready
When('I wait for the DOM to be ready', async function () {
    await this.page.waitForLoadState('domcontentloaded');
});
