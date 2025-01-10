import { Page,expect } from "@playwright/test";

export class SearchPage {
  private page: Page;

  private getWorkingList = () => this.page.locator('[class*="workingListButton"]')
  constructor(page) {
    this.page = page;
  }

  public async workingListVisible() {
    await expect(this.page).toHaveURL(/communities/);
  }
}
