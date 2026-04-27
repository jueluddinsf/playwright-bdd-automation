/**
 * index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Entry point for the playwright-bdd-steps package.
 *
 * When Cucumber's `require` config points to this package's steps directory,
 * each step file self-registers its steps with the Cucumber runtime on load.
 * No explicit imports are needed in your feature runner.
 *
 * This file exists so the package can also be referenced as a module if needed,
 * and exposes the LocatorManager for advanced use cases.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// Export LocatorManager for consumers who want to introspect locators
// programmatically (e.g., for tooling, reporting, or custom steps).
const LocatorManager = require('./src/utils/LocatorManager');

module.exports = { LocatorManager };
