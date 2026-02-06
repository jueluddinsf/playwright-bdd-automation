const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

setDefaultTimeout(60000);

let browser;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: false });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function () {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    const buffer = await this.page.screenshot({ fullPage: true });
    this.attach(buffer, 'image/png');
  }
  await this.page.close();
  await this.context.close();
});