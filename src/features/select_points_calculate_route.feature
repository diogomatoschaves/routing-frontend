

Feature: Ability to select start and end points on UI and calculate routes
  As a user
  I can select / insert points by interacting with UI
  So that I can visualise routing output between selected points

  Scenario: User selects start point on a map
    Given there are no points selected
    When user clicks on map once
    Then a start point is selected
    And "from" input field on control panel is updated
  
  Scenario: User inputs start point on control panel
    Given end point is not selected
    When user inputs coordinates on "from" input field
    Then a start point is selected

  Scenario: User selects end point on a map 
    Given start point is selected
    When user clicks on map once
    Then an end point is selected
    And a route is calculated between start and end 

  Scenario: User inputs end point on control panel
    Given start point is selected
    When user inputs coordinates on "to" input field
    Then an end point is selected
    And a route is calculated between start and end

  Scenario: User inputs end point on control panel
    Given start point is not selected
    When user inputs coordinates on "to" input field
    Then and end point is selected

  Scenario: User can interact with displayed route
    Given route is shown on the map
    When user clicks and drags the route path
    And drops it in another location
    Then a new waypoint is added on drop location
    And a new route is calculated between all waypoints 

  Scenario: User can adds waypoint on route
    Given start and end point are selected
    When user clicks and drags the route path
    And drops it in another location
    Then a new waypoint is added on drop location
    And a new route is calculated between all waypoints

  Scenario: User can modify end point
    Given route is shown on the map
    When user clicks on map
    Then end point becomes clicked point
    And a new route is calculated between all waypoints 

  