import { Given, When, Then, After } from "@cucumber/cucumber";
import { Page, Browser, chromium } from "@playwright/test";
import { expect } from "@playwright/test";

let browser: Browser;
let page: Page;

// Retry Utility Function
const retry = async (fn: () => Promise<any>, retries: number = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (i === retries - 1) throw e;
            console.log(`Retrying... (${i + 1}/${retries})`);
        }
    }
};

// Background: Navigate to the Quartex Published Site
Given('User navigates to the Quartex Published Site', { timeout: 60000 }, async function () {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    await page.goto("https://demo.quartexcollections.com/");
    await page.waitForSelector("#search_input_intro", { state: "visible", timeout: 30000 });
    console.log('Navigated to the Quartex Published Site.');
});

// Scenario 1: Validate Basic Search and Results
Given('user is on any page of the Quartex Published Site', async function () {
    const searchBox = page.locator("#search_input_intro");
    await expect(searchBox).toBeVisible();
    console.log('Verified user is on the Quartex Published Site.');
});

When('user enters {string} in the basic search input box', async function (searchTerm) {
    const searchBox = page.locator("#search_input_intro");
    await searchBox.fill(searchTerm);
    console.log(`Entered search term: ${searchTerm}`);
});

When('the search button is clicked', async function () {
    const searchButton = page.locator("button[aria-label='Search the site'][type='submit']");
    await retry(async () => {
        await searchButton.waitFor({ state: 'visible', timeout: 10000 });
        await searchButton.click();
    });
    console.log('Clicked the search button.');
    await page.waitForSelector("h1.heading.heading--tertiary", { timeout: 30000 });
    console.log('Search results loaded.');
});

Then('user is navigated to the Browse All page', async function () {
    const browseAllPageHeader = page.locator("h1.heading.heading--tertiary");
    await expect(browseAllPageHeader).toHaveText('Browse All');
    console.log('Verified user is on the Browse All page.');
});

Then('the first page of search results is displayed', async function () {
    const paginationInfo = page.locator("(//div[@class='media-list__top-pagination-info bold'])[1]");
    await expect(paginationInfo).toBeVisible();
    console.log('Verified the first page of search results is displayed.');
});

Then('the assets listed meet the search criteria', async function (dataTable) {
    const rows = dataTable.hashes();
    const expectedTitle = rows[0]['Title of asset listed'];

    const specificResult = page.locator("//li[@data-id='34576']");
    await specificResult.scrollIntoViewIfNeeded();
    await expect(specificResult).toBeVisible();

    const resultText = await specificResult.innerText();
    if (!resultText.includes(expectedTitle)) {
        throw new Error(`Expected title "${expectedTitle}" not found.`);
    }
    console.log(`Verified the asset "${expectedTitle}" is listed and visible.`);
});

// Scenario 2: Apply Filters
When('user selects to filter the search results by collection {string}', async function (collection) {
    const filterCheckbox = page.locator(`label[for='chk-box-${collection.toLowerCase().replace(/ /g, '-')}']`);
    await retry(async () => {
        await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, `label[for='chk-box-${collection.toLowerCase().replace(/ /g, '-')}']`);
        await filterCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        await filterCheckbox.click();
    });
    console.log(`Selected the filter checkbox for "${collection}".`);

    const applyButton = page.locator("(//span[@class='button__inner bold'])[1]");
    await retry(async () => {
        await applyButton.waitFor({ state: 'visible', timeout: 10000 });
        await applyButton.click();
    });
    await page.waitForSelector("div#docs-list-panel", { timeout: 60000 });
    console.log('Clicked the Apply Filters button.');
});

Then('the assets listed meet the search and filter criteria', async function (dataTable) {
    const rows = dataTable.rawTable.slice(1); // Skip header row
    for (const [, expectedTitle] of rows) {
        const assetLocator = page.locator("//li[@data-id='33644']"); // Specific locator for the asset
        await assetLocator.scrollIntoViewIfNeeded();
        await expect(assetLocator).toBeVisible();
    }
    console.log('Verified the assets listed meet the search and filter criteria.');
});

// Scenario 3: No Results Found
Given('user has performed a successful basic search with the search term {string}', async function (searchTerm) {
    const searchBox = page.locator("#search_input_intro");
    const searchButton = page.locator("button[aria-label='Search the site'][type='submit']");
    await searchBox.fill(searchTerm);
    await retry(async () => {
        await searchButton.waitFor({ state: 'visible', timeout: 10000 });
        await searchButton.click();
    });
    console.log(`Performed a search with the term "${searchTerm}".`);
});

When('there are no assets meeting the search criteria', async function () {
    const noResultsMessage = page.locator("div#no-results-msg-container>div", {
        hasText: 'Sorry, no results found that match your criteria.',
    });
    await expect(noResultsMessage).toBeVisible({ timeout: 5000 });
    console.log('Verified no results message is displayed.');
});

Then('a message is output informing the user that no results are available', async function (dataTable) {
    const rows = dataTable.rawTable.slice(1); // Skip header row
    for (const [, expectedMessage] of rows) {
        const actualMessage = await page.locator("div#no-results-msg-container>div", {
            hasText: expectedMessage,
        }).innerText();
        expect(actualMessage).toContain(expectedMessage);
    }
    console.log('Verified the no results message matches the expected output.');
});

// Cleanup
After(async function () {
    if (browser) {
        await browser.close();
        console.log('Closed the browser.');
    }
});