class InputActions {
    async fill(page, selector, text) {
        await page.locator(selector).fill(text);
    }

    async clear(page, selector) {
        await page.locator(selector).fill('');
    }

    async selectOption(page, selector, value) {
        // Supports selecting by value or label based on how the DOM is rendered
        await page.locator(selector).selectOption(value);
    }

    async selectOptionByLabel(page, selector, label) {
        await page.locator(selector).selectOption({ label });
    }

    async selectOptionByIndex(page, selector, index) {
        await page.locator(selector).selectOption({ index });
    }

    async check(page, selector) {
        await page.locator(selector).check();
    }

    async uncheck(page, selector) {
        await page.locator(selector).uncheck();
    }

    async uploadFile(page, selector, filePath) {
        await page.locator(selector).setInputFiles(filePath);
    }

    async press(page, selector, key) {
        await page.locator(selector).press(key);
    }

    async type(page, selector, text) {
        // Simulates sequential key presses
        await page.locator(selector).pressSequentially(text);
    }

    async scroll(page, selector) {
        await page.locator(selector).scrollIntoViewIfNeeded();
    }

    async focus(page, selector) {
        await page.locator(selector).focus();
    }
}

module.exports = new InputActions();
