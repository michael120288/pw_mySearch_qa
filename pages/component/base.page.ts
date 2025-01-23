import { test as base } from "@playwright/test";
import { FamilyFilePage } from "./FamilyFile.page";
import { InitialConsultation } from "./InitialConsultation.page";
import { TokenTestHelper } from "./TokenHelper";
import { SearchPage } from "./Search.page";
import { CareOptions } from "./CareOptions/CareOptions.page";

export const test = base.extend<{
  familyFilePage: FamilyFilePage;
  initialConsultation: InitialConsultation;
  searchPage: SearchPage;
  tokenHelper: TokenTestHelper;
  careOptions: CareOptions;
}>({
  familyFilePage: async ({ page }, use) => {
    await use(new FamilyFilePage(page));
  },
  initialConsultation: async ({ page }, use) => {
    await use(new InitialConsultation(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  tokenHelper: async({page},use)=>{
    await use(new TokenTestHelper(page))
  },
  careOptions: async({page},use)=>{
    await use(new CareOptions(page))
  }
});
