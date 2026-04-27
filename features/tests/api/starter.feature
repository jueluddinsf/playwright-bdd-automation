# ─────────────────────────────────────────────────────────────────────────────
# API STARTER — features/tests/api/
# ─────────────────────────────────────────────────────────────────────────────
#
# This is your working folder for REST API tests.
# No browser is opened — runs pure HTTP requests via Playwright's request context.
#
# STEP REFERENCE
# ──────────────
# Open node_modules/playwright-bdd-steps/src/steps/api-steps.js to see all steps.
#
# RUN YOUR TESTS
# ──────────────
#   npm run test:api               ← all API tests
#   npx cucumber-js features/tests/api/starter.feature   ← single file
#
# ─────────────────────────────────────────────────────────────────────────────

Feature: [Your API Name Here]

  @smoke
  Scenario: Verify a GET endpoint returns expected data
    Given I send a "GET" request to "https://your-api.com/resource/1"
    Then the response status should be 200
    And the response should contain "id"

  Scenario: Create a new resource via POST
    Given I set the request body to:
      """
      {
        "name": "Test Item",
        "status": "active"
      }
      """
    When I send a "POST" request to "https://your-api.com/resource"
    Then the response status should be 201
    And the response should contain "name" with value "Test Item"
