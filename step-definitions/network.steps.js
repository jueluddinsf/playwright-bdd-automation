const { When } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

// ─── Network Mocking & Interception ──────────────────────────────────────────
// Simulate backend responses without needing a real API running.

// Mock an API endpoint — returns a custom JSON body.
When('I mock the API endpoint {string} with body {string}', async function (urlPattern, body) {
    await this.page.route(urlPattern, (route) => {
        route.fulfill({ status: 200, contentType: 'application/json', body });
    });
});

// Mock an API endpoint — returns a specific HTTP status code.
When('I mock the API endpoint {string} with status {int}', async function (urlPattern, status) {
    await this.page.route(urlPattern, (route) => {
        route.fulfill({ status });
    });
});

// Mock an API endpoint — loads the response body from a JSON fixture file.
When('I mock the API endpoint {string} with response from {string}', async function (urlPattern, filePath) {
    const fullPath = path.resolve(process.cwd(), filePath);
    const body = fs.readFileSync(fullPath, 'utf-8');
    await this.page.route(urlPattern, (route) => {
        route.fulfill({ status: 200, contentType: 'application/json', body });
    });
});

// Intercept a URL pattern and stub the response body.
When('I intercept URL {string} and stub body {string}', async function (urlPattern, body) {
    await this.page.route(urlPattern, (route) => {
        route.fulfill({ status: 200, contentType: 'application/json', body });
    });
});

// Abort all requests to a URL pattern (simulate network failure / offline).
When('I block requests to {string}', async function (urlPattern) {
    await this.page.route(urlPattern, (route) => route.abort());
});

// Remove all previously set route intercepts / mocks.
When('I remove all route mocks', async function () {
    await this.page.unrouteAll();
});

// Wait for a browser request to match a URL pattern.
When('I wait for a request to {string}', async function (urlPattern) {
    this.lastRequest = await this.page.waitForRequest(urlPattern);
});

// Wait for a response from a URL pattern and store it.
When('I wait for a response from {string}', async function (urlPattern) {
    this.lastResponse = await this.page.waitForResponse(urlPattern);
});

// Wait for the page URL to contain a specific substring.
When('I wait for URL to contain {string}', async function (urlSubstring) {
    await this.page.waitForURL(new RegExp(urlSubstring));
});
