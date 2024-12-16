import { Given, When, Then, After } from "@cucumber/cucumber";
import { Page, Browser, BrowserContext, chromium } from "@playwright/test";
import { expect } from "@playwright/test";

let browser: Browser;
let context: BrowserContext;
let page: Page;

Given('Timeline Navigation: User navigates to the Quartex Published Site', { timeout: 60000 }, async function () {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://demo.quartexcollections.com/");
    await page.waitForSelector("#search_input_intro", { state: "visible", timeout: 30000 });
    console.log('Navigated to the Quartex Published Site.');
});

Given('user has navigated to the Timeline content block under {string}', { timeout: 60000 }, async function (contentBlockUrl: string) {
    const discoveryAidsMenu = page.locator("li[data-dropdown='1']");
    await discoveryAidsMenu.hover();
    console.log('Hovered over "Discovery Aids".');
    await discoveryAidsMenu.click();
    console.log('Clicked "Discovery Aids" to expand the dropdown menu.');

    const browningBriefHistoryOption = page.locator("//a[normalize-space(text())='The Brownings: A Brief History']");
    await browningBriefHistoryOption.click();
    console.log('Clicked on "The Brownings: A Brief History".');

    await page.waitForURL(contentBlockUrl, { timeout: 30000 });
    const heading = page.locator("//h2[normalize-space(text())='The Brownings: A Brief History']");
    await expect(heading).toBeVisible();
    console.log('Verified the page title "The Brownings: A Brief History".');
});

Given('the timeline has fully loaded', { timeout: 120000 }, async function () {
    let scrollAttempts = 0;
    while (scrollAttempts < 50) {
        const loadingIndicator = page.locator("//div[contains(text(),'Loading')]");
        if (!(await loadingIndicator.isVisible())) break; // Exit if no loading is visible
        await page.mouse.wheel(0, 3000); // Scroll by 3000 pixels
        await page.waitForTimeout(3000); // Wait for content to load
        scrollAttempts++;
        console.log(`Scrolling... Attempt ${scrollAttempts}`);
    }
    console.log('Timeline has fully loaded.');
});

When('user clicks on the hyperlink for a specific Timeline item {string}', { timeout: 120000 }, async function (timelineYear: string) {
    const yearLocator = page.locator(`//h3[normalize-space(text())='${timelineYear}']`);
    const articleLocator = page.locator(`//article[contains(.,'Robert Browning meets future wife')]`);
    const viewAssetLocator = articleLocator.locator("//a[normalize-space(text())='one of their first love letters']");

    // Scroll to the year
    let scrollAttempts = 0;
    while (!(await yearLocator.isVisible()) && scrollAttempts < 50) {
        await page.mouse.wheel(0, 3000);
        await page.waitForTimeout(2000);
        scrollAttempts++;
        console.log(`Scrolling to year "${timelineYear}"... Attempt ${scrollAttempts}`);
    }
    if (!(await yearLocator.isVisible())) {
        throw new Error(`Timeline item for year "${timelineYear}" was not found after ${scrollAttempts} scroll attempts.`);
    }
    console.log(`Year "${timelineYear}" located.`);

    // Scroll to the article and ensure it's visible
    await articleLocator.scrollIntoViewIfNeeded();
    await expect(articleLocator).toBeVisible();
    console.log('Article located.');

    // Scroll to and click the "View Asset" hyperlink
    await viewAssetLocator.scrollIntoViewIfNeeded();
    await expect(viewAssetLocator).toBeVisible();
    await viewAssetLocator.click();
    console.log('Clicked on the "View Asset" hyperlink.');
});

Then('the correct webpage is launched in a new tab {string}', { timeout: 60000 }, async function (expectedUrl: string) {
    const newPagePromise = context.waitForEvent("page");
    const newPage = await newPagePromise;
    await newPage.waitForLoadState("load");
    console.log('New tab launched.');

    // Verify the new tab's URL
    await newPage.waitForURL(expectedUrl, { timeout: 30000 });
    console.log(`Verified the new tab URL is "${expectedUrl}".`);

    // Verify the title of the document
    const documentTitle = newPage.locator("//h1[normalize-space(text())='[10 January 1845]. Browning, Robert to Browning, Elizabeth Barrett.']");
    await expect(documentTitle).toBeVisible();
    console.log('Verified the document title "[10 January 1845]. Browning, Robert to Browning, Elizabeth Barrett."');
});

After(async function () {
    if (browser) {
        await browser.close();
        console.log('Closed the browser.');
    }
});

