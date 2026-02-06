Feature: Advanced Reusable Steps

    Scenario: Advanced Form and Browser Actions
        Given I navigate to "BASE_URL"
        Then the page title should be "Swag Labs"

        # Form filling
        When I fill "login.username" with "standard_user"
        And I press "Tab" on "login.username"
        And I fill "login.password" with "secret_sauce"

        # Interactions
        And I hover over "login.loginButton"
        And I click "login.loginButton"

        # Validation
        Then I should see "inventory.title"
        And the element "inventory.title" should have exact text "Products"
        And I should see 6 elements matching "inventory.items"

        # Browser Control
        When I reload the page
        Then I should see "inventory.title"

        When I click "text=Sauce Labs Backpack"
        Then I should see "inventory.backButton"

        When I go back
        Then I should see "inventory.firstItemName"

    Scenario: Advanced Assertions and Waits
        Given I navigate to "BASE_URL"
        When I type "standard_user" into "login.username"
        Then the element "login.username" should have value "standard_user"

        When I wait for "login.password" to be visible
        And I fill "login.password" with "secret_sauce"
        And I click "login.loginButton"

        Then the url should be "https://www.saucedemo.com/inventory.html"
        And the element "inventory.title" should have class "title"
