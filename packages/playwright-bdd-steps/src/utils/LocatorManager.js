/**
 * utils/LocatorManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central registry for all page locators.
 *
 * LOCATOR FILE FORMAT  (locators/<pageName>.js)
 * ─────────────────────────────────────────────
 * Each file in the /locators directory exports a plain object.
 * Values can be:
 *
 *   Static string (CSS/XPath):
 *     loginButton: '#login-button'
 *
 *   Parameterized function (dynamic selectors):
 *     itemByName: (name) => `.item:has-text("${name}")`
 *
 * USAGE IN FEATURE FILES
 * ──────────────────────
 * Keys follow the pattern:  "pageName.elementKey"
 *
 *   "login.loginButton"        → resolves to '#login-button'
 *   "inventory.title"          → resolves to '.title'
 *
 * Raw selectors (CSS, XPath, Playwright keywords) are passed through as-is:
 *   "#some-id"                 → returned unchanged
 *   "text=Click Me"            → returned unchanged
 *   "//button"                 → returned unchanged
 *
 * USAGE IN STEP CODE (parameterized selectors)
 * ────────────────────────────────────────────
 *   const val = LocatorManager.getSelector('inventory.itemByName');
 *   if (typeof val === 'function') {
 *     const selector = val('Sauce Labs Backpack');
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

class LocatorManager {
    constructor() {
        // Holds all loaded locator maps keyed by page name
        this.locators = {};
        this._loadLocators();
    }

    /**
     * Load all .js locator files from the /locators directory.
     * Each file must export a plain object via module.exports.
     * Files are loaded at startup — no hot-reload needed.
     */
    _loadLocators() {
        // IMPORTANT: Use process.cwd() — NOT __dirname.
        // When this file lives inside node_modules (npm package), __dirname
        // points into the package directory, NOT the consuming project.
        // process.cwd() always resolves to wherever `npx cucumber-js` is run from.
        const locatorsDir = process.env.LOCATORS_DIR
            ? path.resolve(process.env.LOCATORS_DIR)
            : path.join(process.cwd(), 'locators');

        if (!fs.existsSync(locatorsDir)) {
            console.warn(`[LocatorManager] Locators directory not found: ${locatorsDir}`);
            return;
        }

        const files = fs.readdirSync(locatorsDir);

        files.forEach((file) => {
            // Only process .js files — skip .json, .md, .bak, etc.
            if (path.extname(file) !== '.js') return;

            const pageName = path.basename(file, '.js');

            if (this.locators[pageName]) {
                console.warn(
                    `[LocatorManager] Duplicate locator file for page "${pageName}". Overwriting with latest.`
                );
            }

            try {
                // Use require() — supports exports, comments, and functions
                const filePath = path.join(locatorsDir, file);
                delete require.cache[require.resolve(filePath)];
                this.locators[pageName] = require(filePath);
            } catch (e) {
                // Throw hard — a broken locator file must never silently pass.
                // Silent failures cause confusing 'key not found' errors in tests
                // that are very hard to trace back to the real root cause.
                throw new Error(
                    `[LocatorManager] Failed to load "locators/${file}": ${e.message}\n` +
                        `  Fix the syntax error in that file before running tests.`
                );
            }
        });
    }

    /**
     * Resolve a locator key to its CSS/XPath selector string.
     *
     * @param {string} key  - Either "pageName.elementKey" or a raw selector
     * @param {...any} args - Optional args passed to parameterized (function) selectors
     * @returns {string}    - The resolved CSS/XPath selector string
     *
     * @example
     * // Static locator
     * LocatorManager.getSelector('login.loginButton')  // → '#login-button'
     *
     * // Raw passthrough
     * LocatorManager.getSelector('#some-id')           // → '#some-id'
     *
     * // Parameterized locator
     * LocatorManager.getSelector('inventory.itemByName', 'Sauce Labs Backpack')
     * // → '.inventory_item:has-text("Sauce Labs Backpack")'
     */
    getSelector(key, ...args) {
        // ── 1. Raw selector passthrough ─────────────────────────────────────
        // If it starts with a known raw prefix, return it directly.
        const rawPrefixes = ['text=', 'xpath=', 'css=', '#', '//', 'button=', 'role=', '\.', '\['];
        if (rawPrefixes.some((prefix) => key.startsWith(prefix))) {
            return key;
        }

        // ── 2. Dot-notation key resolution: "pageName.elementKey" ───────────
        if (!key.includes('.')) {
            // No dot → treat as a raw selector (e.g. a CSS class ".btn" would
            // have been caught above; bare words like "body" pass through here)
            return key;
        }

        const dotIndex = key.indexOf('.');
        const pageName = key.substring(0, dotIndex);
        const elementKey = key.substring(dotIndex + 1);

        if (!this.locators[pageName]) {
            // Page file doesn't exist → could be a CSS selector with a dot (e.g. "div.card")
            return key;
        }

        const pageLocators = this.locators[pageName];

        if (!Object.prototype.hasOwnProperty.call(pageLocators, elementKey)) {
            throw new Error(
                `[LocatorManager] Key "${elementKey}" not found in locators/${pageName}.js.\n` +
                    `  Available keys: ${Object.keys(pageLocators).join(', ')}`
            );
        }

        const value = pageLocators[elementKey];

        // ── 3. Parameterized selector (function) ────────────────────────────
        if (typeof value === 'function') {
            if (args.length === 0) {
                throw new Error(
                    `[LocatorManager] Locator "${key}" is a parameterized function but no arguments were provided.`
                );
            }
            return value(...args);
        }

        // ── 4. Static string selector ────────────────────────────────────────
        return value;
    }

    /**
     * Return all loaded page names (useful for debugging/tooling).
     * @returns {string[]}
     */
    getLoadedPages() {
        return Object.keys(this.locators);
    }

    /**
     * Return all keys for a given page name.
     * @param {string} pageName
     * @returns {string[]}
     */
    getPageKeys(pageName) {
        return this.locators[pageName] ? Object.keys(this.locators[pageName]) : [];
    }
}

module.exports = new LocatorManager();
