import { test as base, expect } from '@playwright/test';
import { MockHelper, RequestHelper } from "../src/main";

export type TestOptions = {
  mockHelper: MockHelper;
  requestHelper: RequestHelper;
};

export const test = base.extend<TestOptions>({
  mockHelper: async ({ page }, use) => {
    use(new MockHelper(page, 'test/mocks'));
  },
  requestHelper: async ({ page }, use) => {
    use(new RequestHelper(page));
  }
});

test('mockEndpoint', async ({ page, mockHelper, requestHelper }) => {
  await page.goto('https://swapi.dev/');
  
  await mockHelper.mockEndpoint({mockDir: 'people', url: 'https://swapi.dev/api/people/.*'}, '200-ok')

  const response = await requestHelper.actionAndwaitForResponse('https://swapi.dev/api/people/.*', page.click('.btn-primary'));

  const responseText = await response.text();
  expect(responseText).toBe(JSON.stringify({"name":"Mock Skywalker","height":"172","mass":"77","hair_color":"blond"}));

});
