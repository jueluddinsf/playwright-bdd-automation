Feature: Lighthouse Performance Tests

  @lighthouse
  Scenario: Verify Home Page Performance using Lighthouse
    Given I navigate to "https://angular.io/"
    Then the lighthouse metrics should be above the following thresholds:
      | category       | value |
      | performance    | 40    |
      | accessibility  | 80    |
      | best-practices | 80    |
      | seo            | 80    |
