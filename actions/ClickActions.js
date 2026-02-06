class ClickActions {
    async click(page, selector) {
        await page.locator(selector).click();
    }

    async doubleClick(page, selector) {
        await page.locator(selector).dblclick();
    }

    async hover(page, selector) {
        await page.locator(selector).hover();
    }

    async dragAndDrop(page, source, target) {
        await page.locator(source).dragTo(page.locator(target));
    }
}

module.exports = new ClickActions();
