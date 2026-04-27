Feature: Sample API Tests

  Scenario: Verify GET Request to public Products API
    Given I send a "GET" request to "https://dummyjson.com/products/1"
    Then the response status should be 200
    And the response should contain "id" with value "1"
    And the response should contain "title"
    And the response should contain "price"

  Scenario: Verify POST Request to Add a Product
    Given I set the request body to:
      """
      {
        "title": "Sauce Labs Backpack",
        "description": "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection."
      }
      """
    When I send a "POST" request to "https://dummyjson.com/products/add"
    Then the response status should be 201
    And the response should contain "title" with value "Sauce Labs Backpack"
    And the response should contain "id"
