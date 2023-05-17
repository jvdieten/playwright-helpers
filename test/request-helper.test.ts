import { test as base, expect } from '@playwright/test';
import { RequestHelper } from "../src/main";

export type TestOptions = {
  requestHelper: RequestHelper;
};

export const test = base.extend<TestOptions>({
  requestHelper: async ({ page }, use) => {
    use(new RequestHelper(page));
  }
});

test('actionAndWaitForResponse', async ({ page, requestHelper }) => {
  await page.goto('https://playwright.dev/');
  await page.click('.DocSearch-Button');

  const result = await requestHelper.actionAndwaitForResponse(
    "indexes/.*/queries",
    page.type('.DocSearch-Input', 'network'));


  expect(result.status(), 'status shoulde be 200').toBe(200);

});
