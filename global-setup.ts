import { chromium, Browser, Page } from '@playwright/test';


async function globalSetup() {
  const browser: Browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  try {
    

    await page.goto(`${process.env.BASE_URL}/family-file/create`, {
      waitUntil: 'networkidle', // Wait for network requests to finish
      timeout:160000
    });
    
    await page.waitForTimeout(1000);
    await page.getByText('Continue with Google').click();

    await page.locator('#identifierId').fill(process.env.GOOGLE_EMAIL || '');
    await page.locator('#identifierNext').click();
    await page.locator('[type="password"]').fill(process.env.GOOGLE_PASSWORD || '');
    await page.locator('[type="button"]:has-text("Next")').click();

    await page.waitForURL(/create/, { timeout: 10000 });

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
