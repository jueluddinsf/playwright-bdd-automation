# Reusable Step Library Guide

This framework is designed to make Playwright + Cucumber automation codeless. Most tests are written by combining reusable Gherkin steps from the locally packaged `playwright-bdd-steps` library with locator keys from this project.

The goal is simple:

1. Add selectors once in `locators/*.js`.
2. Write scenarios in plain English.
3. Group repeated flows into business steps only when scenarios need to stay compact.

## Table of Contents

- [How the Step Library Is Loaded](#how-the-step-library-is-loaded)
- [Reusable Step Count](#reusable-step-count)
- [Codeless Extension Steps](#codeless-extension-steps)
- [Codeless Workflow](#codeless-workflow)
- [Environment Switching](#environment-switching)
- [Tags and Test Selection](#tags-and-test-selection)
- [Locator Rules](#locator-rules)
- [Scenario Patterns](#scenario-patterns)
- [Common UI Steps](#common-ui-steps)
- [Assertion Steps](#assertion-steps)
- [API Testing Steps](#api-testing-steps)
- [Saved Values and Test Data](#saved-values-and-test-data)
- [Browser, Device, Network, and Auth Helpers](#browser-device-network-and-auth-helpers)
- [How to Discover Available Steps](#how-to-discover-available-steps)
- [Composite Step Definitions](#composite-step-definitions)
- [When to Add Custom Step Definitions](#when-to-add-custom-step-definitions)
- [Best Practices](#best-practices)
- [Quick Troubleshooting](#quick-troubleshooting)

## How the Step Library Is Loaded

The shared package is installed from:

```json
"playwright-bdd-steps": "file:lib/playwright-bdd-steps-1.0.3.tgz"
```

Cucumber loads those reusable steps automatically from `cucumber.js`:

```js
require: [
    'node_modules/playwright-bdd-steps/src/steps/**/*.js',
    'step-definitions/**/*.js',
    'setup/hooks.js',
]
```

Treat files inside `node_modules/playwright-bdd-steps` as read-only. If a reusable step is missing, add a project-specific step in `step-definitions/` or request an update to the package.

## Reusable Step Count

The locally packaged `playwright-bdd-steps` library currently provides 222 reusable Cucumber steps.

| Category/File | Reusable Steps | Main Coverage |
| --- | ---: | --- |
| `action.steps.js` | 47 | Clicks, typing, forms, keyboard, scrolling, iframes |
| `assertion.steps.js` | 47 | Visibility, text, values, state, URL, title, screenshots |
| `element.steps.js` | 27 | Role, test id, label, text, placeholder, and found-element helpers |
| `browser.steps.js` | 17 | Tabs, alerts, cookies, storage, viewport |
| `memory.steps.js` | 16 | Saved values and generated test data |
| `navigation.steps.js` | 12 | URL navigation, browser history, screenshots, page load waits |
| `api-steps.js` | 9 | API request setup and response assertions |
| `device.steps.js` | 9 | Device simulation, geolocation, permissions, color scheme |
| `network.steps.js` | 9 | Request mocking, blocking, request/response waits |
| `wait.steps.js` | 6 | Explicit waits for time, elements, and text |
| `auth.steps.js` | 2 | Save and load browser state |
| `codeless-extension.steps.js` | 21 | Bulk forms, config/env values, saved values, JSON paths, files, tables, lists |

Recalculate the count after updating the package:

```bash
for f in node_modules/playwright-bdd-steps/src/steps/*.js; do printf "%s " "$(basename "$f")"; rg -c "^(Given|When|Then)\\(" "$f" || true; done
```

## Codeless Extension Steps

These steps live in the packaged library at `node_modules/playwright-bdd-steps/src/steps/codeless-extension.steps.js`.

### Bulk Form Steps

Use these when a scenario has several fields or clicks in a row.

```gherkin
When I fill the following fields:
  | login.username | standard_user |
  | login.password | secret_sauce  |
And I click the following elements:
  | login.loginButton |
```

Available steps:

| Goal | Step |
| --- | --- |
| Fill many fields | `When I fill the following fields:` |
| Type into many fields | `When I type into the following fields:` |
| Click many elements | `When I click the following elements:` |

### Saved, Config, and Environment Values

Use these to avoid hardcoding repeat data in feature files.

```gherkin
When I fill "login.username" with config value "CREDENTIALS.VALID.USERNAME"
And I fill "login.password" with config value "CREDENTIALS.VALID.PASSWORD"
```

```gherkin
When I generate a random email and fill "register.email" and save as "email"
And I fill "register.confirmEmail" with saved value "email"
Then the element "profile.email" should contain saved value "email"
```

Available steps:

| Goal | Step |
| --- | --- |
| Fill from saved memory | `When I fill "field.key" with saved value "alias"` |
| Fill from `config/env.js` | `When I fill "field.key" with config value "CREDENTIALS.VALID.USERNAME"` |
| Fill from environment variable | `When I fill "field.key" with env value "USERNAME"` |
| Assert text contains saved value | `Then the element "profile.email" should contain saved value "email"` |
| Assert input has saved value | `Then the element "profile.email" should have saved value "email"` |
| Assert text contains config value | `Then the element "banner.user" should contain config value "CREDENTIALS.VALID.USERNAME"` |

### Nested API JSON Path Assertions

Use these when API responses have nested objects or arrays.

```gherkin
Given I send a "GET" request to "https://reqres.in/api/users/2"
Then the response path "data.email" should be "janet.weaver@reqres.in"
And the response path "data.id" should exist
```

Available steps:

| Goal | Step |
| --- | --- |
| Nested value equals | `Then the response path "data.email" should be "test@example.com"` |
| Nested value exists | `Then the response path "data.id" should exist` |
| Array length | `Then the response array "data" should have 6 items` |

### Download and File Assertions

Use these when validating generated files, exports, and downloads.

```gherkin
When I download file from "reports.exportCsv" and save as "reports/export.csv"
Then the downloaded file should exist
And the downloaded file should contain text "Order ID"
```

Available steps:

| Goal | Step |
| --- | --- |
| Download and remember file | `When I download file from "reports.exportCsv" and save as "reports/export.csv"` |
| File exists | `Then file "reports/export.csv" should exist` |
| File contains text | `Then file "reports/export.csv" should contain text "Order ID"` |
| Last downloaded file exists | `Then the downloaded file should exist` |
| Last downloaded file contains text | `Then the downloaded file should contain text "Order ID"` |

### Table, List, and Collection Assertions

Use these for dashboards, grids, search results, and repeated UI elements.

```gherkin
Then the table "users.table" should contain row with text "John Smith"
And every element matching "inventory.itemName" should be visible
```

Available steps:

| Goal | Step |
| --- | --- |
| Table row contains text | `Then the table "users.table" should contain row with text "John Smith"` |
| List contains item | `Then the list "search.results" should contain item "Sauce Labs Backpack"` |
| Every matched element visible | `Then every element matching "inventory.itemName" should be visible` |
| Every matched element contains text | `Then every element matching "status.badges" should contain text "Active"` |

## Codeless Workflow

### 1. Create or Update a Locator File

Create one file per page or domain under `locators/`. The file name becomes the locator namespace.

Example: `locators/login.js`

```js
module.exports = {
    username: '#user-name',
    password: '#password',
    loginButton: '#login-button',
    error: "[data-test='error']",
};
```

Use the locator in feature files as `page.key`:

```gherkin
When I fill "login.username" with "standard_user"
And I click "login.loginButton"
Then I should see "login.error"
```

### 2. Write a Feature File

Feature files live under `features/`. Prefer `features/tests/` for real tests and `features/examples/` for demonstrations.

```gherkin
Feature: Login

  @smoke
  Scenario: User logs in with valid credentials
    Given I navigate to "https://www.saucedemo.com"
    When I fill "login.username" with "standard_user"
    And I fill "login.password" with "secret_sauce"
    And I click "login.loginButton"
    Then I should see "inventory.title"
    And the element "inventory.title" should have exact text "Products"
    And the url should contain "inventory.html"
```

### 3. Run the Test

```bash
npm test
npm run test:ui
npm run test:smoke
npx cucumber-js features/tests/ui/my-feature.feature
```

Use a dry run when writing new scenarios to check whether every step is already defined:

```bash
npm run test:dry
```

## Environment Switching

Use `TEST_ENV` to switch between environment profiles without changing feature files.

```bash
npm run test:local
npm run test:sat
npm run test:stage
npm run test:prod
```

You can also pass the environment directly:

```bash
TEST_ENV=sat npm test
TEST_ENV=stage npm run test:smoke
```

Environment profiles live in `config/env.js`:

```js
const ENVIRONMENTS = {
    local: {
        BASE_URL: 'https://www.saucedemo.com',
        CREDENTIALS: {
            VALID: {
                USERNAME: 'standard_user',
                PASSWORD: 'secret_sauce',
            },
        },
    },
    sat: {
        BASE_URL: 'https://sat.example.com',
        CREDENTIALS: {
            VALID: {
                USERNAME: 'sat_user',
                PASSWORD: 'sat_password',
            },
        },
    },
};
```

The selected profile is exported from `config/env.js` and also sets `process.env.BASE_URL`, so packaged reusable steps can use it:

```gherkin
Given I navigate to "BASE_URL"
Given I navigate to the "/inventory.html" url path
When I fill "login.username" with config value "CREDENTIALS.VALID.USERNAME"
And I fill "login.password" with config value "CREDENTIALS.VALID.PASSWORD"
```

Default behavior:

| Setting | Behavior |
| --- | --- |
| No `TEST_ENV` | Uses `local` |
| `TEST_ENV=sat` | Uses `ENVIRONMENTS.sat` |
| `TEST_ENV=stage` | Uses `ENVIRONMENTS.stage` |
| `TEST_ENV=prod` | Uses `ENVIRONMENTS.prod` |
| Unknown value | Fails fast and lists available environments |

Use `BASE_URL` only when you need a one-off override:

```bash
TEST_ENV=sat BASE_URL=https://preview.example.com npm test
```

## Tags and Test Selection

Tags let you group scenarios without changing file structure.

```gherkin
@smoke @login
Scenario: User logs in with valid credentials
  Given I navigate to "https://www.saucedemo.com"
  When I fill "login.username" with "standard_user"
  And I fill "login.password" with "secret_sauce"
  And I click "login.loginButton"
  Then I should see "inventory.title"
```

Run tagged tests:

```bash
npm run test:smoke
npm run test:regression
TAG=@login npm run test:tag
npx cucumber-js --tags "@smoke and @login"
npx cucumber-js --tags "not @wip"
```

Recommended tag names:

| Tag | Use |
| --- | --- |
| `@smoke` | Fast confidence tests for critical paths |
| `@regression` | Broader suite before release |
| `@api` | API-only scenarios |
| `@ui` | Browser UI scenarios |
| `@setup` | Session setup or precondition scenarios |
| `@wip` | Work in progress, usually excluded from CI |

## Locator Rules

Most reusable UI steps accept a `{string}` that resolves through `LocatorManager`.

Recommended locator key format:

```text
"pageName.elementName"
```

Examples:

```text
"login.username"       -> locators/login.js -> username
"inventory.title"      -> locators/inventory.js -> title
"checkout.submitOrder" -> locators/checkout.js -> submitOrder
```

Locator values can be CSS, XPath, Playwright text selectors, or functions used from custom code:

```js
module.exports = {
    submit: '#submit',
    pageTitle: '.title',
    cancelByText: 'text=Cancel',
    itemByName: (name) => `.inventory_item:has-text("${name}")`,
};
```

Raw selectors also pass through when needed:

```gherkin
Then I should see "#global-banner"
And I should see "text=Welcome"
```

Prefer locator keys over raw selectors in feature files. It keeps scenarios readable and makes selector maintenance easier.

## Scenario Patterns

### Basic UI Flow

Use this pattern for most user journeys:

```gherkin
Scenario: Add an item to the cart
  Given I navigate to "https://www.saucedemo.com"
  When I fill "login.username" with "standard_user"
  And I fill "login.password" with "secret_sauce"
  And I click "login.loginButton"
  And I click "inventory.items" containing text "Sauce Labs Backpack"
  Then the url should contain "inventory-item.html"
```

### Login Once, Reuse Browser State

Use the auth state helpers when repeated UI login makes the suite slow.

Setup scenario:

```gherkin
@setup
Scenario: Save logged-in user state
  Given I navigate to "https://www.saucedemo.com"
  When I fill "login.username" with "standard_user"
  And I fill "login.password" with "secret_sauce"
  And I click "login.loginButton"
  Then I should see "inventory.title"
  When I save the browser state to "standard-user.json"
```

Daily test scenario:

```gherkin
Scenario: Open inventory with saved session
  When I load the browser state from "standard-user.json"
  Given I navigate to "https://www.saucedemo.com/inventory.html"
  Then I should see "inventory.title"
```

### API Plus UI Validation

Use API steps to set up or validate backend state, then continue with UI steps in the same scenario when useful.

```gherkin
Scenario: API health check before opening app
  Given I send a "GET" request to "https://reqres.in/api/users/2"
  Then the response status should be 200
  And the response should contain "data"
  Given I navigate to "https://www.saucedemo.com"
  Then I should see text "Swag Labs"
```

## Common UI Steps

### Navigation

| Goal | Step |
| --- | --- |
| Open a full URL or environment URL key | `Given I navigate to "https://example.com"` |
| Open a named page or URL key | `Given I am on the "login" page` |
| Open a BASE_URL path | `Given I navigate to the "/dashboard" url path` |
| Go back or forward | `When I go back` / `When I go forward` |
| Reload | `When I reload the page` |
| Wait for page load | `When I wait for the page to load` |
| Wait for DOM ready | `When I wait for the DOM to be ready` |
| Take a screenshot | `When I take a screenshot` |

### Clicks and Mouse Actions

| Goal | Step |
| --- | --- |
| Click | `When I click "login.loginButton"` |
| Click more than once | `When I click "cart.increment" 3 times` |
| Double click | `When I double click "table.cell"` |
| Right click | `When I right click "file.row"` |
| Click only if visible | `When I click "modal.close" if present` |
| Click visible text | `When I click on text "Accept All"` |
| Click matching card/item text | `When I click "inventory.items" containing text "Sauce Labs Backpack"` |
| Click item by 1-based index | `When I click the 2 item in "inventory.items"` |
| Hover | `When I hover over "menu.products"` |
| Drag and drop | `When I drag "kanban.card" to "kanban.doneColumn"` |

### Inputs and Forms

| Goal | Step |
| --- | --- |
| Fill and clear existing value | `When I fill "login.username" with "standard_user"` |
| Type like a keyboard | `When I type "hello" into "search.input"` |
| Type and press Enter | `When I type "playwright" into "search.input" and press Enter` |
| Slow type for debounce fields | `When I slowly type "john" into "user.autocomplete"` |
| Clear field | `When I clear "search.input"` |
| Clear then type | `When I clear "profile.name" and type "Jane"` |
| Select by value | `When I select option "US" from "profile.country"` |
| Select by visible text | `When I select option by text "United States" from "profile.country"` |
| Select by index | `When I select option by index 2 from "profile.country"` |
| Check checkbox/radio | `When I check "signup.terms"` |
| Uncheck checkbox | `When I uncheck "signup.newsletter"` |
| Upload file | `When I upload file "fixtures/resume.pdf" to "profile.upload"` |
| Submit form | `When I submit the form "checkout.form"` |

### Keyboard and Scrolling

| Goal | Step |
| --- | --- |
| Press key on element | `When I press "Enter" on "search.input"` |
| Press key globally | `When I press the "Escape" key globally` |
| Press Tab repeatedly | `When I press Tab 3 times` |
| Press Escape | `When I press Escape` |
| Focus element | `When I focus on "login.username"` |
| Blur element | `When I blur "login.username"` |
| Scroll to element | `When I scroll to "footer.links"` |
| Scroll page bottom/top | `When I scroll to the bottom of the page` |
| Scroll by pixels | `When I scroll by 500 pixels vertically and 0 pixels horizontally` |

### Waits

| Goal | Step |
| --- | --- |
| Wait fixed seconds | `When I wait for 2 seconds` |
| Wait fixed milliseconds | `When I wait for 500 milliseconds` |
| Wait until visible | `When I wait for "login.error" to be visible` |
| Wait until hidden | `When I wait for "spinner.loading" to be hidden` |
| Wait until attached | `When I wait for "modal.container" to be attached` |
| Wait until detached | `When I wait for "toast.message" to be detached` |
| Wait for page text | `When I wait for text "Order complete" to appear` |

Prefer element or network waits over fixed sleeps. Fixed sleeps slow the suite and can still be flaky.

## Assertion Steps

### Visibility and Text

| Goal | Step |
| --- | --- |
| Element visible | `Then I should see "inventory.title"` |
| Element hidden | `Then I should not see "login.error"` |
| Explicit visible check | `Then the element "login.loginButton" should be visible` |
| Explicit hidden check | `Then the element "spinner.loading" should be hidden` |
| Contains text | `Then the element "login.error" should contain text "locked out"` |
| Exact text | `Then the element "inventory.title" should have exact text "Products"` |
| Page contains text | `Then I should see text "Swag Labs"` |
| Page does not contain text | `Then I should not see text "Unauthorized"` |

### Values, State, and Attributes

| Goal | Step |
| --- | --- |
| Input has value | `Then the element "profile.email" should have value "test@example.com"` |
| Input contains value | `Then the element "search.input" should contain value "playwright"` |
| Element empty | `Then the element "search.input" should be empty` |
| Enabled | `Then the element "checkout.submit" should be enabled` |
| Disabled | `Then the element "checkout.submit" should be disabled` |
| Checked | `Then the element "signup.terms" should be checked` |
| Editable | `Then the element "profile.name" should be editable` |
| Attribute value | `Then the element "profile.avatar" should have attribute "alt" with value "User Avatar"` |
| CSS property | `Then the element "banner.status" css property "color" should be "rgb(0, 128, 0)"` |
| Class | `Then the element "tab.active" should have class "active"` |

### Counts, URL, Title, and Screenshots

| Goal | Step |
| --- | --- |
| Exact count | `Then I should see 6 elements matching "inventory.items"` |
| More than count | `Then I should see more than 0 elements matching "inventory.items"` |
| Fewer than count | `Then I should see fewer than 10 elements matching "inventory.items"` |
| At least count | `Then I should see at least 1 elements matching "inventory.items"` |
| Exact URL | `Then the url should be "https://example.com/dashboard"` |
| URL contains | `Then the url should contain "/dashboard"` |
| Exact title | `Then the page title should be "Dashboard"` |
| Title contains | `Then the page title should contain "Dashboard"` |
| Page screenshot | `Then the page screenshot should match "dashboard.png"` |
| Element screenshot | `Then the element "chart.main" screenshot should match "chart.png"` |

## API Testing Steps

The library also includes reusable API steps.

```gherkin
Feature: User API

  Scenario: Create a user
    Given I set the request body to:
      """
      { "name": "John", "job": "Developer" }
      """
    And I set request header "Authorization" to "Bearer token"
    And I send a "POST" request to "https://reqres.in/api/users"
    Then the response status should be 201
    And the response should contain "name" with value "John"
    And the response should contain "id"
```

Available API assertions include:

| Goal | Step |
| --- | --- |
| Set JSON body | `Given I set the request body to:` |
| Set header | `Given I set request header "Authorization" to "Bearer token"` |
| Send request | `Given I send a "GET" request to "https://api.example.com/users"` |
| Status equals | `Then the response status should be 200` |
| Status not equals | `Then the response status should not be 500` |
| JSON key/value | `Then the response should contain "name" with value "John"` |
| JSON key exists | `Then the response should contain "id"` |
| Header equals | `Then the response header "content-type" should be "application/json"` |
| Body text contains | `Then the response body should contain text "success"` |

## Saved Values and Test Data

Use memory steps when a scenario needs to reuse values generated or captured earlier.

```gherkin
Scenario: Register with generated email
  Given I navigate to "https://example.com/register"
  When I generate a random email and fill "register.email" and save as "email"
  And I fill "register.confirmEmail" with the saved "email" value
  And I click "register.submit"
  Then the saved "email" value should contain "@"
```

Common memory and data steps:

| Goal | Step |
| --- | --- |
| Save element text | `When I save the text of "order.number" as "orderId"` |
| Save input value | `When I save the value of "profile.email" as "email"` |
| Save attribute | `When I save the attribute "href" of "profile.link" as "profileUrl"` |
| Assert saved exact value | `Then the saved "orderId" value should equal "ORD-123"` |
| Assert saved contains | `Then the saved "orderId" value should contain "ORD-"` |
| Generate email | `When I generate a random email and fill "register.email" and save as "email"` |
| Generate first name | `When I generate a random first name and fill "register.firstName" and save as "firstName"` |
| Generate last name | `When I generate a random last name and fill "register.lastName" and save as "lastName"` |
| Generate phone | `When I generate a random phone number and fill "register.phone" and save as "phone"` |
| Generate number | `When I generate a random number between 100 and 999 and save as "id"` |
| Generate UUID | `When I generate a random UUID and save as "correlationId"` |
| Today's date | `When I fill "booking.date" with today's date` |
| Timestamp | `When I fill "order.reference" with current timestamp` |

## Browser, Device, Network, and Auth Helpers

Use these for advanced scenarios:

| Area | Examples |
| --- | --- |
| Tabs | `When I open a new tab`, `When I switch to tab 2`, `When I close the current tab` |
| Alerts | `When I accept the next alert`, `When I dismiss the next alert`, `When I type "Yes" into the next alert` |
| Storage | `When I clear cookies`, `When I set "token" local storage value to "abc"` |
| Viewport | `When I set window size to 1280 by 720`, `When I resize window to width 390 and height 844` |
| Device | `When I simulate device "iPhone 13"` |
| Permissions | `When I grant permission "geolocation"`, `When I deny permission "notifications"` |
| Network | `When I mock the API endpoint "**/users" with status 500`, `When I block requests to "**/*.png"` |
| Auth state | `When I save the browser state to "auth-state.json"`, `When I load the browser state from "auth-state.json"` |

## How to Discover Available Steps

The reusable package contains many more steps than the most common examples above. The source files are intentionally grouped by behavior:

| File | Contains |
| --- | --- |
| `action.steps.js` | Clicks, typing, forms, keyboard, scroll, iframe actions |
| `assertion.steps.js` | Visibility, text, values, URL, title, counts, visual assertions |
| `api-steps.js` | Request body, headers, HTTP calls, response assertions |
| `auth.steps.js` | Save and load browser storage state |
| `browser.steps.js` | Tabs, alerts, cookies, local/session storage, viewport |
| `device.steps.js` | Device simulation, geolocation, permissions, dark/light mode |
| `element.steps.js` | Role, test id, label, text, placeholder, and found-element helpers |
| `memory.steps.js` | Saved values and random test data |
| `navigation.steps.js` | URL navigation, history, screenshots, page load waits |
| `network.steps.js` | Mocking, blocking, and waiting for requests/responses |
| `wait.steps.js` | Explicit waits for time, elements, and text |
| `codeless-extension.steps.js` | Bulk forms, config/env values, JSON paths, files, tables, lists |

To print every loaded reusable step expression:

```bash
rg -n "^(Given|When|Then)\\(" node_modules/playwright-bdd-steps/src/steps
```

To search for a step by topic:

```bash
rg -n "download|iframe|cookie|response|screenshot" node_modules/playwright-bdd-steps/src/steps
```

Use the package source as the step reference, but do not edit it directly.

## Composite Step Definitions

Reusable steps are excellent for small actions, but long scenarios become hard to read when every click and fill is listed every time. When the same sequence appears in multiple scenarios, group it into a project-specific composite or business-flow step.

Important: Cucumber JS does not provide a supported public API to run one Gherkin step from inside another Gherkin step. Instead of calling step text inside step text, put the shared behavior in helper code and call that helper from your composite step.

In this framework, a composite step means:

- The feature file uses one readable business step.
- The step definition internally performs several low-level actions.
- The implementation reuses `LocatorManager`, packaged action helpers, flow helper functions, and Playwright assertions.
- The implementation does not call Gherkin step text from inside another step definition.

Before grouping:

```gherkin
Scenario: View products after login
  Given I navigate to "https://www.saucedemo.com"
  When I fill "login.username" with "standard_user"
  And I fill "login.password" with "secret_sauce"
  And I click "login.loginButton"
  Then I should see "inventory.title"
  And the element "inventory.title" should have exact text "Products"
```

After composing the repeated low-level steps:

```gherkin
Scenario: View products after login
  Given I am logged in as a standard user
  Then I should see the products page
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

Do this instead. The composite step definition performs the repeated work behind the scenes:

```js
const { Given } = require('@cucumber/cucumber');
const LocatorManager = require('playwright-bdd-steps/src/utils/LocatorManager');
const inputActions = require('playwright-bdd-steps/src/actions/InputActions');
const clickActions = require('playwright-bdd-steps/src/actions/ClickActions');
const env = require('../config/env');

Given('I am logged in as a standard user', async function () {
    await this.page.goto(env.BASE_URL);
    await inputActions.fill(
        this.page,
        LocatorManager.getSelector('login.username'),
        env.CREDENTIALS.VALID.USERNAME
    );
    await inputActions.fill(
        this.page,
        LocatorManager.getSelector('login.password'),
        env.CREDENTIALS.VALID.PASSWORD
    );
    await clickActions.click(this.page, LocatorManager.getSelector('login.loginButton'));
});
```

This one business step composes four lower-level actions: navigate, fill username, fill password, and click login.

### Where Composite Steps Go

Create composite steps in `step-definitions/`, not inside the packaged reusable library.

Example: `step-definitions/business-flow.steps.js`

```js
const { Given, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LocatorManager = require('playwright-bdd-steps/src/utils/LocatorManager');
const inputActions = require('playwright-bdd-steps/src/actions/InputActions');
const clickActions = require('playwright-bdd-steps/src/actions/ClickActions');

Given('I am logged in as a standard user', async function () {
    await this.page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');

    await inputActions.fill(
        this.page,
        LocatorManager.getSelector('login.username'),
        'standard_user'
    );
    await inputActions.fill(
        this.page,
        LocatorManager.getSelector('login.password'),
        'secret_sauce'
    );
    await clickActions.click(this.page, LocatorManager.getSelector('login.loginButton'));
});

Then('I should see the products page', async function () {
    await expect(this.page.locator(LocatorManager.getSelector('inventory.title'))).toBeVisible();
    await expect(this.page.locator(LocatorManager.getSelector('inventory.title'))).toHaveText('Products');
});
```

This keeps the feature file short while still using the same locator keys and reusable action helpers as the packaged steps.

### Parameterized Composite Steps

Use parameters when the flow is reusable with different data.

```gherkin
Scenario: Login as locked out user
  Given I log in with username "locked_out_user" and password "secret_sauce"
  Then I should see "login.error"
```

```js
const { Given } = require('@cucumber/cucumber');
const LocatorManager = require('playwright-bdd-steps/src/utils/LocatorManager');
const inputActions = require('playwright-bdd-steps/src/actions/InputActions');
const clickActions = require('playwright-bdd-steps/src/actions/ClickActions');

Given('I log in with username {string} and password {string}', async function (username, password) {
    await this.page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
    await inputActions.fill(this.page, LocatorManager.getSelector('login.username'), username);
    await inputActions.fill(this.page, LocatorManager.getSelector('login.password'), password);
    await clickActions.click(this.page, LocatorManager.getSelector('login.loginButton'));
});
```

### Shared Helper Functions for Larger Flows

If multiple grouped steps need the same flow, move the flow into a small helper and call it from step definitions.

Example: `step-definitions/flows/login.flow.js`

```js
const LocatorManager = require('playwright-bdd-steps/src/utils/LocatorManager');
const inputActions = require('playwright-bdd-steps/src/actions/InputActions');
const clickActions = require('playwright-bdd-steps/src/actions/ClickActions');

async function login(page, username, password) {
    await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
    await inputActions.fill(page, LocatorManager.getSelector('login.username'), username);
    await inputActions.fill(page, LocatorManager.getSelector('login.password'), password);
    await clickActions.click(page, LocatorManager.getSelector('login.loginButton'));
}

module.exports = { login };
```

Example: `step-definitions/business-flow.steps.js`

```js
const { Given } = require('@cucumber/cucumber');
const { login } = require('./flows/login.flow');

Given('I am logged in as a standard user', async function () {
    await login(this.page, 'standard_user', 'secret_sauce');
});
```

### When to Create Composite Steps

Good candidates for composite steps:

- Login, logout, and user setup.
- Add item to cart, checkout, submit order.
- Create customer, search customer, update profile.
- API setup followed by UI verification.
- Any 4 or more low-level steps repeated across scenarios.

Avoid composing when:

- The scenario is clearer with the explicit low-level steps.
- The flow is used only once and is still changing often.
- The composite step hides the actual business behavior being tested.
- The composite step becomes too broad, such as `When I complete the entire test`.

### Naming Composite Steps

Name composite steps in business language:

| Prefer | Avoid |
| --- | --- |
| `Given I am logged in as a standard user` | `Given I fill username password and click login` |
| `When I add product "Sauce Labs Backpack" to the cart` | `When I click product and click add cart` |
| `Then I should see the products page` | `Then I should see title and url and items` |

Do not call Gherkin step text from inside another step definition. Instead, reuse `LocatorManager`, action helpers, small flow helper functions, and Playwright assertions directly.

## When to Add Custom Step Definitions

Use reusable steps first. Add a custom step only when:

- The behavior combines many generic steps into a project-specific business action.
- The page requires special logic that cannot be expressed clearly in Gherkin.
- You need to use a parameterized locator function from `locators/*.js`.
- You need a custom assertion that should read like business language.

Project-specific steps belong in `step-definitions/`.

Example:

```js
const { When } = require('@cucumber/cucumber');
const LocatorManager = require('playwright-bdd-steps/src/utils/LocatorManager');

When('I add product {string} to the cart', async function (productName) {
    const selector = LocatorManager.getSelector('inventory.addToCartFor', productName);
    await this.page.locator(selector).click();
});
```

Then the feature stays clean:

```gherkin
When I add product "Sauce Labs Backpack" to the cart
```

## Best Practices

- Keep feature files readable by business users.
- Use `page.element` locator keys instead of selectors in Gherkin.
- Name locator files by page or domain, such as `login.js`, `inventory.js`, `checkout.js`.
- Name locator keys by purpose, not selector shape, such as `submitOrder` instead of `blueButton`.
- Keep reusable package files read-only.
- Run `npm run test:dry` after writing new scenarios.
- Avoid duplicating existing package steps in `step-definitions/`.
- Prefer explicit assertions at the end of every scenario.

## Quick Troubleshooting

| Problem | What to Check |
| --- | --- |
| `Undefined step` | The wording does not exactly match a loaded reusable or project step. Run `npm run test:dry`. |
| `Key "x" not found` | Check that `locators/<page>.js` exists and exports the requested key. |
| Element times out | Confirm the selector is correct, the page has loaded, and the element is visible. |
| Test works headed but not headless | Add a targeted wait or assert the page state before interacting. |
| API response assertion fails | Confirm the response is JSON for JSON key checks, or use body text/header assertions. |
