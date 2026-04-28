@auth
Feature: Authenticated Scenario

  Scenario: Verify Auth State is Injected
    # Note: We do NOT navigate to login. We go straight to inventory.
    Given I navigate to "https://www.saucedemo.com/inventory.html"
    # If the storage state is injected, we will see the inventory instead of being redirected to login
    Then the url should be "https://www.saucedemo.com/inventory.html"
    And I should see "inventory.title"
