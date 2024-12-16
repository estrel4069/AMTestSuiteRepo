import { Given, When, Then } from "@cucumber/cucumber";
import { Page, Browser, BrowserContext, chromium } from "@playwright/test";
import { expect } from "@playwright/test";

let browser: Browser;
let context: BrowserContext;
let page: Page;

// Navigate to "Explore the Collections" page
Given('User navigates to the "Explore the Collections" page', { timeout: 60000 }, async function () {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://demo.quartexcollections.com/");
    await page.waitForSelector("nav#site-main-menu", { state: "visible", timeout: 30000 });
    console.log('Navigated to the Quartex Published Site.');

    // Hover over and click "Explore the Collections"
    const exploreCollectionsMenu = page.locator("//a[normalize-space(text())='Explore the Collections']");
    await exploreCollectionsMenu.hover();
    console.log('Hovered over "Explore the Collections".');
    await exploreCollectionsMenu.click();
    console.log('Clicked on "Explore the Collections".');
    await page.waitForLoadState('load');
});

// Browse collections by selecting a letter
Given('user is viewing the Browse by collection Name A-Z content block', async function () {
    console.log('Viewing the Browse by collection Name A-Z content block.');
});

When('user selects a letter to browse', async function () {
    // Click the forward button to navigate to letter W
    const forwardButton = page.locator("//span[@class='points points--right']");
    await forwardButton.click();
    console.log('Clicked the forward button to navigate to the letter W.');

    // Click on the letter W
    const letterW = page.locator("//li[@data-letter='W']");
    await letterW.click();
    console.log('Clicked on the letter W.');
    await page.waitForSelector("//div[@data-letter='W']", { state: "visible" });
    console.log('Page scrolled to the W section.');
});

Then('the page is scrolled to display all collections starting with the chosen letter', async function () {
    // Verify the War & Conflict collection is visible
    const warAndConflictCollection = page.locator("//h4[normalize-space(text())='War & Conflict']");
    await expect(warAndConflictCollection).toBeVisible();
    console.log('Verified the "War & Conflict" collection is visible.');
});

// Navigate to a specific collection and verify details
Given('user has chosen to view all collections starting with a chosen letter', async function () {
    console.log('User is viewing collections starting with the chosen letter.');
});

When('user clicks on the collection', async function () {
    // Click on the "War & Conflict" collection
    const warAndConflictCollection = page.locator("//h4[normalize-space(text())='War & Conflict']");
    await warAndConflictCollection.click();
    console.log('Clicked on the "War & Conflict" collection.');
    await page.waitForLoadState('load');
});

Then('user is navigated to the results page with the header equal to chosen collection title', async function () {
    // Verify the header on the results page
    const collectionTitle = page.locator("//h1[normalize-space(text())='War & Conflict']");
    await expect(collectionTitle).toBeVisible();
    console.log('Verified the header on the results page is "War & Conflict".');
});

Then('number of assets within the collection are listed', async function () {
    // Verify the number of assets listed
    const assetCount = page.locator("//div[@class='media-list__top-pagination-info bold']");
    await expect(assetCount).toContainText("1-18");
    console.log('Verified the number of assets listed is "1-18".');
});

Then('the title of an asset is visible', async function () {
    // Scroll down and locate the asset
    await page.evaluate(() => window.scrollBy(0, 500));
    const assetTitle = page.locator("//a[normalize-space(text())='Memoirs of a Prisoner of War']");
    await expect(assetTitle).toBeVisible();
    console.log('Verified the asset "Memoirs of a Prisoner of War" is visible.');
});
