# Automated Testing Framework

A robust, enterprise-grade generic automation framework combining **Cucumber (Gherkin)** matching with **Playwright (JavaScript)** for reliable End-to-End (E2E) testing. This framework is designed to clear the path for non-technical team members to write automated tests using simple English phrases.

## Prerequisites
- **Node.js**: (v14 or higher recommended)
- **Text Editor**: VS Code (recommended)

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Install Browsers**:
   ```bash
   npx playwright install
   ```

## Quick Start

### Run All Tests
```bash
npm test
```

### Run Specific Feature
```bash
npx cucumber-js features/login.feature
```

### View Reports
After execution, an HTML report is generated at `reports/report.html`.

### Troubleshooting (Restricted Environments)

If `npx playwright install` fails due to firewall/network issues, follow these steps:

1. **Skip Download**: Set this environment variable to stop Playwright from downloading headers/browsers.
   ```bash
   export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
   ```

2. **Use System Browser**: Tell Playwright to use the Chrome or Edge already installed on your laptop.
   ```bash
   # Use Microsoft Edge
   npm run test:edge

   # Use Google Chrome
   npm run test:chrome
   ```

---

## Writing Tests (Codeless Workflow)

This framework allows you to create valid automated tests without writing code. Follow this simple 2-step process.

### Step 1: Add Locators
Find the CSS selector for your element and add it to `locators/<page>.json`.

**Example**: `locators/login.json`
```json
{
  "username": "#user-name",
  "submit": "#login-button",
  "errorMessage": "[data-test='error']"
}
```

### Step 2: Write Feature
Use the **Locator Key** (`page.element`) in your English steps.

**Example**: `features/login.feature`
```gherkin
Feature: Login Scenarios

  Scenario: Valid Login
    Given I navigate to "BASE_URL"
    When I fill "login.username" with "standard_user"
    And I click "login.submit"
    Then I should see "inventory.title"
```

---

## Step Definition Cheat Sheet

Use these pre-built English phrases to control your tests.

### Interactions
| Action | Step Usage |
| :--- | :--- |
| **Click** | `When I click "login.submit"` |
| **Type** | `When I type "password123" into "login.password"` |
| **Fill** | `When I fill "login.username" with "admin"` |
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

---

## Project Structure

- **`features/`**: Gherkin feature files (`.feature`).
- **`locators/`**: JSON files storing element selectors.
- **`step-definitions/`**: Backend code mapping English steps to Playwright actions.
- **`actions/`**: Reusable low-level browser action libraries.
- **`config/`**: Configuration files (Environment variables).
