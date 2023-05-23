import { test as base, expect } from '@playwright/test';
import { MockHelper, RequestHelper } from "../src/main";

export type TestOptions = {
  mockHelper: MockHelper;
  requestHelper: RequestHelper;
};

export const test = base.extend<TestOptions>({
  mockHelper: async ({ page }, use) => {
    use(new MockHelper(page, 'test/mocks', 'xml'));
  },
  requestHelper: async ({ page }, use) => {
    use(new RequestHelper(page));
  }
});

test('mockEndpoint', async ({ page, mockHelper, requestHelper }) => {
  await page.goto('https://swapi.dev/');
  await mockHelper.mockEndpoint({mockDir: 'people', scenario: '200-ok', url: 'https://swapi.dev/api/people/.*'})

  const response = await requestHelper.actionAndwaitForResponse('https://swapi.dev/api/people/.*', page.click('.btn-primary'));

  const responseText = await response.text();
  const contentType = await response.headerValue('content-type');
  expect(responseText).toBe("<xml><egg value=2></egg></xml>");
  expect(contentType).toBe("application/xml");

});

