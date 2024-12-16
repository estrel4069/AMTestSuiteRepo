Feature: Basic Search

Background:
Given User navigates to the Quartex Published Site

Scenario: User should be navigated to the Browse All page and assets listed must meet the search criteria
Given user is on any page of the Quartex Published Site
When user enters "Brown" in the basic search input box
And the search button is clicked
Then user is navigated to the Browse All page
And the first page of search results is displayed
And the assets listed meet the search criteria
| Search term | Title of asset listed                          |
| Brown       | 1 April 1875. Browning, Robert to Pollock, Lady. |

Scenario: Basic search by filter and search criteria must be met
Given user has performed a successful basic search with the search term "Brown"
When user selects to filter the search results by collection "Interwar Periodicals"
Then the assets listed meet the search and filter criteria
| Collection filtered by    | Title of asset listed              |
| Interwar Periodicals       | Woman's Weekly, July-December 1919 |

Scenario: Basic search by filter and search criteria for no results available
Given user has performed a successful basic search with the search term "Quartex"
When there are no assets meeting the search criteria
Then user is navigated to the Browse All page
And a message is output informing the user that no results are available
| Search term | Message                                      |
| Quartex     | Sorry, no results found that match your criteria. |