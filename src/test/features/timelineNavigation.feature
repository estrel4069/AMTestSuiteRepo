Feature: Navigate to a specific link from a Timeline content block

  Background:
    Given Timeline Navigation: User navigates to the Quartex Published Site

  Scenario: User should navigate to a specific link from a Timeline content block
    Given user has navigated to the Timeline content block under "https://demo.quartexcollections.com/discovery-aids/the-brownings-a-brief-history"
    And the timeline has fully loaded
    When user clicks on the hyperlink for a specific Timeline item "1845"
    Then the correct webpage is launched in a new tab "https://demo.quartexcollections.com/Documents/Detail/10-january-1845.-browning-robert-to-browning-elizabeth-barrett./36113"
