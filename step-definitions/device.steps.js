const { When } = require('@cucumber/cucumber');
const { devices } = require('@playwright/test');
const LocatorManager = require('../utils/LocatorManager');

// ─── Device & Mobile Simulation ────────────────────────────────────────────────

/**
 * Simulate a named device viewport and user agent.
 * Device names match Playwright's built-in device descriptors.
 * @example When I simulate device "iPhone 13"
 * @example When I simulate device "Pixel 5"
 */
When('I simulate device {string}', async function (deviceName) {
    const device = devices[deviceName];
    if (!device) throw new Error(`Unknown device "${deviceName}". Check Playwright device list.`);
    await this.page.setViewportSize(device.viewport);
    await this.page.setExtraHTTPHeaders({ 'User-Agent': device.userAgent });
});

/**
 * Set the browser geolocation (requires the geolocation permission).
 * @example When I set geolocation to lat 51.5 long -0.12
 */
When('I set geolocation to lat {float} long {float}', async function (latitude, longitude) {
    await this.context.setGeolocation({ latitude, longitude });
});

/**
 * Grant a browser permission to the current context.
 * Supported: 'geolocation', 'notifications', 'camera', 'microphone', etc.
 * @example When I grant permission "notifications"
 */
When('I grant permission {string}', async function (permission) {
    await this.context.grantPermissions([permission]);
});

/**
 * Deny a browser permission from the current context.
 * @example When I deny permission "geolocation"
 */
When('I deny permission {string}', async function (_permission) {
    await this.context.clearPermissions();
});

/**
 * Tap an element using the touch API (mobile simulation).
 * @example When I tap element "LoginButton"
 */
When('I tap element {string}', async function (key) {
    const selector = LocatorManager.getSelector(key);
    await this.page.locator(selector).tap();
});

/**
 * Tap at specific coordinates on the screen (touch/mobile).
 * @example When I tap coordinates x:150 y:300
 */
When('I tap coordinates x:{int} y:{int}', async function (x, y) {
    await this.page.touchscreen.tap(x, y);
});

/**
 * Resize the window to a specific width and height.
 * @example When I resize window to width 375 and height 812
 */
When('I resize window to width {int} and height {int}', async function (width, height) {
    await this.page.setViewportSize({ width, height });
});

/**
 * Set device to dark color scheme.
 * @example When I enable dark mode
 */
When('I enable dark mode', async function () {
    await this.page.emulateMedia({ colorScheme: 'dark' });
});

/**
 * Set device to light color scheme.
 * @example When I enable light mode
 */
When('I enable light mode', async function () {
    await this.page.emulateMedia({ colorScheme: 'light' });
});
