# Playwright-helpers

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-5-0]
[![Node.js version][nodejs-badge]][nodejs]
[![NPM][npm-badge]][npm]

## Background

This project is intended to be used with the latest release of [Playwright test](https://playwright.dev/docs/api/class-test).

Playwright is great for test automation this package is to make it even better with support for advanced request handling, mocking and some
element helper functions.


### Installation
```
$ npm install playwright-helpers --save-dev
```

### Package contents

Currently this package consists of the following helpers:

- MockHelper: for easy mocking of endpoints
- RequestHelper: methods for waiting network requests 
- ElementHelper: methods for element interactions 

### Usage of the helpers in your playwright tests

##### Extend test with the helpers
```ts
import { test as base, expect } from '@playwright/test';
import { MockHelper, RequestHelper } from 'playwright-helpers';

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
```

##### Usage in your tests

```ts
test('my test', async ({ page, requestHelper }) => {
  await page.goto('https://playwright.dev/');
```

### MockHelper
Function for easy mock setup it is currently supporting json and xml reponses. You initiate it with a page and a baseFolder for the scenarios. The default dataType is JSON 
this can be changed to xml. 

```ts
new MockHelper(page, <baseFolder>, <dataType?>)
```


#### use it in your tests

```ts
await mockHelper.mockEndpoint(<MockEndpoint>
)
```

```
MockEndpoint {
  url: string, regex of the url you want to mock
  mockDir?: string, if scenario from file you can provide the folder scenarios are located 
  scenario?: string, the name of the scenario without the extension
  statusCode?: number, of the response default is always 200
}
```

See [json example](/test/mock-helper.test.ts) and [xml example](/test/mock-helper-xml.test.ts)

### RequestHelper

Functionality like in Cypress where you can wait for intercept. First paramater is the regex url of the endpoint and second paramater is the action you want to perform.

```ts
  const result = await requestHelper.actionAndwaitForResponse(
    "indexes/.*/queries",
    page.type('.DocSearch-Input', 'network'));
```


All available methods can be found in the [documentation][docsRequestHelper]

### ElementHelper
Element helper functions see [documentation][docsElementHelper]


### Documentation
[Documentation][docs]


### Backers & Sponsors
Support this project by becoming a [sponsor][sponsor].


[ts-badge]: https://img.shields.io/badge/TypeScript-5.0-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2018.12-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v18.x/docs/api/
[npm-badge]: https://badge.fury.io/js/playwright-helpers.svg
[npm]: https://www.npmjs.com/package/playwright-helpers
[typescript]: https://www.typescriptlang.org/
[typescript-5-0]: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://www.paypal.com/donate/?hosted_button_id=8BHNM42PKHJ5U
[docs]: https://jvdieten.github.io/playwright-helpers/modules.html
[docsElementHelper]: https://jvdieten.github.io/playwright-helpers/classes/ElementHelper.html
[docsRequestHelper]: https://jvdieten.github.io/playwright-helpers/classes/RequestHelper.html

