import {
    test,
    expect,
    chromium,
    Browser,
    BrowserContext,
    Page,
  } from "@playwright/test";
  import { TokenTestHelper } from "../pages/component/TokenHelper";
  
  test.describe("GraphQL CreateFamilyFile Mutation", () => {
    let tokenHelper: TokenTestHelper;
    let browser: Browser;
    let context: BrowserContext;
    let sharedPage: Page;
  
    test.beforeAll(async () => {
      // Initialize browser, context, and page
      browser = await chromium.launch();
      context = await browser.newContext();
      sharedPage = await context.newPage();
  
      // Initialize TokenHelper
      tokenHelper = new TokenTestHelper(sharedPage);
      await tokenHelper.initialize();
    });
  
    test.afterAll(async () => {
      // Clean up resources after all tests
      await browser.close();
    });
  
    test("C75939 Edit tokencheck - verify token was created correctly", async ({
      request,
    }) => {
      // Retrieve required data
      const token = tokenHelper.getToken();
      const email = tokenHelper.getEmail();
      const familyFileId = process.env.FAMILY_FILE;
      const baseUrl = process.env.BASE_URL_MY_SEARCH;
  
      // Validate prerequisites
      if (!token) {
        throw new Error("[ERROR] Token is not set. Test cannot proceed.");
      }
  
      if (!baseUrl) {
        throw new Error("[ERROR] BASE_URL_MY_SEARCH is not set in environment variables.");
      }
  
      console.log("[INFO] Token and email retrieved:", { token, email });
  
      // Make the POST request
      const response = await request.post(`${baseUrl}/tokencheck`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { token },
      });
  
      // Log response details for debugging
      console.log("[DEBUG] Response Status:", response.status());
  
      // Validate response status and body
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(201);
  
      const result = await response.json();
      console.log("[INFO] Response Body:", result);
  
      // Assert response content
      expect(result.token).toBeDefined();
      expect(result.token.email).toBe(email);
      expect(result.token.familyFileId).toBe(familyFileId);
    });
  });
  