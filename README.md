# Codeless Playwright BDD Framework

A robust, enterprise-grade codeless automation framework combining **Cucumber (Gherkin)** with **Playwright (JavaScript)** for reliable End-to-End (E2E), API, and regression testing. Tests are written in plain English using reusable steps from the locally packaged `playwright-bdd-steps` library.

The installed step library currently provides **222 reusable Gherkin steps** for UI actions, assertions, API testing, network mocking, device simulation, saved values, bulk forms, downloads, tables, and environment-driven test data.

## Prerequisites
- **Nexus npm repository access**: required to pull framework npm packages. Access request link: TBD.
- **Node.js**: v18 or higher. Access/download request link: TBD.
- **VS Code**: recommended editor. Download request link: TBD.
- **Chrome or Microsoft Edge**: installed locally. This framework uses the installed browser through Playwright `channel`; it does not require downloading Playwright-managed browsers.

## Installation

1. **Configure npm access**:
   Update your user-level or project-level `.npmrc` with the Nexus registry and API key before installing dependencies.
   ```ini
   registry=<NEXUS_NPM_REGISTRY_URL>
   //TODO_NEXUS_HOST/repository/npm/:_authToken=<YOUR_NEXUS_API_KEY>
   always-auth=true
   ```

   Replace the placeholder registry, host, and token values with the official Nexus details once provided.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

No `npx playwright install` step is required. The test hooks launch the installed browser using `BROWSER_CHANNEL`, such as `msedge` or `chrome`.

## Quick Start

### Run All Tests
```bash
npm test
```

For first-time setup, use a dry run before launching a browser:

```bash
npm run test:dry
```

### Run Against a Specific Environment
```bash
npm run test:local
npm run test:sat
npm run test:stage
npm run test:prod
```

The active environment is selected by `TEST_ENV` and configured in `config/env.js`.

You can also pass the environment directly:

```bash
TEST_ENV=sat npm test
TEST_ENV=stage npm run test:smoke
```

### Run Specific Feature
```bash
npx cucumber-js features/examples/ui/login.feature
```

### Run Smoke or Regression Tests
```bash
npm run test:smoke
npm run test:regression
```

### Run by Test Type
```bash
npm run test:ui
npm run test:api
npm run test:e2e
npm run test:performance
```

### Validate Step Matching Without Running Browser Actions
```bash
npm run test:dry
```

### Generate Global Authentication State
```bash
npm run setup:auth
```

### View Reports
After execution, an HTML report is generated at `reports/report.html`.

### Browser Channel

Use the Chrome or Edge browser already installed on your laptop:

```bash
# Use Microsoft Edge
npm run test:edge

# Use Google Chrome
npm run test:chrome
```

You can also set the channel directly:

```bash
BROWSER_CHANNEL=msedge npm test
BROWSER_CHANNEL=chrome npm test
```

Run headed or headless:

```bash
npm run test:headed
npm run test:headless
```

---

## Writing Tests (Codeless Workflow)

This framework allows you to create valid automated tests without writing code. Follow this simple workflow.

### Step 1: Choose or Create a Feature File
Use `features/tests/` for real tests. For example:

```text
features/tests/ui/login.feature
```

Start from the existing starter file if you are new:

```text
features/tests/ui/starter.feature
```

### Step 2: Add Locators
Find the CSS selector for your element and add it to a page/domain file under `locators/`.

**Example**: `locators/login.js`
```js
module.exports = {
  username: '#user-name',
  password: '#password',
  loginButton: '#login-button',
  error: "[data-test='error']",
};
```

Use locator keys in the format:

```text
"fileName.keyName"
```

For `locators/login.js`, the key `username` becomes:

```text
"login.username"
```

### Step 3: Write Feature
Use the **Locator Key** (`page.element`) in your English steps.

**Example**: `features/login.feature`
```gherkin
Feature: Login Scenarios

  Scenario: Valid Login
    Given I navigate to "BASE_URL"
    When I fill "login.username" with config value "CREDENTIALS.VALID.USERNAME"
    And I fill "login.password" with config value "CREDENTIALS.VALID.PASSWORD"
    And I click "login.loginButton"
    Then I should see "inventory.title"
```

### Step 4: Validate and Run
Check that every English step is recognized:

```bash
npm run test:dry
```

Run only your new feature:

```bash
npx cucumber-js features/tests/ui/login.feature
```

For the full reusable step guide and catalog, see [docs/reusable-step-library-guide.md](docs/reusable-step-library-guide.md).

### Step 5: Use Global Authentication (Bypass Login)
Instead of writing out the login steps for every scenario, you can generate a global authentication state and inject it using a tag.
1. Run `npm run setup:auth` to securely save the session state.
2. Add the `@auth` tag to your Feature or Scenario.
3. Start your scenario directly on the authenticated page (e.g., `Given I navigate to "https://www.saucedemo.com/inventory.html"`).

