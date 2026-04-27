const { When } = require('@cucumber/cucumber');

// ─── Semantic Role-Based Locators ─────────────────────────────────────────────
// These use Playwright's preferred getBy* locator APIs, which are resilient
// to DOM structure changes and align with ARIA accessibility standards.

/**
 * Click a button by its visible label/name.
 * @example When I click on button "Submit"
 */
When('I click on button {string}', async function (name) {
    await this.page.getByRole('button', { name }).click();
});

/**
 * Click a link by its visible text.
 * @example When I click on link "Home"
 */
When('I click on link {string}', async function (name) {
    await this.page.getByRole('link', { name }).click();
});

/**
 * Click a form element associated with a label.
 * @example When I click on label "Remember me"
 */
When('I click on label {string}', async function (name) {
    await this.page.getByLabel(name).click();
});

/**
 * Click on element by its exact visible text (case-sensitive, full match).
 * @example When I click on exact text "Sign In"
 */
When('I click on exact text {string}', async function (text) {
    await this.page.getByText(text, { exact: true }).click();
});

/**
 * Double-click on an element by its visible text.
 * @example When I double click on text "Select Me"
 */
When('I double click on text {string}', async function (text) {
    await this.page.getByText(text).dblclick();
});

/**
 * Right-click on an element by its visible text (opens context menu).
 * @example When I right click on text "File"
 */
When('I right click on text {string}', async function (text) {
    await this.page.getByText(text).click({ button: 'right' });
});

/**
 * Find an element by its data-testid attribute and store it in context.
 * @example When I find element by testid "user-profile"
 */
When('I find element by testid {string}', async function (testid) {
    this.element = this.page.getByTestId(testid);
});

/**
 * Find an element by its ARIA role and store it in context.
 * @example When I find element by role "dialog"
 */
When('I find element by role {string}', async function (role) {
    this.element = this.page.getByRole(role);
});

/**
 * Click an element found by its ARIA role.
 * @example When I click element with role "menuitem" named "Edit"
 */
When('I click element with role {string} named {string}', async function (role, name) {
    await this.page.getByRole(role, { name }).click();
});

/**
 * Find an input by its placeholder text and store it in context.
 * @example When I find element by placeholder text "Enter your email"
 */
When('I find element by placeholder text {string}', async function (placeholder) {
    this.element = this.page.getByPlaceholder(placeholder);
});

/**
 * Fill an input found by its placeholder text.
 * @example When I fill element with placeholder "Search..." with "Playwright"
 */
When('I fill element with placeholder {string} with {string}', async function (placeholder, value) {
    await this.page.getByPlaceholder(placeholder).fill(value);
});

/**
 * Find an element by its alt text (images, icons).
 * @example When I find element by alt text "Company Logo"
 */
When('I find element by alt text {string}', async function (altText) {
    this.element = this.page.getByAltText(altText);
});

/**
 * Click an element found by its alt text.
 * @example When I click element by alt text "Next Slide"
 */
When('I click element by alt text {string}', async function (altText) {
    await this.page.getByAltText(altText).click();
});

/**
 * Find an element by its title attribute.
 * @example When I find element by title "Close"
 */
When('I find element by title {string}', async function (title) {
    this.element = this.page.getByTitle(title);
});

/**
 * Find an input/element associated with a form label.
 * @example When I find element by label text "Email Address"
 */
When('I find element by label text {string}', async function (label) {
    this.element = this.page.getByLabel(label);
});

/**
 * Fill an input by its associated form label text.
 * @example When I fill element by label "Password" with "secret123"
 */
When('I fill element by label {string} with {string}', async function (label, value) {
    await this.page.getByLabel(label).fill(value);
});

/**
 * Find a link by its text and store it in context.
 * @example When I find link by text "Privacy Policy"
 */
When('I find link by text {string}', async function (text) {
    this.element = this.page.getByRole('link', { name: text });
});

/**
 * Click a link by its exact text.
 * @example When I click link by text "Learn More"
 */
When('I click link by text {string}', async function (text) {
    await this.page.getByRole('link', { name: text }).click();
});

/**
 * Find a heading element by its text.
 * @example When I find heading by text "Welcome Back"
 */
When('I find heading by text {string}', async function (text) {
    this.element = this.page.getByRole('heading', { name: text });
});

/**
 * Find an element by its [name] attribute.
 * @example When I find element by name "username"
 */
When('I find element by name {string}', async function (name) {
    this.element = this.page.locator(`[name="${name}"]`);
});

/**
 * Find elements matching a raw CSS/XPath selector (advanced escape hatch).
 * @example When I find elements by selector ".product-card"
 */
When('I find elements by selector {string}', async function (selector) {
    this.element = this.page.locator(selector);
});

/**
 * Click on the currently stored element (chained with find steps above).
 * @example When I click the found element
 */
When('I click the found element', async function () {
    if (!this.element) throw new Error('No element found — use a "find element" step first.');
    await this.element.click();
});

/**
 * Assert the stored element is visible.
 * @example Then the found element should be visible
 */
const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('the found element should be visible', async function () {
    if (!this.element) throw new Error('No element found — use a "find element" step first.');
    await expect(this.element).toBeVisible();
});

Then('the found element should contain text {string}', async function (text) {
    if (!this.element) throw new Error('No element found — use a "find element" step first.');
    await expect(this.element).toContainText(text);
});

Then('the found element should have text {string}', async function (text) {
    if (!this.element) throw new Error('No element found — use a "find element" step first.');
    await expect(this.element).toHaveText(text);
});

/**
 * Find a LocatorManager element and click it by its key.
 * Duplicate-safe shorthand for raw selector clicks.
 * @example When I click element {string} by testid
 */
When('I click element by testid {string}', async function (testid) {
    await this.page.getByTestId(testid).click();
});

/**
 * Fill an element by its testid.
 * @example When I fill element by testid "email-input" with "test@example.com"
 */
When('I fill element by testid {string} with {string}', async function (testid, value) {
    await this.page.getByTestId(testid).fill(value);
});
