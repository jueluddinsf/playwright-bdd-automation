# ─────────────────────────────────────────────────────────────────────────────
# END-TO-END STARTER — features/tests/e2e/
# ─────────────────────────────────────────────────────────────────────────────
#
# This is your working folder for full end-to-end flows that span multiple pages
# or mix UI actions with API validation.
#
# TIPS FOR E2E TESTS
# ──────────────────
# • Use the "Login Once" pattern for authenticated flows:
#     Given I save the browser state to "admin.json"   ← run once in @setup
#     Given I load the browser state from "admin.json" ← use in every other test
#
# • Tag scenarios to control what runs in CI:
#     @smoke       ← fast, critical path — run on every PR
#     @regression  ← full suite — run nightly
#     @ignore      ← skipped everywhere
#
# STEP REFERENCE
# ──────────────
# All 213 steps are in: node_modules/playwright-bdd-steps/src/steps/
# Open any .js file in that folder to see usage examples.
#
# RUN YOUR TESTS
# ──────────────
#   npm test                       ← everything
#   npm run test:smoke             ← @smoke only
#   npm run test:regression        ← @regression only
#   npm run test:headed            ← watch the browser
#
# ─────────────────────────────────────────────────────────────────────────────

Feature: [Your End-to-End Flow Here]

  Background:
    # Anything in Background runs before every Scenario in this file.
    # Good place for login or navigation to a start page.
    Given I navigate to "https://your-app.com"

  @smoke
  Scenario: Complete a core user journey
    # UI interactions
    When I click "nav.loginLink"
    And  I fill "login.username" with "user@test.com"
    And  I fill "login.password" with "secret"
    And  I click "login.loginButton"

    # Validate the outcome
    Then the url should contain "/dashboard"
    And  I should see text "Welcome back"

    # Save state so other tests can skip login
    When I save the browser state to "user-session.json"
