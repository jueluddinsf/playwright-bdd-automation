const BasePage = require('./BasePage');
const inputActions = require('../actions/InputActions');
const clickActions = require('../actions/ClickActions');
const { expect } = require('@playwright/test');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = {
      usernameInput: '#user-name',
      passwordInput: '#password',
      loginButton: '#login-button',
      inventoryContainer: '#inventory_container',
      error: '[data-test="error"]'
    };
  }

  async login(username, password) {
    await inputActions.fill(this.page, this.locators.usernameInput, username);
    await inputActions.fill(this.page, this.locators.passwordInput, password);
    await clickActions.click(this.page, this.locators.loginButton);
  }

  async verifyInventoryVisible() {
    const visible = await this.page.isVisible(this.locators.inventoryContainer);
    expect(visible).toBeTruthy();
  }

  async verifyErrorMessage(text) {
    const errorText = await this.page.locator(this.locators.error).innerText();
    expect(errorText).toContain(text);
  }
}

module.exports = LoginPage;