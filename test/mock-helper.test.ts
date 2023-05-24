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
  await mockHelper.mockEndpoint({mockDir: 'people', scenario: '200-ok', url: 'https://swapi.dev/api/people/.*'})

  const response = await requestHelper.actionAndwaitForResponse('https://swapi.dev/api/people/.*', page.click('.btn-primary'));

  const responseText = await response.text();
  const contentType = await response.headerValue('content-type');

  expect(responseText).toBe(JSON.stringify({"name":"Mock Skywalker","height":"172","mass":"77","hair_color":"blond"}));
  expect(contentType).toBe("application/json");
});

test('mockEndpoint statusCode', async ({ page, mockHelper, requestHelper }) => {
  
  const testStatusCode = 500;
  await page.goto('https://swapi.dev/');
  await mockHelper.mockEndpoint({url: 'https://swapi.dev/api/people/.*', statusCode: testStatusCode})
  const response = await requestHelper.actionAndwaitForResponse('https://swapi.dev/api/people/.*', page.click('.btn-primary'));

  expect(response.status()).toBe(testStatusCode);

});
