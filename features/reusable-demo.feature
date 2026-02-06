Feature: Reusable Steps Demo

    Scenario: Login using generic steps
        Given I navigate to "BASE_URL"
        When I fill "login.username" with "standard_user"
        And I fill "login.password" with "secret_sauce"
        And I click "login.loginButton"
        Then I should see "inventory.title"
        And the url should contain "inventory.html"
        And the element "inventory.title" should have exact text "Products"
