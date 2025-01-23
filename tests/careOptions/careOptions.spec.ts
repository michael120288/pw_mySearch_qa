import {
  Browser,
  BrowserContext,
  chromium,
  Page,
  expect,
} from "@playwright/test";
import { test as it } from "../../pages/component/base.page";
import { TokenTestHelper } from "../../pages/component/TokenHelper";
import { json } from "stream/consumers";
it.describe("CARE OPTIONS", () => {
  let tokenHelper: TokenTestHelper;
  let browser: Browser;
  let context: BrowserContext;
  let sharedPage: Page;

  it.beforeAll(async () => {
    // Initialize browser, context, and page
    browser = await chromium.launch();
    context = await browser.newContext();
    sharedPage = await context.newPage();

    // Initialize TokenHelper
    tokenHelper = new TokenTestHelper(sharedPage);
    await tokenHelper.initialize();
  });

  it.afterAll(async () => {
    // Clean up resources after all tests
    await browser.close();
  });
  it("C76158	careOptions - slug", async ({ careOptions, request }) => {
    let tokenData = tokenHelper.getToken();
    const result = await careOptions.findCareOptions(request, tokenData);
    const jsonData = await result.json();
    const slug = careOptions.verifySlug(jsonData.communities);
    expect(slug.length).toEqual(0);
    console.log(slug);
    console.log(tokenData);
  });
  it("C75536 careOptions - thumbnail", async ({ careOptions, request }) => {
    const tokenData = tokenHelper.getToken();
    const careOption = await careOptions
      .findCareOptions(request, tokenData)
      .then((el) => el.json());

    //console.log(careOption);
    for (const community of careOption.communities) {
      console.log(community.id);
      const thumbnail = await careOptions.findThumbnail(Number(community.id));
      console.log(thumbnail, "thumbnail");
      const normalizedThumbnail = thumbnail === null ? null : String(thumbnail);
      expect(community.thumbnailId).toEqual(normalizedThumbnail);
    }
  });
});
