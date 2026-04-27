const { Given, Then } = require('@cucumber/cucumber');
const { expect, request } = require('@playwright/test');

Given('I set the request body to:', function (docString) {
    this.requestBody = JSON.parse(docString);
});

Given('I send a {string} request to {string}', async function (method, endpoint) {
    this.apiContext = await request.newContext();
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    let data = this.requestBody || {};

    if (method.toUpperCase() === 'GET') {
        this.apiResponse = await this.apiContext.get(endpoint, { headers });
    } else if (method.toUpperCase() === 'POST') {
        this.apiResponse = await this.apiContext.post(endpoint, {
            headers: headers,
            data: data,
        });
    } else if (method.toUpperCase() === 'PUT') {
        this.apiResponse = await this.apiContext.put(endpoint, {
            headers: headers,
            data: data,
        });
    } else if (method.toUpperCase() === 'DELETE') {
        this.apiResponse = await this.apiContext.delete(endpoint, { headers });
    } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    this.responseStatus = this.apiResponse.status();
    try {
        this.responseBody = await this.apiResponse.json();
    } catch {
        // response might be empty or not json ok
        this.responseBody = null;
    }
});

Then('the response status should be {int}', async function (statusCode) {
    expect(this.responseStatus).toBe(statusCode);
});

Then('the response should contain {string} with value {string}', async function (key, expectedValue) {
    expect(this.responseBody).toBeDefined();
    // Convert both to string for basic assertion generic matching
    expect(String(this.responseBody[key])).toBe(expectedValue);
});

Then('the response should contain {string}', async function (key) {
    expect(this.responseBody).toHaveProperty(key);
});
