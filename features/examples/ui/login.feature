Feature: Login Page

  As a user
  I want to test
  All basic scenarios for login Page

  Scenario: Login with valid credentials
    Given I am on the login screen
    When I fill the login form with valid credentials
    Then I should be able to see the home screen

  Scenario: login using invalid credentials
    Given I am on the login screen
    When I fill the login form with invalid credentials
    Then I should see error "Epic sadface: Username and password do not match any user in this service"

  Scenario: login using empty credentials
    Given I am on the login screen
    When I fill the login form with empty credentials
    Then I should see error "Epic sadface: Username is required"

  Scenario: login using valid user but invalid password credentials
    Given I am on the login screen
    When I fill the login form with valid user but invalid password credentials
    Then I should see error "Epic sadface: Username and password do not match any user in this service"

  Scenario: login using invalid user but valid password credentials
    Given I am on the login screen
    When I fill the login form with invalid user but valid password credentials
    Then I should see error "Epic sadface: Username and password do not match any user in this service"

