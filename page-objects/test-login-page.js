const BasePage = require('./BasePage');
const inputActions = require('../actions/InputActions');
const clickActions = require('../actions/ClickActions');
const { expect } = require('@playwright/test');

class TestLoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.locators = {
            usernameInput: '#user-name',
            passwordInput: '#password',
            loginButton: '#login-button',
            inventoryContainer: '#inventory_container'
        };
    }

    async navigateToTestLoginPage(url) {
        await this.navigateTo(url);
    }

    async verifyTestLoginPageIsDisplayed() {
        // Swag Labs title
        return expect(await this.page.title()).toBe('Swag Labs');
    }

    async submitTestLoginForm() {
        // Using standard credentials because the selectors match Swag Labs
        await inputActions.fill(this.page, this.locators.usernameInput, 'standard_user');
        await inputActions.fill(this.page, this.locators.passwordInput, 'secret_sauce');
        await clickActions.click(this.page, this.locators.loginButton);
    }

    async verifyAfterTestLoginPage() {
        const visible = await this.page.isVisible(this.locators.inventoryContainer);
        expect(visible).toBeTruthy();
    }
}

module.exports = TestLoginPage;