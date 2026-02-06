const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../page-objects/login-page');
const env = require('../config/env');

Given('I am on the login screen', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateTo(env.BASE_URL);
});

When('I fill the login form with valid credentials', async function () {
  await this.loginPage.login(env.CREDENTIALS.VALID.USERNAME, env.CREDENTIALS.VALID.PASSWORD);
});

When('I fill the login form with invalid credentials', async function () {
  await this.loginPage.login(env.CREDENTIALS.INVALID.USERNAME, env.CREDENTIALS.INVALID.PASSWORD);
});

When('I fill the login form with empty credentials', async function () {
  await this.loginPage.login(env.CREDENTIALS.EMPTY.USERNAME, env.CREDENTIALS.EMPTY.PASSWORD);
});

When('I fill the login form with valid user but invalid password credentials', async function () {
  await this.loginPage.login(env.CREDENTIALS.VALID.USERNAME, env.CREDENTIALS.INVALID.PASSWORD);
});

When('I fill the login form with invalid user but valid password credentials', async function () {
  await this.loginPage.login(env.CREDENTIALS.INVALID.USERNAME, env.CREDENTIALS.VALID.PASSWORD);
});

Then('I should be able to see the home screen', async function () {
  await this.loginPage.verifyInventoryVisible();
});

Then('I should see error {string}', async function (errorMessage) {
  await this.loginPage.verifyErrorMessage(errorMessage);
});