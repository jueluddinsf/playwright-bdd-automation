const { chromium } = require('@playwright/test');
const env = require('../config/env');
const path = require('path');
const fs = require('fs');

async function globalSetup() {
    console.log(`\n[Global Setup] Generating authentication state for environment: ${env.ACTIVE_ENV}`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(env.BASE_URL);
        
        // Use standard credentials from env config
        const username = env.CREDENTIALS.VALID.USERNAME;
        const password = env.CREDENTIALS.VALID.PASSWORD;

        console.log(`[Global Setup] Logging in to ${env.BASE_URL} as ${username}...`);

        await page.locator('#user-name').fill(username);
        await page.locator('#password').fill(password);
        await page.locator('#login-button').click();

        // Wait for successful login (redirect to inventory page)
        await page.waitForURL('**/inventory.html', { timeout: 15000 });
        console.log('[Global Setup] Login successful.');

        // Save state
        const authPath = path.resolve(__dirname, '../auth/state.json');
        
        // Ensure auth directory exists
        if (!fs.existsSync(path.dirname(authPath))) {
            fs.mkdirSync(path.dirname(authPath), { recursive: true });
        }

        await context.storageState({ path: authPath });
        console.log(`[Global Setup] Authentication state saved to: ${authPath}\n`);
        
    } catch (error) {
        console.error('[Global Setup] Failed to generate authentication state:', error);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

globalSetup();
