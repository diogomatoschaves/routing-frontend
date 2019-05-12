Feature: Ability to add geojson with gps traces and visualise map matched response
  As a user
  I can in input gps traces' data
  So that I can visualise and tweak map matched routes / response

  Scenario: User inputs gps traces' data and visualises map matched response
    Given user is in map matching page
    When user inputs geojson with gps traces' data
    And input is valid
    Then the map matched route is calculated and shown on the map

  Scenario: User modifies gps traces on map
    Given gps traces are shown on map
    When user drags & drops point
    Then gps trace point is updated
    And map matched result is updated

  
