# ─────────────────────────────────────────────────────────────────────────────
# UI STARTER — features/tests/ui/
# ─────────────────────────────────────────────────────────────────────────────
#
# This is your working folder for UI (browser) tests.
#
# HOW TO USE LOCATORS
# ───────────────────
# All element parameters use the format: "page.key"
#   "login.username"      →  resolves via locators/login.js → username → '#user-name'
#   "checkout.total"      →  resolves via locators/checkout.js → total → '.total'
#
# Raw selectors also work directly:
#   "#some-id"            →  passed through as-is
#   "text=Click Me"       →  Playwright text locator
#
# STEP REFERENCE
# ──────────────
# The full step library is in: node_modules/playwright-bdd-steps/src/steps/
# Open any file there to see all available steps with examples (read-only).
#
# RUN YOUR TESTS
# ──────────────
#   npm run test:ui               ← all UI tests
#   npm run test:smoke            ← @smoke tagged scenarios only
#   npx cucumber-js features/tests/ui/my-feature.feature   ← single file
#
# ─────────────────────────────────────────────────────────────────────────────

Feature: [Your Feature Name Here]
  # Describe what this feature is testing in plain English.
  # As a [role], I want to [action] so that [benefit]

  @smoke
  Scenario: [Your first scenario]
    # Step 1: Navigate to your app
    Given I navigate to "https://your-app.com/login"

    # Step 2: Interact with elements using locator keys from locators/<page>.js
    When I fill "login.username" with "your-username"
    And  I fill "login.password" with "your-password"
    And  I click "login.loginButton"

    # Step 3: Assert the expected outcome
    Then the url should contain "/dashboard"
    And  I should see text "Welcome"
