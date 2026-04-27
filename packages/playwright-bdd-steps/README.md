# playwright-bdd-steps

> Enterprise-grade codeless BDD step library for Playwright + Cucumber  
> **213 reusable Gherkin steps** covering UI, API, network mocking, device simulation, accessibility, and state management.

---

## Installation

### From a local pack (Phase 1 — internal)
```bash
npm install ./playwright-bdd-steps-1.0.0.tgz
```

### From Nexus (Phase 2 — private registry)
```bash
npm install playwright-bdd-steps --registry https://nexus.your-org.com/repository/npm-private/
```

---

## Setup

### 1. Configure your `cucumber.js`

```js
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      // Load all shared steps from the installed package (READ-ONLY)
      'node_modules/playwright-bdd-steps/src/steps/**/*.js',
      // Load your project-specific steps (login, app-specific flows)
      'step-definitions/**/*.js',
      // Cucumber hooks
      'setup/hooks.js',
    ],
    format: ['progress', 'html:reports/report.html'],
    parallel: 1,
    timeout: 60 * 1000,
  },
};
```

### 2. Create your locator files (`locators/<page>.js`)

```js
// locators/login.js
module.exports = {
  username:    '#user-name',
  password:    '#password',
  loginButton: '#login-button',
  error:       "[data-test='error']",

  // Parameterized selectors (impossible in JSON!)
  userRow: (name) => `tr:has-text("${name}")`,
};
```

### 3. Set environment variables (`.env`)

```
BASE_URL=https://your-app.com
LOGIN_URL=https://your-app.com/login
```

### 4. Write feature files

```gherkin
Feature: User Login

  Scenario: Successful login
    Given I navigate to "LOGIN_URL"
    When I fill "login.username" with "admin"
    And  I fill "login.password" with "secret"
    And  I click "login.loginButton"
    Then the element "login.error" should be hidden
    And  the url should contain "/dashboard"
```

---

## Available Steps (213 total)

| Category | File | Steps |
|---|---|---|
| Actions (click, fill, scroll) | `action.steps.js` | 45 |
| Assertions | `assertion.steps.js` | 42 |
| Element locators (role-based) | `element.steps.js` | 28 |
| Memory & Faker data | `memory.steps.js` | 18 |
| Navigation | `navigation.steps.js` | 9 |
| Browser (tabs, cookies, storage) | `browser.steps.js` | 15 |
| Wait & sync | `wait.steps.js` | 6 |
| API testing | `api-steps.js` | 7 |
| Network mocking | `network.steps.js` | 9 |
| Device & mobile | `device.steps.js` | 9 |
| Auth state (login once) | `auth.steps.js` | 2 |

> **Full step documentation** is included as inline comments in each step file.  
> Open any file in `node_modules/playwright-bdd-steps/src/steps/` to read usage examples.

---

## Locator Key Format

All `{string}` element parameters use the format `"page.key"`:

```
"login.username"        →  locators/login.js → username → '#user-name'
"inventory.title"       →  locators/inventory.js → title → '.title'
```

Raw selectors are passed through automatically:
```
"#some-id"              →  '#some-id'  (returned as-is)
"text=Click Me"         →  'text=Click Me'
"//button"              →  '//button'
```

---

## Versioning Policy

| Version | Meaning |
|---|---|
| `1.x.x` | New steps added — backward compatible |
| `2.0.0` | Breaking changes (step name changes) — requires migration |

---

## DO NOT MODIFY step files directly

The steps in this package are maintained centrally. To request changes or additions:
1. Raise a request with the QA Platform team
2. The team updates the package and releases a new version
3. Consuming projects update via `npm update playwright-bdd-steps`

---

*Maintained by QA Tools team. Internal use only.*
