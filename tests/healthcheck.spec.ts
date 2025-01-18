import { expect, test as it } from "@playwright/test";

it.describe("", () => {
  it("healthCheck", async ({ request }) => {
    const response = await request.get(`${process.env.BASE_URL_MY_SEARCH}/healthcheck`);
    console.log(`Requested URL: ${response.url()}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toBe("OK");
  });
});
