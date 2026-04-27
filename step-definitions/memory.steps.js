const { When, Then } = require('@cucumber/cucumber');
const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');
const LocatorManager = require('../utils/LocatorManager');

// ─── Memory Store ────────────────────────────────────────────────────────────
// All saved values live on `this.memory` (Cucumber World) for scenario isolation

/**
 * Save the visible text of an element into memory for later assertions.
 * @example When I save the text of "OrderNumber" as "myOrder"
 */
When('I save the text of {string} as {string}', async function (key, alias) {
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = await this.page.locator(selector).innerText();
});

/**
 * Save the input value of a form field into memory.
 * @example When I save the value of "EmailField" as "savedEmail"
 */
When('I save the value of {string} as {string}', async function (key, alias) {
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = await this.page.locator(selector).inputValue();
});

/**
 * Save any attribute of an element into memory.
 * @example When I save the attribute "href" of "ProfileLink" as "profileUrl"
 */
When('I save the attribute {string} of {string} as {string}', async function (attr, key, alias) {
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = await this.page.locator(selector).getAttribute(attr);
});

/**
 * Assert that a saved value equals an expected string exactly.
 * @example Then the saved "myOrder" value should equal "ORD-12345"
 */
Then('the saved {string} value should equal {string}', function (alias, expected) {
    this.memory = this.memory || {};
    expect(this.memory[alias]).toBe(expected);
});

/**
 * Assert that a saved value contains a substring.
 * @example Then the saved "myOrder" value should contain "ORD-"
 */
Then('the saved {string} value should contain {string}', function (alias, expected) {
    this.memory = this.memory || {};
    expect(this.memory[alias]).toContain(expected);
});

// ─── Faker Test Data Generation ───────────────────────────────────────────────

/**
 * Generate a random email and fill it into a field, also save to memory.
 * @example When I generate a random email and fill "EmailField" and save as "testEmail"
 */
When('I generate a random email and fill {string} and save as {string}', async function (key, alias) {
    const email = faker.internet.email();
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = email;
    await this.page.locator(selector).fill(email);
});

/**
 * Generate a random first name and fill it into a field.
 * @example When I generate a random first name and fill "FirstNameField" and save as "testName"
 */
When('I generate a random first name and fill {string} and save as {string}', async function (key, alias) {
    const name = faker.person.firstName();
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = name;
    await this.page.locator(selector).fill(name);
});

/**
 * Generate a random last name and fill it into a field.
 * @example When I generate a random last name and fill "LastNameField" and save as "testName"
 */
When('I generate a random last name and fill {string} and save as {string}', async function (key, alias) {
    const name = faker.person.lastName();
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = name;
    await this.page.locator(selector).fill(name);
});

/**
 * Generate a random phone number and fill it into a field.
 * @example When I generate a random phone number and fill "PhoneField" and save as "testPhone"
 */
When('I generate a random phone number and fill {string} and save as {string}', async function (key, alias) {
    const phone = faker.phone.number({ style: 'national' });
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = phone;
    await this.page.locator(selector).fill(phone);
});

/**
 * Generate a random full address and fill it into a field.
 * @example When I generate a random address and fill "AddressField" and save as "testAddress"
 */
When('I generate a random address and fill {string} and save as {string}', async function (key, alias) {
    const address = faker.location.streetAddress();
    const selector = LocatorManager.getSelector(key);
    this.memory = this.memory || {};
    this.memory[alias] = address;
    await this.page.locator(selector).fill(address);
});

/**
 * Generate a random integer between min and max and save to memory.
 * @example When I generate a random number between 100 and 999 and save as "orderId"
 */
When('I generate a random number between {int} and {int} and save as {string}', function (min, max, alias) {
    this.memory = this.memory || {};
    this.memory[alias] = String(faker.number.int({ min, max }));
});

/**
 * Generate a random UUID and save to memory (useful for correlation IDs).
 * @example When I generate a random UUID and save as "correlationId"
 */
When('I generate a random UUID and save as {string}', function (alias) {
    this.memory = this.memory || {};
    this.memory[alias] = faker.string.uuid();
});

/**
 * Generate a random alphanumeric string of a given length and save to memory.
 * @example When I generate a random string of 8 characters and save as "testCode"
 */
When('I generate a random string of {int} characters and save as {string}', function (length, alias) {
    this.memory = this.memory || {};
    this.memory[alias] = faker.string.alphanumeric(length);
});

/**
 * Fill a field with today's date in YYYY-MM-DD format.
 * @example When I fill "DateField" with today's date
 */
When("I fill {string} with today's date", async function (key) {
    const today = new Date().toISOString().split('T')[0];
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).fill(today);
});

/**
 * Fill a field with the current Unix timestamp (unique value).
 * @example When I fill "ReferenceField" with current timestamp
 */
When('I fill {string} with current timestamp', async function (key) {
    const timestamp = String(Date.now());
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).fill(timestamp);
});

/**
 * Use a saved memory value to fill a field (power of state chaining).
 * @example When I fill "ConfirmEmailField" with the saved "testEmail" value
 */
When('I fill {string} with the saved {string} value', async function (key, alias) {
    this.memory = this.memory || {};
    const value = this.memory[alias];
    if (value === undefined) throw new Error(`No saved memory value found for alias "${alias}"`);
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).fill(value);
});
