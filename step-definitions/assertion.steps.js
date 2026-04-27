/**
 * assertion.steps.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable Gherkin steps for ALL assertions and validations.
 * Covers: visibility, text content, values, attributes, counts, accessibility,
 *         iframes, visual screenshots, CSS properties, URL/title checks.
 *
 * HOW TO USE:
 *   All {string} element parameters refer to a KEY in your locators JSON file.
 *   The LocatorManager resolves the key to a real CSS/XPath selector.
 *
 * EXAMPLE:
 *   Then the element "SuccessBanner" should be visible
 *   Then the element "ErrorMessage" should contain text "Invalid email"
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LocatorManager = require('../utils/LocatorManager');

// ─── Visibility ───────────────────────────────────────────────────────────────

// Assert an element is visible on screen.
// Usage:  Then I should see "SuccessBanner"
Then('I should see {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeVisible();
});

// Assert an element is NOT visible (hidden or absent from DOM).
// Usage:  Then I should not see "ErrorMessage"
Then('I should not see {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeHidden();
});

// Assert an element is visible — longer, more readable alias.
// Usage:  Then the element "LoginButton" should be visible
Then('the element {string} should be visible', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeVisible();
});

// Assert an element is hidden (not rendered or display:none).
// Usage:  Then the element "LoadingSpinner" should be hidden
Then('the element {string} should be hidden', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeHidden();
});

// Assert the element currently has keyboard focus.
// Usage:  Then the element "EmailField" should be focused
Then('the element {string} should be focused', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeFocused();
});

// Assert the element does NOT have keyboard focus.
// Usage:  Then the element "PasswordField" should not be focused
Then('the element {string} should not be focused', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeFocused();
});

// Assert an element is within the visible browser viewport.
// Usage:  Then the element "HeroSection" should be in the viewport
Then('the element {string} should be in the viewport', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeInViewport();
});

// Assert an element is scrolled out of the visible viewport.
// Usage:  Then the element "FooterSection" should not be in the viewport
Then('the element {string} should not be in the viewport', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeInViewport();
});

// ─── Text Assertions ──────────────────────────────────────────────────────────

// Assert an element's text contains a substring (partial match).
// Usage:  Then the element "AlertBanner" should contain text "successfully"
Then('the element {string} should contain text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toContainText(text);
});

// Assert an element's text exactly matches a string (full match).
// Usage:  Then the element "PageHeading" should have exact text "Welcome Back"
Then('the element {string} should have exact text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveText(text);
});

// Assert an element's text does NOT contain a substring.
// Usage:  Then the element "AlertBanner" should not contain text "error"
Then('the element {string} should not contain text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toContainText(text);
});

// Assert an element's text does NOT exactly match a string.
// Usage:  Then the element "StatusLabel" should not have exact text "Inactive"
Then('the element {string} should not have exact text {string}', async function (key, text) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toHaveText(text);
});

// Assert any text exists anywhere on the page body.
// Usage:  Then I should see text "Order placed successfully"
Then('I should see text {string}', async function (text) {
    await expect(this.page.locator('body')).toContainText(text);
});

// Assert a text string does NOT appear anywhere on the page.
// Usage:  Then I should not see text "Unauthorized"
Then('I should not see text {string}', async function (text) {
    await expect(this.page.locator('body')).not.toContainText(text);
});

// ─── Input Value Assertions ───────────────────────────────────────────────────

// Assert an input field has a specific value.
// Usage:  Then the element "EmailField" should have value "user@example.com"
Then('the element {string} should have value {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveValue(value);
});

// Assert an input field's value contains a substring.
// Usage:  Then the element "SearchField" should contain value "playwright"
Then('the element {string} should contain value {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    const inputValue = await this.page.locator(selector).inputValue();
    expect(inputValue).toContain(value);
});

// Assert an input field's value does NOT contain a substring.
// Usage:  Then the element "SearchField" should not contain value "invalid"
Then('the element {string} should not contain value {string}', async function (key, value) {
    const selector = LocatorManager.getSelector(key);
    const inputValue = await this.page.locator(selector).inputValue();
    expect(inputValue).not.toContain(value);
});

// Assert an input element is completely empty (no value).
// Usage:  Then the element "SearchField" should be empty
Then('the element {string} should be empty', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeEmpty();
});

// Assert an input element has some content (is not empty).
// Usage:  Then the element "DescriptionField" should not be empty
Then('the element {string} should not be empty', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeEmpty();
});

// ─── State Assertions ────────────────────────────────────────────────────────

// Assert an interactive element (button, input, link) is enabled.
// Usage:  Then the element "SubmitButton" should be enabled
Then('the element {string} should be enabled', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeEnabled();
});

// Assert an interactive element is disabled (greyed out, non-interactive).
// Usage:  Then the element "SubmitButton" should be disabled
Then('the element {string} should be disabled', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeDisabled();
});

// Assert a checkbox or radio button is checked.
// Usage:  Then the element "TermsCheckbox" should be checked
Then('the element {string} should be checked', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeChecked();
});

// Assert a checkbox is NOT checked.
// Usage:  Then the element "NewsletterCheckbox" should not be checked
Then('the element {string} should not be checked', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeChecked();
});

// Assert an input or contenteditable element can be edited.
// Usage:  Then the element "NameField" should be editable
Then('the element {string} should be editable', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toBeEditable();
});

// Assert an input element is read-only (cannot be edited by the user).
// Usage:  Then the element "ConfirmationCode" should not be editable
Then('the element {string} should not be editable', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).not.toBeEditable();
});

// ─── Attribute Assertions ────────────────────────────────────────────────────

// Assert an element has a specific HTML attribute with a specific value.
// Usage:  Then the element "ProfileImage" should have attribute "alt" with value "User Avatar"
Then('the element {string} should have attribute {string} with value {string}', async function (key, attr, value) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute(attr, value);
});

// Assert an element has a specific HTML attribute (any value is acceptable).
// Usage:  Then the element "ExternalLink" should have attribute "target"
Then('the element {string} should have attribute {string}', async function (key, attr) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute(attr, /.*/);
});

