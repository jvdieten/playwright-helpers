import { test as base, expect } from '@playwright/test';
import { ElementHelper } from "../src/main";

export type TestOptions = {
  elementHelper: ElementHelper;
};

export const test = base.extend<TestOptions>({
  elementHelper: async ({ page }, use) => {
    use(new ElementHelper(page));
  }
});

test('clickIfElementExists', async ({ page, elementHelper }) => {
  await page.goto('https://playwright.dev/');
  await elementHelper.clickIfElementExists('.getStarted_Sjon');

  expect(await page.title(), 'title should include ').toContain('Installation');
});
