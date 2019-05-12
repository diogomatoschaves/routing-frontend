Feature: Ability to select bearing and radius constraints
  As a user
  I can select bearing and radius constraints
  So that I can modify the output of the response

  Scenario: User selects bearing constraint and radius
    Given user has clicked and point has been selected
    When user keeps mouse down for 2 seconds
    Then user can select radius constraint by clicking on the map once
    And user can define bearing constraint by clicking once more on the map