// Assert an element does NOT have a specific HTML attribute.
// Usage:  Then the element "InternalLink" should not have attribute "target"
Then('the element {string} should not have attribute {string}', async function (key, attr) {
    const selector = LocatorManager.getSelector(key);
    const hasAttr = await this.page.locator(selector).evaluate((el, a) => el.hasAttribute(a), attr);
    expect(hasAttr).toBe(false);
});

// Assert an element has a specific CSS class name applied.
// Usage:  Then the element "ActiveTab" should have class "active"
Then('the element {string} should have class {string}', async function (key, className) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveClass(new RegExp(className));
});

// Assert an element's computed CSS property has a specific value.
// Usage:  Then the element "ErrorText" css property "color" should be "rgb(255, 0, 0)"
Then('the element {string} css property {string} should be {string}', async function (key, property, value) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveCSS(property, value);
});

// ─── Count Assertions ────────────────────────────────────────────────────────

// Assert exactly N elements matching a locator key exist on the page.
// Usage:  Then I should see 5 elements matching "ProductCard"
Then('I should see {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveCount(count);
});

// Assert MORE than N elements matching a locator exist.
// Usage:  Then I should see more than 3 elements matching "SearchResult"
Then('I should see more than {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    const actual = await this.page.locator(selector).count();
    expect(actual).toBeGreaterThan(count);
});

// Assert FEWER than N elements matching a locator exist.
// Usage:  Then I should see fewer than 10 elements matching "ErrorMessage"
Then('I should see fewer than {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    const actual = await this.page.locator(selector).count();
    expect(actual).toBeLessThan(count);
});

// Assert AT LEAST N elements matching a locator exist.
// Usage:  Then I should see at least 1 elements matching "TableRow"
Then('I should see at least {int} elements matching {string}', async function (count, key) {
    const selector = LocatorManager.getSelector(key);
    const actual = await this.page.locator(selector).count();
    expect(actual).toBeGreaterThanOrEqual(count);
});

// ─── URL / Title Assertions ───────────────────────────────────────────────────

