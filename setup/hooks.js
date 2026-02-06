const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');

setDefaultTimeout(60000);

// Set Expect timeout (Assertions) to 15s to match Action timeout
expect.configure({ timeout: 15000 });

let browser;

BeforeAll(async () => {
  browser = await chromium.launch({
    headless: false,
    channel: process.env.BROWSER_CHANNEL // Support 'msedge', 'chrome' etc.
  });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();

  // Increase timeouts for slower government environments
  this.page.setDefaultNavigationTimeout(30000); // 30s for page loads
  this.page.setDefaultTimeout(15000); // 15s for element actions/assertions
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    const buffer = await this.page.screenshot({ fullPage: true });
    this.attach(buffer, 'image/png');
  }
  await this.page.close();
  await this.context.close();
});