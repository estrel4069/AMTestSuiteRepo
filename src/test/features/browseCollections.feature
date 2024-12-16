Feature: Browsing by Collection
  
Background:
Given User navigates to the "Explore the Collections" page

Scenario: User browses collections by selecting a letter
Given user is viewing the Browse by collection Name A-Z content block
When user selects a letter to browse
Then the page is scrolled to display all collections starting with the chosen letter
Examples:
  | Letter | Collection       |
  | W      | War & Conflict   |

Scenario: User navigates to a collection and views its details
Given user has chosen to view all collections starting with a chosen letter
When user clicks on the collection
Then user is navigated to the results page with the header equal to chosen collection title
And number of assets within the collection are listed
And the title of an asset is visible
Examples:
  | Letter | Collection       | Number of results | Title of listed asset         |
  | W      | War & Conflict   | 18                | Memoirs of a Prisoner of War  |

