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

test('forEachMatch', async ({ page, elementHelper }) => {
  await page.goto('https://playwright.dev/');

  const h3Locator = page.locator('h3');
  const h3results = await elementHelper.forEachMatch(h3Locator, async h3item => {
    const text = await h3item.textContent();
    return [text];
  });

  console.log(h3results);

});

test('clickIfElementExists', async ({ page, elementHelper }) => {
  await page.goto('https://playwright.dev/');
  await elementHelper.clickIfElementExists('a.getStarted_Sjon');
  expect(await page.title(), 'title should include ').toContain('Installation');
});

test('scrollTo', async ({ page, elementHelper }) => {
  await page.goto('https://playwright.dev/');
  await elementHelper.scrollTo('.logosColumn_GJVT');
});

test('getElementCount', async ({ page, elementHelper }) => {
  await page.goto('https://playwright.dev/');
  expect(await elementHelper.getElementCount('h3')).toBe(9);
});