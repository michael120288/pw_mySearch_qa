import { Locator, Page, expect } from "@playwright/test";
export class FamilyFilePage {
  page: Page;

  constructor(page) {
    this.page = page;
  }
  get firstName() {
    return ".name-input [placeholder]";
  }
  get lastName() {
    return ".last-name-input [placeholder]";
  }
  get homePhone() {
    return "[id^=PRIMARY_CONTACT] > [class^=phone_input]:first-child [placeholder]";
  }
  get cellPhone() {
    return "[id^=PRIMARY_CONTACT] > [class^=phone_input]:nth-of-type(2) [placeholder]";
  }
  get workPhone() {
    return "[id^=PRIMARY_CONTACT] > [class^=phone_input]:nth-of-type(3) [placeholder]";
  }
  get email() {
    return "[id^=PRIMARY_CONTACT] > [class^=email_input] [placeholder]";
  }
  get dropDownPrimaryLocation() {
    return "[class^=\"menu_items\"] [class^='body']";
  }
  get selectReason() {
    return '[data-testid="dropdown-id"]';
  }
  get dropDownSelectReason() {
    return '[class^="items_container"]>div:nth-of-type(2)';
  }
  get cancelButton() {
    return '[type="button"]:has-text("Cancel")';
  }
  get createFFButton() {
    return '[type="button"]:has-text("Create Family File")';
  }

  get getPrimaryLocation() {
    return '[placeholder="Enter location"]';
  }
  open = async () => {
    await this.page.goto("/family-file/create",{waitUntil:"load"})
    await expect(this.page).toHaveURL(/create/);
  };
  createFamilyFile = async () => {
    await this.page.locator(this.getPrimaryLocation).waitFor();
    await this.page.locator(this.getPrimaryLocation).fill("99676");
    await this.page.locator(this.dropDownPrimaryLocation).waitFor({state:'visible'});
    await this.page.locator(this.dropDownPrimaryLocation).click();
    await this.page.locator(this.selectReason).waitFor();
    await this.page.locator(this.selectReason).click();
    await this.page.locator(this.dropDownSelectReason).waitFor();
    await this.page.locator(this.dropDownSelectReason).click();
    await this.page.locator(this.firstName).waitFor();
    await this.page.locator(this.firstName).fill("Shoneeel123");
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.lastName).waitFor();
    await this.page.locator(this.lastName).fill("Shoneeel122");
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.homePhone).waitFor();
    await this.page.locator(this.homePhone).fill("3526314000");
    await this.page.waitForTimeout(1000);
    // await this.cellPhone.fill('3526314000')
    // await this.workPhone.fill('3526314000')
    await this.page.locator(this.email).waitFor();
    await this.page.locator(this.email).fill("michael@gmail.com");
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.createFFButton).click();
    await expect(this.page).toHaveURL(/initial-consultation/);
    this.page.pause();
  };
}
