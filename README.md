# Automated Testing Framework

A robust, enterprise-grade codeless automation framework combining **Cucumber (Gherkin)** with **Playwright (JavaScript)** for reliable End-to-End (E2E), API, and regression testing. Tests are written in plain English using reusable steps from the locally packaged `playwright-bdd-steps` library.

The installed step library currently provides **222 reusable Gherkin steps** for UI actions, assertions, API testing, network mocking, device simulation, saved values, bulk forms, downloads, tables, and environment-driven test data.

## Prerequisites
- **Nexus npm repository access**: required to pull framework npm packages. Access request link: TBD.
- **Node.js**: v18 or higher. Access/download request link: TBD.
- **VS Code**: recommended editor. Download request link: TBD.
- **Chrome or Microsoft Edge**: installed locally. This framework uses the installed browser through Playwright `channel`; it does not require downloading Playwright-managed browsers.

## Installation

1. **Configure npm access**:
   Update your `.npmrc` with the Nexus registry and API key before installing dependencies.
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

### Validate Step Matching Without Running Browser Actions
```bash
npm run test:dry
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

---

## Writing Tests (Codeless Workflow)

This framework allows you to create valid automated tests without writing code. Follow this simple workflow.

### Step 1: Add Locators
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

### Step 2: Write Feature
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

For the full reusable step guide and catalog, see [docs/reusable-step-library-guide.md](docs/reusable-step-library-guide.md).

### Step 3: Group Repeated Flows
When scenarios become long, group repeated reusable steps into one project-specific business step in `step-definitions/`.

```gherkin
Scenario: Products are visible after login
  Given I am logged in as a standard user
  Then I should see "inventory.title"
```

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

## Project Structure

- **`features/`**: Gherkin feature files (`.feature`).
- **`locators/`**: JavaScript locator maps using `page.element` keys.
- **`step-definitions/`**: Project-specific business steps, custom assertions, and app flows.
- **`setup/`**: Cucumber hooks for browser lifecycle and scenario setup/cleanup.
- **`config/`**: Environment profiles and credentials.
- **`lib/`**: Local packaged `playwright-bdd-steps` tarball.
- **`docs/`**: Framework usage guide and reusable step documentation.
