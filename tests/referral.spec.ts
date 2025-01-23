import {test} from '../pages/component/base.page'

test.describe.skip("FAMILYFILE", () => {
  test.beforeEach(async ({ familyFilePage }) => {
    await familyFilePage.open();
  });
  
  test("create family file", async ({ familyFilePage }) => {
    await familyFilePage.createFamilyFile()
  });
});
