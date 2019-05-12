Feature: Ability to load / hide / delete custom data onto map
  As a user
  I can load / hide / delete geojson layers onto / from the map 
  So that I can customize map visualisation 

  Scenario: User loads geojson onto UI
    Given choose file button is accessible
    When user clicks on button and selects file
    And file is valid
    Then the map dat is loaded onto map
    And file is added to list of loaded files

  Scenario: User hides visibility of layer
    Given map layer is visible
    When user clicks on visibility button
    Then map data layer becomes hidden

  Scenario: User deletes map data layer
    Given map layer is loaded
    When user clicks on delete button
    Then map data layer is deleted
    And file is removed from files list

# Feature: Ability to toggle visibility of edges / nodes / ids
#   As a user
#   I can toggle visibility of edges, nodes and ids
#   So that I can customize the look of the map

  Scenario: User toggles visibility of edges / nodes / ids
    Given edges / nodes / ids are visible / not visible
    When user clicks on edges / nodes / ids visibility button
    Then the visibility of edges / nodes / ids is turned off / turned on

  Scenario: User toggles visibility of graph weights
    Given edges / nodes / ids are visible / not visible
    When user clicks on edges / nodes / ids visibility button
    Then the visibility of edges / nodes / ids is turned off / turned on

Feature: Ability to search / filter edges / nodes by their id
  As a user
  I can filter / search specific edges / nodes
  So that I can look for specific of edges / nodes on the map 

  Scenario: User searches / filters edges / nodes by their id
    Given data layer is loaded on the map
    When user changes input value of filter input field 
    Then the matching edges / nodes are shown in a list
    And the non matching edges / nodes visibility is turned off 

Feature: Ability to switch between different map styles
  As a user
  I can switch between different map styles
  So that I can control map appearance 

  Scenario: User clicks on unselected map style option
    Given map style option is NOT selected
    When user clicks on map style option 
    Then the map style switches to selected option

  Scenario: User visualizes 2 different styles at same time
    Given dual-mode option is visible 
    When user clicks on dual-mode option 
    Then the two different maps are shown and separated by a movable bar
    And options for changing each map are shown

Feature: Ability to see underlying traffic model weights and penalties
  As a user
  I can switch between different map styles
  So that I can control map appearance 

  Scenario: User toggles visibility of traffic model weights
    Given map layer is loaded
    When user clicks on "show traffic weights" button 
    Then the traffic weights are shown on the map
    And color coding is applied to segments

  Scenario: User visualizes 2 different styles at same time
    Given dual-mode option is visible 
    When user clicks on dual-mode option 
    Then the two different maps are shown and separated by a movable bar
    And options for changing each map are shown