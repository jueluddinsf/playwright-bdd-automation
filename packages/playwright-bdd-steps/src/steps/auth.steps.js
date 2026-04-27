const { When } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

// ─── Authentication State Management ──────────────────────────────────────────
// The "Login Once" pattern: save browser cookies/storage to a file,
// then reload them in other scenarios to skip the login UI entirely.
// This can make entire test suites 10x faster.

const AUTH_DIR = path.resolve(process.cwd(), 'auth');

/**
 * Save the current browser storage state (cookies, localStorage, sessionStorage)
 * to a named file in the /auth directory.
 *
 * Use this ONCE in a @setup scenario after a successful login.
 * @example When I save the browser state to "admin.json"
 */
When('I save the browser state to {string}', async function (fileName) {
    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
    }
    const filePath = path.join(AUTH_DIR, fileName);
    await this.context.storageState({ path: filePath });
    console.log(`✅ Browser state saved to: ${filePath}`);
});

/**
 * Load previously saved browser storage state (cookies, localStorage)
 * from a named file into the current browser context.
 *
 * Call this at the START of scenarios that need an authenticated state.
 * NOTE: This adds cookies to the existing context; for full isolation,
 * see the Playwright docs on storageState in browser context configuration.
 * @example When I load the browser state from "admin.json"
 */
When('I load the browser state from {string}', async function (fileName) {
    const filePath = path.join(AUTH_DIR, fileName);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Auth state file not found: ${filePath}. Run the @setup scenario first.`);
    }
    const state = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    // Add cookies from saved state into the current context
    if (state.cookies && state.cookies.length > 0) {
        await this.context.addCookies(state.cookies);
    }
    // Restore localStorage per origin
    if (state.origins && state.origins.length > 0) {
        for (const origin of state.origins) {
            await this.page.goto(origin.origin);
            for (const item of origin.localStorage) {
                await this.page.evaluate(({ key, value }) => window.localStorage.setItem(key, value), item);
            }
        }
    }
    console.log(`✅ Browser state loaded from: ${filePath}`);
});
