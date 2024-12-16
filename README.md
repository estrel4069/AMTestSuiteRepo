Project Structure:
src/
├── test/
│   ├── features/           # Contains feature files written in Gherkin
│   │   ├── basicSearch.feature
│   │   ├── timelineNavigation.feature
│   │   └── browseCollections.feature
│   ├── steps/              # Step definitions implementing feature steps
│   │   ├── basicSearch.ts
│   │   ├── timelineNavigation.ts
│   │   └── browseCollections.ts
cucumber.json               # Cucumber configuration file
package.json                # Project dependencies and scripts
playwright.config.ts        # Playwright configuration for browser settings
tsconfig.json               # TypeScript configuration
README.md                   # Documentation

Installation and Setup:
Prerequisites
1. Node.js: Install the latest LTS version of Node.js.
2. Visual Studio Code: Install the following extensions:
3. Playwright Test for VSCode: https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright 
4. Cucumber (Gherkin) Full Support: https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete 

Installation Steps
1. Clone the repository.
2. Install dependencies:
npm install
3. Install Playwright browsers:
npx playwright install
4. Visual Studio Setup:
Install the Playwright Test for VSCode extension.
In the search menu, type >Playwright Install, then select Test: Install Playwright and install the following:
Chromium, Firefox, WebKit.
Add GitHub Actions workflow (optional).
5. Verify the installation:
npm test

Configuration Details:
1. cucumber.json:
Configures the Cucumber framework to locate feature files and step definitions.
2. playwright.config.ts:
Manages Playwright's browser configuration.
3. package.json:
Defines dependencies and scripts to execute tests.

Running Tests:
Execute All Tests
Run all feature files using: npm test

Feature Files:
Each feature file resides in the src/test/features directory: 
1. Basic Search: basicSearch.feature
2. Timeline Navigation: timelineNavigation.feature
3. Browse by Collection: browseCollections.feature
Console Output
Each step outputs a success or failure message for better traceability. 

Cross-Browser Compatibility:
Currently, the framework runs on Chromium. However, the configuration is prepared for Firefox and WebKit. To enable cross-browser testing:
Uncomment additional browser configurations in playwright.config.ts.
Install required browsers:
npx playwright install

Assumptions and Notes:
Ensure all dependencies listed in package.json are installed.
Centralized locators can improve maintainability. I would implement for future enhancements.
I would also add support for HTML or JSON test reports if needed.
The project supports CI/CD workflows for automated test execution

Known Issues
1. Intermittent Failures:
Some tests may occasionally fail due to network latency or browser delays.
Rerunning the test usually resolves the issue.
Adjust timeouts in playwright.config.ts or the step definitions if failures persist.
2. Headless Mode:
All tests are currently configured to run in non-headless mode. Update the headless property in playwright.config.ts to true for headless execution.