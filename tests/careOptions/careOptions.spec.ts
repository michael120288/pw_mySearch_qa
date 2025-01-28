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
import { toCamelCase } from "../../utilities/hooks/camelCase";
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
  it("C75537 careOptions - careTypes ", async ({ careOptions, request }) => {
    const tokenData = tokenHelper.getToken();

    const careOption = await careOptions
      .findCareOptions(request, tokenData)
      .then((el) => el.json());
    let count = 0;
    //console.log(careOption);
    for (const community of careOption.communities) {
      const careTypeLength = await community["careTypes"].length;
      const careTypesSize = await careOptions.findCareTypes(
        Number(community.id)
      );
      if (careTypeLength === 0) {
        expect(careTypesSize).toBe(0);
      } else {
        //console.log(await careTypesSize,'careTypesSize');
        for (const careType of community["careTypes"]) {
          const key = toCamelCase(careType);
          if (key === "nursingHomes") {
            console.log(key, "key");
            expect(careTypesSize["nursingHome"]).toBeTruthy();
            continue;
          }
          console.log(careTypesSize[key], "careTypesSize[key]");
          expect(careTypesSize[key]).toBeTruthy();
        }
      }
      Object.keys(careTypesSize).forEach((careType) => {
        if (careTypesSize[careType]) {
          count += 1;
        }
      });
      expect(count).toBe(careTypeLength);
      count = 0;
    }
  });
  it("C75538	careOptions - isCustomer", async ({
    careOptions,
    request,
  }) => {
    const tokenData = tokenHelper.getToken();
    const careOption = await careOptions
      .findCareOptions(request, tokenData)
      .then((el) => el.json());
    for (const community of careOption.communities) {
      expect(community["isCustomer"]).toBe(
        await careOptions.findCommunityData(Number(community.id),"isCustomer")
      );
    }
  });
  it.only("C75539 careOptions - isBestOfSeniorLiving", async ({
    careOptions,
    request,
  }) => {
    const tokenData = tokenHelper.getToken();
    const careOption = await careOptions
      .findCareOptions(request, tokenData)
      .then((el) => el.json());
    for (const community of careOption.communities) {
      expect(community["isBestOfSeniorLiving"]).toBe(
        await careOptions.findCommunityData(Number(community.id),'isBestOfSeniorLiving')
      );
    }
  });
});
