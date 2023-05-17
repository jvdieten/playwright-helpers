import { APIResponse, Page, Response, expect } from '@playwright/test';

/**
 * @Setup
 *
 *  ```ts
 *
    export type TestOptions = {
        requestHelper: RequestHelper;
    };

    export const test = base.extend<TestOptions>({
        requestHelper: async ({ page }, use) => {
            use(new RequestHelper(page));
    }
    });
 *  ```
 *
 * @Usage
 *
 *  ```ts
 *      test('has title', async ({ page, requestHelper }) => {
 *            await requestHelper.waitForResponse("/queries", page.type('.DocSearch-Input', 'network'))
 *      });
 *  ```
*/
export class RequestHelper {

    page: Page;
    tracker: RequestManager;
    /**
     * @param page
     */
    constructor(page: Page) {
        this.page = page;
    }
    /**
     * Verifies a given response code is matching the response status of the request
     * Returns an error message if expect is failing
     *
     * @param response
     * @param statusCode
     */
    async verifyStatusCode(response: APIResponse, statusCode: number): Promise<void> {
        expect(response.status(), `API response code ${statusCode} was not displayed.`).toBe(statusCode);
    }


    /**
     * Verify that a certain repsponse is received after an action is performed
     *
     * @param page
     * @param reqURL -> regular expression of the API URL can be relative
     * @param action -> playwright action type click etc full command i.e. page.click('button')
     * @returns Promise <Response>
     */
    async actionAndwaitForResponse(reqURL: string, action: any): Promise<Response> {

        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                (new RegExp(reqURL)).test(res.url())
            ),
            await action
        ])

        return response;

    }

    /**
     * Verify that all xhr requests are completed before we continue
     *
     * @param action -> playwright action type click etc full command i.e. page.click('button')
     */
    async actionAndWaitForAllXhrRequestsToFinish(action: any): Promise<any> {
        this.tracker = new RequestManager(this.page);

        await Promise.all([
            // execute some playwright action
            await action,
            // and make sure we issue at least one XHR request
            this.page.waitForRequest(request => request.resourceType() === 'xhr'),
          ]);

        await expect.poll(() => this.tracker.allRequests().filter((request:any) => request.resourceType() === 'xhr').length, 'requests of type xhr are not finished within timeout').toBe(0);
    }


}



class RequestManager {

    _page: Page;
    _requests: Set<unknown>;

    constructor(page: Page) {
      this._page = page;
      this._requests = new Set();
      this._onStarted = this._onStarted.bind(this);
      this._onFinished = this._onFinished.bind(this);
      this._page.on('request', this._onStarted);
      this._page.on('requestfinished', this._onFinished);
      this._page.on('requestfailed', this._onFinished);
    }

    _onStarted(request) { this._requests.add(request); }
    _onFinished(request) { this._requests.delete(request); }

    allRequests() { return Array.from(this._requests); }

    dispose() {
      this._page.removeListener('request', this._onStarted);
      this._page.removeListener('requestfinished', this._onFinished);
      this._page.removeListener('requestfailed', this._onFinished);
    }
  }
