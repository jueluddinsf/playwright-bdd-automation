const { Given, When, Then } = require('@cucumber/cucumber');
const TestLoginPage = require('../page-objects/test-login-page');
const env = require('../config/env');

Given('I am on the test login screen', async function () {
  this.testLoginPage = new TestLoginPage(this.page);
  await this.testLoginPage.navigateToTestLoginPage(env.BASE_URL);
});

When('I fill the test login form with valid credentials', async function () {
  await this.testLoginPage.submitTestLoginForm();
});

Then('Then I should be able to see the home page', async function () {
  await this.testLoginPage.verifyAfterTestLoginPage();
});