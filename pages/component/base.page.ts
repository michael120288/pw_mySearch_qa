import { test as base } from "@playwright/test";
import { FamilyFilePage } from "./FamilyFile.page";
import { InitialConsultation } from "./InitialConsultation.page";
import { SearchPage } from "./search.page";

export const test = base.extend<{
  familyFilePage: FamilyFilePage;
  initialConsultation: InitialConsultation;
  searchPage: SearchPage;
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
});
