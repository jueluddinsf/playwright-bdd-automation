/**
 * locators/login.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Selectors for the Login page.
 * Usage in feature files:  "login.username", "login.loginButton"
 *
 * VALUES can be:
 *   - A CSS selector string:      '#login-button'
 *   - An XPath string:            '//button[@id="login"]'
 *   - A Playwright text locator:  'text=Sign In'
 *   - A parameterized function:   (value) => `[data-user="${value}"]`
 * ─────────────────────────────────────────────────────────────────────────────
 */
module.exports = {
    // The username input field
    username: '#user-name',

    // The password input field
    password: '#password',

    // The submit / login button
    loginButton: '#login-button',

    // The error message banner shown on failed login
    error: "[data-test='error']",
};