// Assert the current page URL exactly matches a given string.
// Usage:  Then the url should be "https://example.com/dashboard"
Then('the url should be {string}', async function (url) {
    await expect(this.page).toHaveURL(url);
});

// Assert the current page URL contains a substring.
// Usage:  Then the url should contain "/dashboard"
Then('the url should contain {string}', async function (text) {
    await expect(this.page).toHaveURL(new RegExp(text));
});

// Assert the page <title> tag exactly matches.
// Usage:  Then the page title should be "My App — Dashboard"
Then('the page title should be {string}', async function (title) {
    await expect(this.page).toHaveTitle(title);
});

// Assert the page <title> tag contains a substring.
// Usage:  Then the page title should contain "Dashboard"
Then('the page title should contain {string}', async function (text) {
    const title = await this.page.title();
    expect(title).toContain(text);
});

// ─── Accessibility Assertions ─────────────────────────────────────────────────

// Assert a form input's placeholder text.
// Usage:  Then the element "SearchField" placeholder should be "Search here..."
Then('the element {string} placeholder should be {string}', async function (key, placeholder) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('placeholder', placeholder);
});

// Assert an element's explicit ARIA role attribute.
// Usage:  Then the element "ModalDialog" should have role "dialog"
Then('the element {string} should have role {string}', async function (key, role) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('role', role);
});

// Assert an element's aria-label attribute for screen reader accessibility.
// Usage:  Then the element "CloseButton" should have aria-label "Close dialog"
Then('the element {string} should have aria-label {string}', async function (key, label) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('aria-label', label);
});

// Assert an element's tabindex attribute (keyboard navigation order).
// Usage:  Then the element "SkipLink" should have tabindex "0"
Then('the element {string} should have tabindex {string}', async function (key, tabindex) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveAttribute('tabindex', tabindex);
});

// ─── IFrame Assertions ────────────────────────────────────────────────────────

// Assert an element inside an iframe is visible.
// Usage:  Then the element "SuccessMessage" inside frame "PaymentFrame" should be visible
Then('the element {string} inside frame {string} should be visible', async function (elementKey, frameKey) {
    const frameSelector = LocatorManager.getSelector(frameKey);
    const elementSelector = LocatorManager.getSelector(elementKey);
    await expect(this.page.frameLocator(frameSelector).locator(elementSelector)).toBeVisible();
});

// Assert an element inside an iframe has exact text.
// Usage:  Then the element "Total" inside frame "CheckoutFrame" should have text "$99.00"
Then(
    'the element {string} inside frame {string} should have text {string}',
    async function (elementKey, frameKey, text) {
        const frameSelector = LocatorManager.getSelector(frameKey);
        const elementSelector = LocatorManager.getSelector(elementKey);
        await expect(this.page.frameLocator(frameSelector).locator(elementSelector)).toHaveText(text);
    }
);

// Assert an element inside an iframe contains a text substring.
// Usage:  Then the element "StatusMsg" inside frame "CheckoutFrame" should contain text "approved"
Then(
    'the element {string} inside frame {string} should contain text {string}',
    async function (elementKey, frameKey, text) {
        const frameSelector = LocatorManager.getSelector(frameKey);
        const elementSelector = LocatorManager.getSelector(elementKey);
        await expect(this.page.frameLocator(frameSelector).locator(elementSelector)).toContainText(text);
    }
);

// ─── Visual Regression ────────────────────────────────────────────────────────

// Compare the full page screenshot to a stored baseline image.
// On first run, a baseline is created. Subsequent runs compare against it.
// Usage:  Then the page screenshot should match "homepage.png"
Then('the page screenshot should match {string}', async function (snapshotName) {
    await expect(this.page).toHaveScreenshot(snapshotName);
});

// Compare a specific element's screenshot to a stored baseline image.
// Usage:  Then the element "ProductCard" screenshot should match "card-baseline.png"
Then('the element {string} screenshot should match {string}', async function (key, snapshotName) {
    const selector = LocatorManager.getSelector(key);
    await expect(this.page.locator(selector)).toHaveScreenshot(snapshotName);
});
