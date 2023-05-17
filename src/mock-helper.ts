import { Page } from "@playwright/test";
import path from "path";

export class MockHelper {

  page: Page;
  rootDirectory: string;

  /**
   * 
   * @param page reference to the playwright page
   * @param rootDirectory the base directory of th mock files
   */
  constructor(page: Page, rootDirectory: string) {
    this.page = page;
    this.rootDirectory = rootDirectory;
  }

  /**
   * Method to mock an endpoint and return a <scenario>.json placed in the rootdir
   * 
   * @param endpoint 
   * @param scenario 
   */
  async mockEndpoint(endpoint: MockEndpoint, scenario: string) {

    await this.page.route(new RegExp(endpoint.url), route =>
        route.fulfill({
            path: path.resolve(this.rootDirectory, endpoint.mockDir, `${scenario}.json`),
            headers: {'content-type': 'application/json', 'access-control-allow-origin': '*'}
        }));
  }

}

export interface MockEndpoint {
  url: string,
  mockDir: string
}