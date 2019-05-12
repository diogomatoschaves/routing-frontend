

Feature: Ability to add waypoints and modify routes
  As a user
  I want to be able to add waypoints through the UI or drag&drop on the map
  So that I can recalculate routes through all selected points

  Scenario: User can interact with displayed route
    Given route is shown on the map
    When user clicks and drags the route path
    And drops it in another location
    Then a new waypoint is added on drop location
    And a new route is calculated between all waypoints 

  Scenario: User can add waypoints on control panel
    Given start and end point are selected 
    When user clicks on "+" button 
    And inputs valid coordinates
    Then a new waypoint is added on map
    And a new route is calculated between all waypoints 

  Scenario: User can modify end point
    Given start and end points are selected
    When user clicks on map
    Then end point becomes clicked point
    And a new route is calculated between all waypoints 

  