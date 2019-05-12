Feature: Ability to view raw response data and modify it
  As a user
  I can view / modify response by interacting with UI
  So that I can inspect response and get instant feedback to changes

  Scenario: User visualises raw response
    Given route is calculated between start and end
    When user clicks on raw response button
    Then the raw response is shown

  Scenario: User inserts / modifies raw response
    Given user is in raw response view
    When user inserts / modifies raw response
    And raw response is valid
    Then a new route is calculated
    And shown on the map 
