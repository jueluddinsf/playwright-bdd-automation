const { Given, When, Then } = require('@cucumber/cucumber');
const { expect, request } = require('@playwright/test');

let apiContext;
let apiResponse;
let responseBody;
let requestBody = {};
let responseStatus;

Given('I set the request body to:', function (docString) {
    requestBody = JSON.parse(docString);
});

Given('I send a {string} request to {string}', async function (method, endpoint) {
    apiContext = await request.newContext();
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (method.toUpperCase() === 'GET') {
        apiResponse = await apiContext.get(endpoint, { headers });
    } else if (method.toUpperCase() === 'POST') {
        apiResponse = await apiContext.post(endpoint, {
            headers: headers,
            data: requestBody,
        });
    } else if (method.toUpperCase() === 'PUT') {
        apiResponse = await apiContext.put(endpoint, {
            headers: headers,
            data: requestBody,
        });
    } else if (method.toUpperCase() === 'DELETE') {
        apiResponse = await apiContext.delete(endpoint, { headers });
    } else {
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    responseStatus = apiResponse.status();
    try {
        responseBody = await apiResponse.json();
    } catch (e) {
        // response might be empty or not json ok
        responseBody = null;
    }
});

Then('the response status should be {int}', async function (statusCode) {
    expect(responseStatus).toBe(statusCode);
});

Then('the response should contain {string} with value {string}', async function (key, expectedValue) {
    expect(responseBody).toBeDefined();
    // Convert both to string for basic assertion generic matching
    expect(String(responseBody[key])).toBe(expectedValue);
});

Then('the response should contain {string}', async function (key) {
    expect(responseBody).toHaveProperty(key);
});
