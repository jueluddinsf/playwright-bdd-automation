/**
 * api-steps.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Gherkin steps for REST API testing.
 * Supports GET, POST, PUT, PATCH, DELETE with full request/response assertions.
 *
 * HOW TO USE:
 *   Use these steps to validate backend APIs directly — no browser needed.
 *   All state (request body, headers, response) is stored on `this` (Cucumber
 *   World) so it is fully isolated between scenarios.
 *
 * EXAMPLE SCENARIO:
 *   Given I set the request body to:
 *     """
 *     { "name": "John", "job": "Developer" }
 *     """
 *   And I set request header "Authorization" to "Bearer my-token"
 *   When I send a "POST" request to "https://reqres.in/api/users"
 *   Then the response status should be 201
 *   And the response should contain "name" with value "John"
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { Given, Then } = require('@cucumber/cucumber');
const { expect, request } = require('@playwright/test');

// Set a JSON request body using a Gherkin docstring block.
// Usage:
//   Given I set the request body to:
//     """
//     { "username": "admin", "password": "secret" }
//     """
Given('I set the request body to:', function (docString) {
    this.requestBody = JSON.parse(docString);
});

// Add a custom HTTP header to the next API request.
// Use for Authorization tokens, API keys, correlation IDs, etc.
// Usage:  Given I set request header "Authorization" to "Bearer abc123"
Given('I set request header {string} to {string}', function (name, value) {
    if (!this.requestHeaders) this.requestHeaders = {};
    this.requestHeaders[name] = value;
});

// Send an HTTP request to a given URL. Supports GET, POST, PUT, PATCH, DELETE.
// Stores the response status and parsed JSON body for use in assertion steps.
// Usage:  When I send a "GET" request to "https://api.example.com/users"
// Usage:  When I send a "POST" request to "https://api.example.com/users"
Given('I send a {string} request to {string}', async function (method, endpoint) {
    this.apiContext = await request.newContext();

    let data = this.requestBody || {};
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(this.requestHeaders || {}),
    };

    if (method.toUpperCase() === 'GET') {
        this.apiResponse = await this.apiContext.get(endpoint, { headers });
    } else if (method.toUpperCase() === 'POST') {
        this.apiResponse = await this.apiContext.post(endpoint, { headers, data });
    } else if (method.toUpperCase() === 'PUT') {
        this.apiResponse = await this.apiContext.put(endpoint, { headers, data });
    } else if (method.toUpperCase() === 'PATCH') {
        this.apiResponse = await this.apiContext.patch(endpoint, { headers, data });
    } else if (method.toUpperCase() === 'DELETE') {
        this.apiResponse = await this.apiContext.delete(endpoint, { headers });
    } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    this.responseStatus = this.apiResponse.status();
    try {
        this.responseBody = await this.apiResponse.json();
    } catch {
        // Response might be empty or non-JSON (e.g. 204 No Content)
        this.responseBody = null;
    }
});

// Assert the HTTP response status code is exactly the expected value.
// Usage:  Then the response status should be 200
// Usage:  Then the response status should be 201
// Usage:  Then the response status should be 404
Then('the response status should be {int}', async function (statusCode) {
    expect(this.responseStatus).toBe(statusCode);
});

// Assert the HTTP response status code is NOT a specific value.
// Usage:  Then the response status should not be 500
Then('the response status should not be {int}', async function (statusCode) {
    expect(this.responseStatus).not.toBe(statusCode);
});

// Assert the JSON response body contains a top-level key with a specific value.
// Both key and value are matched as strings.
// Usage:  Then the response should contain "name" with value "John"
Then('the response should contain {string} with value {string}', async function (key, expectedValue) {
    expect(this.responseBody).toBeDefined();
    expect(String(this.responseBody[key])).toBe(expectedValue);
});

// Assert the JSON response body contains a specific top-level key (any value).
// Usage:  Then the response should contain "id"
Then('the response should contain {string}', async function (key) {
    expect(this.responseBody).toHaveProperty(key);
});

// Assert a response header has a specific value (case-insensitive header name).
// Usage:  Then the response header "content-type" should be "application/json; charset=utf-8"
Then('the response header {string} should be {string}', async function (headerName, expectedValue) {
    const headers = await this.apiResponse.headersArray();
    const header = headers.find((h) => h.name.toLowerCase() === headerName.toLowerCase());
    expect(header).toBeDefined();
    expect(header.value).toBe(expectedValue);
});

// Assert the raw response body text contains a substring.
// Useful for non-JSON responses (HTML, plain text, XML).
// Usage:  Then the response body should contain text "success"
Then('the response body should contain text {string}', async function (text) {
    const body = await this.apiResponse.text();
    expect(body).toContain(text);
});
