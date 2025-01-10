import { Locator, Page, expect } from "@playwright/test";
export class InitialConsultation {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  private apfmDisclosure = () => '[id="disclosure-10"] ~ div [type]';
  get privacyPolicy() {
    return this.page.locator(
      "[class] [class='MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-12 MuiGrid-grid-lg-12']:nth-of-type(2) [type]"
    );
  }
  get relationToResident() {
    return this.page.locator(
      '[class^=relationship_to_resident] [placeholder="Please select"]'
    );
  }
  get relationToResidentDropDownMenu() {
    return this.page.locator(`[class='MuiAutocomplete-listbox']`);
  }
  get relationToResidentDropDownMenuText() {
    return this.page.locator(`[role="listbox"] > li`);
  }
  get emailPrimary() {
    return this.page.locator(`[id="primary-contactInfo-email"]`).nth(0);
  }
  get emailSecond() {
    return this.page.locator(`[id="primary-contactInfo-email"]`).nth(1);
  }
  get firstNameResident() {
    return this.page.locator(`#primary-resident-first-name`);
  }
  get lastNameResident() {
    return this.page.locator(`#primary-resident-last-name`);
  }
  get timeFrameToMove() {
    return this.page.locator(
      '//div[starts-with(@class, "timeframe_to_move")]//div[contains(text(),"Select from list")]'
    );
  }
  timeFrameToMoveDDmenu(text: string) {
    return this.page.locator(
      `//div[contains(@class,'custom_items_container')]//div[contains(text(),"${text}")]`
    );
  }
  //medical background

  private currentLivingSituation = () =>
    this.page.locator(
      `//div[contains(@data-testid,'current-living-situation-dropdown-container')]//div[contains(text(),\"Select from list\")]`
    );
  private currentLivingSituationDropDown = (text: string) =>
    this.page.locator(
      `//div[contains(@data-testid,'current-living-situation-dropdown-container')]//div[contains(text(),"${text}")]`
    );
  private currentLivingSituationDropDownMenu = () =>
    this.page.locator(".custom_items_container > div");
  private professionalSource = () =>
    this.page.locator('[id="PNP_CONTAINER"] [role=radiogroup] input');

  //FINANCIAL
  private estimatedBudget = () =>
    this.page.locator(
      `//div[contains(@class,'dropdown_budget_range')]//div[contains(text(),\"Family Undecided\")]`
    );
  private estimatedBudgetDropDown = (text: string) =>
    this.page.locator(
      `//div[contains(@class,'dropdown_budget_range')]//div[contains(text(),"${text}")]`
    );

  //Care & Preferences

  private careAndPreferences = (text: string) =>
    this.page.locator(
      `//div[contains(@id,'CARE_TYPES_CONTAINER')]//span[contains(text(),'${text}')] /../.. //input`
    );

  //Buttons
  private saveUpdated = () =>
    this.page.locator("//*[contains(text(),'Save Updates')]");
  private saveUpdatedAndSearch = () =>
    this.page.locator("//*[contains(text(),'Save and Search Communities')]");

  //Community
  private communityName = (community: string) =>
    this.page.locator(`#community-row-${community}`);
  private communityNameAddNow = (community: string) =>
    this.page.locator(`#community-row-${community} [type='button']`);

  public async fillInitialConsultation() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.apfmDisclosure()).waitFor();
    await this.page.locator(this.apfmDisclosure()).click();
    await this.page.locator(this.apfmDisclosure()).waitFor();
    await this.page.waitForTimeout(1000);
    await this.privacyPolicy.waitFor();
    await this.privacyPolicy.click();
    await this.page.waitForTimeout(1000);
    await this.relationToResident.click();
    await this.relationToResidentDropDownMenu.waitFor();
    await this.relationToResidentDropDownMenuText.nth(0).click();
    await this.firstNameResident.waitFor();
    await this.firstNameResident.fill("First Name");
    await this.lastNameResident.waitFor();
    await this.lastNameResident.fill("Last Name");
    await this.timeFrameToMove.waitFor();
    await this.timeFrameToMove.click();
    await this.timeFrameToMoveDDmenu("In 30 days").click();
    await this.currentLivingSituation().click();
    await this.currentLivingSituationDropDown("Home (lives alone)").click();
    await this.professionalSource().nth(1).click();
    await this.estimatedBudget().click();
    await this.estimatedBudgetDropDown("$10,000 and over").click();
    await this.careAndPreferences("Memory Care (Z)").click();
  }

  public async createFamilyFile() {
    await this.fillInitialConsultation();
    const newTabPromise = this.page.waitForEvent("popup");
    await this.saveButtonClick();
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();
    await expect(newTab).toHaveURL(/communities/);
  }

  public async saveButtonClick() {
    await this.saveUpdatedAndSearch().click();
  }

  public async createLeadIdForCommunity(communityIds: string[]) {
    await this.fillInitialConsultation();
    const newTabPromise = this.page.waitForEvent("popup");
    await this.saveButtonClick();
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();
    await expect(newTab).toHaveURL(/communities/);
    await this.addCommunities(communityIds, newTab);
    await newTab.getByRole("button", { name: /Working List/i }).click();
    await newTab.getByLabel("Select All").waitFor();
    while (!(await newTab.getByLabel("Select All").isChecked())) {
      await newTab.getByLabel("Select All").check();
    }
    console.log("Checkbox is now checked.");
    await expect(newTab.getByLabel("Select All")).toBeChecked();
    await this.clickButton("Send Referral Alert", newTab);
    await expect(newTab).toHaveURL(/send-referral/);
    await this.addMessagesToCommunities(communityIds, newTab);
    await this.clickButton("Send Referral Now", newTab);
    await this.clickButton("Go to Communities Page", newTab);
    const familyFileText = await newTab
      .getByText(/Family File ID \d+/)
      .textContent();
    const familyFileID = familyFileText?.match(/Family File ID (\d+)/)?.[1];

    // Extract Lead ID
    const leadIDText = await newTab.getByText(/Lead ID\d+/).textContent();
    const leadID = leadIDText?.match(/Lead ID(\d+)/)?.[1];

    console.log("Family File ID:", familyFileID); // Output: The extracted Family File ID
    console.log("Lead ID:", leadID); // Output: The extracted Lead ID
    return [familyFileID, leadID];
  }

  async addCommunities(communityIds: string[], page: Page) {
    for (const communityId of communityIds) {
      console.log(`Adding community with ID: ${communityId}`);
      const addNowButton = page.locator(
        `#community-row-${communityId} [type='button']`
      );
      await expect(addNowButton).toBeVisible({ timeout: 60000 });
      await addNowButton.click();
      if (await page.getByText("Referring a Fair Match").isVisible()) {
        await page.getByLabel("Price").check();
        await page.getByRole("button", { name: "Save" }).click();
      }
      console.log(`Community ${communityId} added successfully.`);
    }
  }
  async addMessagesToCommunities(communityIds: string[], page: Page) {
    await page
      .getByLabel("Message to all communities")
      .fill(`Testing Message for ${communityIds}`);
    for (const community of communityIds) {
      await page.locator(`#additional-message-${community}`).click();
      await page.locator(`#additional-message-${community}`).fill("test");
    }
  }
  async clickButton(buttonName: string, page: Page) {
    await page.getByRole("button", { name: buttonName }).click();
  }
}
