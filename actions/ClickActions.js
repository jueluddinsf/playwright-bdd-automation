class ClickActions {
    async click(page, selector, options = {}) {
        await page.locator(selector).click(options);
    }

    async doubleClick(page, selector) {
        await page.locator(selector).dblclick();
    }

    async rightClick(page, selector) {
        await page.locator(selector).click({ button: 'right' });
    }

    async hover(page, selector) {
        await page.locator(selector).hover();
    }

    async dragAndDrop(page, source, target) {
        await page.locator(source).dragTo(page.locator(target));
    }
}

module.exports = new ClickActions();
