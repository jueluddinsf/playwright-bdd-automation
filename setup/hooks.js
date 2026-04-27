const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
const env = require('../config/env');

setDefaultTimeout(60000);

// Set Expect timeout (Assertions) to 15s to match Action timeout
expect.configure({ timeout: 15000 });

let browser;

BeforeAll(async () => {
    process.env.BASE_URL = env.BASE_URL;

    const headless = String(process.env.HEADLESS || 'false').toLowerCase() === 'true';
    const requestedChannel = process.env.BROWSER_CHANNEL;
    const channels = requestedChannel ? [requestedChannel] : ['msedge', 'chrome'];
    let lastError;

    for (const channel of channels) {
        try {
            browser = await chromium.launch({
                headless,
                channel,
                args: ['--remote-debugging-port=9222'],
            });
            process.env.BROWSER_CHANNEL = channel;
            return;
        } catch (error) {
            lastError = error;
        }
    }

    throw new Error(
        `Unable to launch installed browser channel(s): ${channels.join(', ')}. ` +
            'Install Chrome or Microsoft Edge, or set BROWSER_CHANNEL to an installed Playwright channel. ' +
            `Original error: ${lastError.message}`
    );
});

AfterAll(async () => {
    if (browser) {
        await browser.close();
    }
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
