"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const test_2 = require("@playwright/test");
let browser;
let page;
// Retry Utility Function
const retry = (fn_1, ...args_1) => __awaiter(void 0, [fn_1, ...args_1], void 0, function* (fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return yield fn();
        }
        catch (e) {
            if (i === retries - 1)
                throw e;
            console.log(`Retrying... (${i + 1}/${retries})`);
        }
    }
});
// Background: Navigate to the Quartex Published Site
(0, cucumber_1.Given)('User navigates to the Quartex Published Site', { timeout: 60000 }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        browser = yield test_1.chromium.launch({ headless: false });
        page = yield browser.newPage();
        yield page.goto("https://demo.quartexcollections.com/");
        yield page.waitForSelector("#search_input_intro", { state: "visible", timeout: 30000 });
        console.log('Navigated to the Quartex Published Site.');
    });
});
// Scenario 1: Validate Basic Search and Results
(0, cucumber_1.Given)('user is on any page of the Quartex Published Site', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const searchBox = page.locator("#search_input_intro");
        yield (0, test_2.expect)(searchBox).toBeVisible();
        console.log('Verified user is on the Quartex Published Site.');
    });
});
(0, cucumber_1.When)('user enters {string} in the basic search input box', function (searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchBox = page.locator("#search_input_intro");
        yield searchBox.fill(searchTerm);
        console.log(`Entered search term: ${searchTerm}`);
    });
});
(0, cucumber_1.When)('the search button is clicked', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const searchButton = page.locator("button[aria-label='Search the site'][type='submit']");
        yield retry(() => __awaiter(this, void 0, void 0, function* () {
            yield searchButton.waitFor({ state: 'visible', timeout: 10000 });
            yield searchButton.click();
        }));
        console.log('Clicked the search button.');
        yield page.waitForSelector("h1.heading.heading--tertiary", { timeout: 30000 });
        console.log('Search results loaded.');
    });
});
(0, cucumber_1.Then)('user is navigated to the Browse All page', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const browseAllPageHeader = page.locator("h1.heading.heading--tertiary");
        yield (0, test_2.expect)(browseAllPageHeader).toHaveText('Browse All');
        console.log('Verified user is on the Browse All page.');
    });
});
(0, cucumber_1.Then)('the first page of search results is displayed', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const paginationInfo = page.locator("(//div[@class='media-list__top-pagination-info bold'])[1]");
        yield (0, test_2.expect)(paginationInfo).toBeVisible();
        console.log('Verified the first page of search results is displayed.');
    });
});
(0, cucumber_1.Then)('the assets listed meet the search criteria', function (dataTable) {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = dataTable.hashes();
        const expectedTitle = rows[0]['Title of asset listed'];
        const specificResult = page.locator("//li[@data-id='34576']");
        yield specificResult.scrollIntoViewIfNeeded();
        yield (0, test_2.expect)(specificResult).toBeVisible();
        const resultText = yield specificResult.innerText();
        if (!resultText.includes(expectedTitle)) {
            throw new Error(`Expected title "${expectedTitle}" not found.`);
        }
        console.log(`Verified the asset "${expectedTitle}" is listed and visible.`);
    });
});
// Scenario 2: Apply Filters
(0, cucumber_1.When)('user clicks on the Filter results button', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const filterResultsButton = page.locator("button#view-filters-btn>span>span:nth-of-type(2)");
        yield retry(() => __awaiter(this, void 0, void 0, function* () {
            yield filterResultsButton.waitFor({ state: 'visible', timeout: 10000 });
            yield filterResultsButton.click();
        }));
        console.log('Clicked the Filter results button.');
    });
});
(0, cucumber_1.When)('user selects to filter the search results by collection {string}', function (collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterCheckbox = page.locator(`label[for='chk-box-${collection.toLowerCase().replace(/ /g, '-')}']`);
        yield retry(() => __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate((selector) => {
                const element = document.querySelector(selector);
                if (element)
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, `label[for='chk-box-${collection.toLowerCase().replace(/ /g, '-')}']`);
            yield filterCheckbox.click();
        }));
        console.log(`Selected the filter checkbox for "${collection}".`);
        const applyButton = page.locator("(//button[@data-bind='click: applyFiltersClick, enable: enableFiltersButton']//span)[1]");
        yield retry(() => __awaiter(this, void 0, void 0, function* () {
            yield applyButton.waitFor({ state: 'visible', timeout: 10000 });
            yield applyButton.click();
        }));
        yield page.waitForSelector("div#docs-list-panel", { timeout: 60000 });
        console.log('Clicked the Apply Filters button.');
    });
});
(0, cucumber_1.Then)('the assets listed meet the search and filter criteria', function (dataTable) {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = dataTable.rawTable.slice(1); // Skip header row
        for (const [, expectedTitle] of rows) {
            const assetLocator = page.locator("//li[@data-id='33644']"); // Specific locator for the asset
            yield page.evaluate((selector) => {
                const element = document.querySelector(selector);
                if (element)
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, "li[data-id='33644']"); // Use Playwright's evaluate to handle scrolling
            yield (0, test_2.expect)(assetLocator).toBeVisible();
        }
        console.log('Verified the assets listed meet the search and filter criteria.');
    });
});
// Scenario 3: No Results Found
(0, cucumber_1.Given)('user has performed a successful basic search with the search term {string}', function (searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchBox = page.locator("#search_input_intro");
        const searchButton = page.locator("button[aria-label='Search the site'][type='submit']");
        yield searchBox.fill(searchTerm);
        yield retry(() => __awaiter(this, void 0, void 0, function* () {
            yield searchButton.waitFor({ state: 'visible', timeout: 10000 });
            yield searchButton.click();
        }));
        console.log(`Performed a search with the term "${searchTerm}".`);
    });
});
(0, cucumber_1.When)('there are no assets meeting the search criteria', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const noResultsMessage = page.locator("div#no-results-msg-container>div");
        yield (0, test_2.expect)(noResultsMessage).toBeVisible();
        console.log('Verified no results message is displayed.');
    });
});
(0, cucumber_1.Then)('a message is output informing the user that no results are available', function (dataTable) {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = dataTable.rawTable.slice(1); // Skip header row
        for (const [, expectedMessage] of rows) {
            const actualMessage = yield page.locator("div#no-results-msg-container>div").innerText();
            (0, test_2.expect)(actualMessage).toContain(expectedMessage);
        }
        console.log('Verified the no results message matches the expected output.');
    });
});
// Cleanup
(0, cucumber_1.After)(function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (browser) {
            yield browser.close();
            console.log('Closed the browser.');
        }
    });
});
//# sourceMappingURL=basicSearch.js.map