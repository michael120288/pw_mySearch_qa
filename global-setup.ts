import { chromium, Browser, Page } from '@playwright/test';


async function globalSetup() {
  const browser: Browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  try {
    await page.goto(`${process.env.BASE_URL}/family-file/create`);
    await page.waitForTimeout(1000);
    const newTabPromise = page.waitForEvent("popup");
    await page.getByText('Log in').click()
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();
    await newTab.getByText('Continue with Google').click();

    await newTab.locator('#identifierId').fill(process.env.GOOGLE_EMAIL || '');
    await newTab.locator('#identifierNext').click();
    await newTab.locator('[type="password"]').fill(process.env.GOOGLE_PASSWORD || '');
    await newTab.locator('[type="button"]:has-text("Next")').click();
    await page.goto(`${process.env.BASE_URL}/family-file/create`);
    await page.waitForURL(/create/, {waitUntil:'networkidle'});

    // Save the browser state
    await page.context().storageState({ path: './playwright/LoginAuth.json' });
    console.log('Login state saved successfully!');
  } catch (error) {
    console.error('Error during global setup:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
