const { When } = require('@cucumber/cucumber');

// Tab/Window Management
When('I open a new tab', async function () {
    await this.page.evaluate(() => {
        window.open('about:blank', '_blank');
    });
});

When('I close the current tab', async function () {
    await this.page.close();
    const pages = this.context.pages();
    if (pages.length > 0) {
        this.page = pages[0];
        await this.page.bringToFront();
    }
});

When('I switch to tab {int}', async function (index) {
    const pages = this.context.pages();
    if (pages.length >= index) {
        this.page = pages[index - 1];
        await this.page.bringToFront();
    } else {
        throw new Error(`Tab at index ${index} does not exist. Only ${pages.length} tabs open.`);
    }
});

// Dialogs/Alerts
When('I accept the next alert', async function () {
    this.page.once('dialog', async (dialog) => {
        await dialog.accept();
    });
});

When('I dismiss the next alert', async function () {
    this.page.once('dialog', async (dialog) => {
        await dialog.dismiss();
    });
});

When('I type {string} into the next alert', async function (text) {
    this.page.once('dialog', async (dialog) => {
        await dialog.accept(text);
    });
});

// Browser Storage
When('I clear cookies', async function () {
    await this.context.clearCookies();
});

When('I clear local storage', async function () {
    await this.page.evaluate(() => window.localStorage.clear());
});

When('I clear session storage', async function () {
    await this.page.evaluate(() => window.sessionStorage.clear());
});

When('I set {string} cookie to {string}', async function (name, value) {
    const url = this.page.url();
    await this.context.addCookies([{ name, value, url }]);
});

When('I set {string} local storage value to {string}', async function (key, value) {
    await this.page.evaluate(
        ({ k, v }) => {
            window.localStorage.setItem(k, v);
        },
        { k: key, v: value }
    );
});

// Viewport
When('I set window size to {int} by {int}', async function (width, height) {
    await this.page.setViewportSize({ width, height });
});

// Read storage values back into memory
When('I get the {string} local storage value', async function (key) {
    this.storedValue = await this.page.evaluate((k) => window.localStorage.getItem(k), key);
});

When('I get the {string} cookie value', async function (name) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find((c) => c.name === name);
    this.storedValue = cookie ? cookie.value : null;
});

// Wait for new tab to appear
When('I wait for a new tab to open', async function () {
    const newPage = await this.context.waitForEvent('page');
    await newPage.waitForLoadState();
    this.page = newPage;
});