### Step 6: Create Composite Step Definitions
When scenarios become long, group repeated reusable steps into one project-specific step definition in `step-definitions/`. These are also called composite or business-flow steps.

Important: Cucumber JS does not provide a supported public API to run one Gherkin step from inside another Gherkin step. Instead of calling step text inside step text, put the shared behavior in helper code and call that helper from your composite step.

**Before composing**, the feature repeats every low-level reusable step:

```gherkin
Scenario: Products are visible after login
  Given I navigate to "BASE_URL"
  When I fill "login.username" with config value "CREDENTIALS.VALID.USERNAME"
  And I fill "login.password" with config value "CREDENTIALS.VALID.PASSWORD"
  And I click "login.loginButton"
  Then I should see "inventory.title"
```

**After composing**, the feature uses one readable business step:

```gherkin
Scenario: Products are visible after login
  Given I am logged in as a standard user
  Then I should see "inventory.title"
```

Do not do this:

```js
Given('I am logged in as a standard user', async function () {
  // Unsupported pattern: do not try to call Gherkin step text from here.
  await this.runStep('Given I navigate to "BASE_URL"');
  await this.runStep('When I fill "login.username" with config value "CREDENTIALS.VALID.USERNAME"');
  await this.runStep('When I fill "login.password" with config value "CREDENTIALS.VALID.PASSWORD"');
  await this.runStep('When I click "login.loginButton"');
});
```

Do this instead.

**Composite step definition example**: `step-definitions/login-flow.steps.js`

```js
const { Given } = require('@cucumber/cucumber');
const LocatorManager = require('playwright-bdd-steps/src/utils/LocatorManager');
const inputActions = require('playwright-bdd-steps/src/actions/InputActions');
const clickActions = require('playwright-bdd-steps/src/actions/ClickActions');
const env = require('../config/env');

Given('I am logged in as a standard user', async function () {
  await this.page.goto(env.BASE_URL);
  await inputActions.fill(this.page, LocatorManager.getSelector('login.username'), env.CREDENTIALS.VALID.USERNAME);
  await inputActions.fill(this.page, LocatorManager.getSelector('login.password'), env.CREDENTIALS.VALID.PASSWORD);
  await clickActions.click(this.page, LocatorManager.getSelector('login.loginButton'));
});
```

That single step composes the navigation, username fill, password fill, and login click inside one reusable business action.

Reuse `LocatorManager`, action helpers, flow helper functions, and Playwright assertions directly.

---

## Step Definition Cheat Sheet

Use these pre-built English phrases to control your tests.

### Interactions
| Action | Step Usage |
| :--- | :--- |
| **Click** | `When I click "login.loginButton"` |
| **Type** | `When I type "password123" into "login.password"` |
| **Fill** | `When I fill "login.username" with "admin"` |
| **Fill From Config** | `When I fill "login.username" with config value "CREDENTIALS.VALID.USERNAME"` |
| **Bulk Fill** | `When I fill the following fields:` |
| **Select** | `When I select option "value" from "login.dropdown"` |
| **Check** | `When I check "login.checkbox"` |
| **Scroll** | `When I scroll to "login.footer"` |
| **Wait** | `When I wait for "login.modal" to be visible` |

### Assertions
| Check | Step Usage |
| :--- | :--- |
| **Visibility** | `Then I should see "login.error"` |
| **Text** | `Then the element "home.title" should have exact text "Welcome"` |
| **Value** | `Then the element "profile.email" should have value "test@example.com"` |
| **URL** | `Then the url should be "https://example.com/dashboard"` |
| **State** | `Then the element "submit" should be disabled` |
| **API JSON Path** | `Then the response path "data.email" should be "user@example.com"` |
| **File** | `Then file "reports/export.csv" should contain text "Order ID"` |

---

## Common First-Time Issues

| Problem | What to Do |
| :--- | :--- |
| `npm install` fails with authentication errors | Confirm `.npmrc` has the Nexus registry and API key. |
| `Undefined step` | Run `npm run test:dry` and compare your wording with the reusable step guide. |
| `Key "x" not found` | Confirm the locator exists in `locators/<page>.js` and the feature uses `"page.key"`. |
| Browser does not launch | Run `npm run test:edge` or `npm run test:chrome` based on the installed browser. |
| Wrong environment opens | Check `TEST_ENV` or use `npm run test:sat`, `npm run test:stage`, or `npm run test:prod`. |

---

## Project Structure

- **`features/`**: Gherkin feature files (`.feature`).
- **`locators/`**: JavaScript locator maps using `page.element` keys.
- **`step-definitions/`**: Project-specific business steps, custom assertions, and app flows.
- **`setup/`**: Cucumber hooks for browser lifecycle and scenario setup/cleanup.
- **`config/`**: Environment profiles and credentials.
- **`lib/`**: Local packaged `playwright-bdd-steps` tarball.
- **`docs/`**: Framework usage guide and reusable step documentation.
